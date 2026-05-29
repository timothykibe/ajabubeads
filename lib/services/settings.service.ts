import { settingsRepository } from '@/lib/db/settings.repository';

export type Settings = {
  mpesaConsumerKey?: string;
  mpesaConsumerSecret?: string;
  mpesaShortcode?: string;
  mpesaPasskey?: string;
  mpesaCallbackUrl?: string;
  cybersourceMerchantKeyId?: string;
  cybersourceMerchantSecretKey?: string;
  cybersourceWebhookSecret?: string;
};

export const settingsService = {
  async getSettings(): Promise<Settings> {
    return settingsRepository.getSettings();
  },

  async saveSettings(data: Settings): Promise<Settings> {
    return settingsRepository.updateSettings(data);
  },
};
