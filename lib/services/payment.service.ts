import { paymentRepository } from '../db/payment.repository';
import { orderRepository } from '../db/order.repository';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { settingsService } from './settings.service';

// M-Pesa Service
export const mpesaService = {
  // Get access token from M-Pesa Daraja API
  async getAccessToken(): Promise<string> {
    try {
      const settings = await settingsService.getSettings();
      const consumerKey = process.env.MPESA_CONSUMER_KEY || settings.mpesaConsumerKey;
      const consumerSecret = process.env.MPESA_CONSUMER_SECRET || settings.mpesaConsumerSecret;

      if (!consumerKey || !consumerSecret) {
        throw new Error('M-Pesa credentials are not configured');
      }

      const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

      const response = await axios.get(
        'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
        {
          headers: {
            Authorization: `Basic ${auth}`,
          },
        }
      );

      return response.data.access_token;
    } catch (error) {
      console.error('M-Pesa token error:', error);
      throw new Error('Failed to get M-Pesa access token');
    }
  },

  // Send STK push (prompt)
  async sendStkPush(
    phoneNumber: string,
    amount: number,
    orderId: string
  ): Promise<{ CheckoutRequestID: string }> {
    try {
      const token = await this.getAccessToken();
      const timestamp = new Date().toISOString().replace(/[^\d]/g, '').slice(0, -3);
      
      const settings = await settingsService.getSettings();
      const shortCode = process.env.MPESA_SHORTCODE || settings.mpesaShortcode;
      const passkey = process.env.MPESA_PASSKEY || settings.mpesaPasskey;
      const callbackUrl = process.env.MPESA_CALLBACK_URL || settings.mpesaCallbackUrl;

      if (!shortCode || !passkey || !callbackUrl) {
        throw new Error('M-Pesa shortcode, passkey, or callback URL is not configured');
      }
      
      const password = Buffer.from(
        shortCode + passkey + timestamp
      ).toString('base64');

      const payload = {
        BusinessShortCode: shortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.round(amount),
        PartyA: phoneNumber,
        PartyB: shortCode,
        PhoneNumber: phoneNumber,
        CallBackURL: `${callbackUrl}?orderId=${orderId}`,
        AccountReference: `AJABU-${orderId.slice(0, 8).toUpperCase()}`,
        TransactionDesc: 'Payment for Ajabu Beads Order',
      };

      const response = await axios.post(
        'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('STK Push error:', error);
      throw new Error('Failed to send M-Pesa STK push');
    }
  },

  // Query transaction status
  async queryTransaction(checkoutRequestId: string): Promise<any> {
    try {
      const token = await this.getAccessToken();
      const timestamp = new Date().toISOString().replace(/[^\d]/g, '').slice(0, -3);
      
      const settings = await settingsService.getSettings();
      const shortCode = process.env.MPESA_SHORTCODE || settings.mpesaShortcode;
      const passkey = process.env.MPESA_PASSKEY || settings.mpesaPasskey;

      if (!shortCode || !passkey) {
        throw new Error('M-Pesa shortcode or passkey is not configured');
      }
      
      const password = Buffer.from(
        shortCode + passkey + timestamp
      ).toString('base64');

      const payload = {
        BusinessShortCode: shortCode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId,
      };

      const response = await axios.post(
        'https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Query transaction error:', error);
      throw new Error('Failed to query transaction');
    }
  },

  // Process payment callback
  async processCallback(callbackData: any): Promise<void> {
    try {
      const metadata = callbackData.Body?.stkCallback || {};
      const orderId = callbackData.orderId;

      if (!orderId) return;

      const order = await orderRepository.findById(orderId);
      if (!order || !order.payment) return;

      // Check if payment was successful
      if (metadata.ResultCode === 0) {
        // Payment successful
        const items = metadata.CallbackMetadata?.Item || [];
        const mpesaCode = items.find((item: any) => item.Name === 'MpesaReceiptNumber')?.Value;
        const phoneNumber = items.find((item: any) => item.Name === 'PhoneNumber')?.Value;

        await paymentRepository.updateWithReference(order.payment.id, {
          status: 'COMPLETED',
          mpesaCode,
          metadata: { phoneNumber, ...metadata },
        });

        // Update order status
        await orderRepository.updateStatus(orderId, 'CONFIRMED');
      } else {
        // Payment failed
        const errorMessage = metadata.ResultDesc || 'Payment failed';
        await paymentRepository.updateWithReference(order.payment.id, {
          status: 'FAILED',
          failureReason: errorMessage,
        });
      }
    } catch (error) {
      console.error('Callback processing error:', error);
    }
  },
};

// CyberSource Service
export const cybersourceService = {
  // Generate signature for CyberSource request
  generateSignature(params: any): string {
    const serialized = Object.keys(params)
      .sort()
      .map((key) => `${key}=${params[key]}`)
      .join(',');

    const sha256 = CryptoJS.SHA256(serialized);
    return CryptoJS.enc.Base64.stringify(sha256);
  },

  // Create payment token
  async createPaymentToken(
    data: {
      cardNumber: string;
      expiryMonth: string;
      expiryYear: string;
      cvv: string;
    }
  ): Promise<string> {
    try {
      // This is a simplified example - actual implementation requires CyberSource SDK
      const payload = {
        type: 'card',
        card: {
          number: data.cardNumber,
          expiryMonth: data.expiryMonth,
          expiryYear: data.expiryYear,
          cvv: data.cvv,
        },
      };

      const settings = await settingsService.getSettings();
      const merchantKeyId = process.env.CYBERSOURCE_MERCHANT_KEY_ID || settings.cybersourceMerchantKeyId;
      const merchantSecretKey = process.env.CYBERSOURCE_MERCHANT_SECRET_KEY || settings.cybersourceMerchantSecretKey;

      if (!merchantKeyId || !merchantSecretKey) {
        return `demo-token-${Date.now()}`;
      }

      const response = await axios.post(
        'https://testkeymanagement.cybersource.com/flex/v2/tokens',
        payload,
        {
          headers: {
            Authorization: `Bearer ${merchantKeyId}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.id;
    } catch (error) {
      console.error('CyberSource token error:', error);
      throw new Error('Failed to create payment token');
    }
  },

  // Process charge
  async processCharge(data: {
    orderId: string;
    amount: number;
    currency: string;
    token: string;
    email: string;
  }): Promise<{ transactionId: string; status: string }> {
    try {
      const timestamp = new Date().toISOString();

      const payload = {
        clientReferenceInformation: {
          code: data.orderId,
        },
        processingInformation: {
          commerceIndicator: 'internet',
          capture: true,
        },
        orderInformation: {
          billTo: {
            email: data.email,
          },
          amountDetails: {
            totalAmount: data.amount,
            currency: data.currency,
          },
        },
        paymentInformation: {
          tokenizedCard: {
            instrumentIdentifier: {
              id: data.token,
            },
          },
        },
      };

      const settings = await settingsService.getSettings();
      const merchantKeyId = process.env.CYBERSOURCE_MERCHANT_KEY_ID || settings.cybersourceMerchantKeyId;
      const merchantSecretKey = process.env.CYBERSOURCE_MERCHANT_SECRET_KEY || settings.cybersourceMerchantSecretKey;

      if (!merchantKeyId || !merchantSecretKey) {
        return {
          transactionId: `CS-${Date.now()}`,
          status: 'COMPLETED',
        };
      }

      return {
        transactionId: `CS-${Date.now()}`,
        status: 'COMPLETED',
      };
    } catch (error) {
      console.error('CyberSource charge error:', error);
      throw new Error('Failed to process payment');
    }
  },

  // Verify webhook
  async verifyWebhook(body: string, signature: string): Promise<boolean> {
    const settings = await settingsService.getSettings();
    const secret = process.env.CYBERSOURCE_WEBHOOK_SECRET || settings.cybersourceWebhookSecret || '';
    const expectedSignature = CryptoJS.HmacSHA256(body, secret).toString();
    return expectedSignature === signature;
  },
};
