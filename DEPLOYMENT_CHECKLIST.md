# 🚀 Ajabu Beads - Production Deployment Checklist

## Pre-Deployment (Local Testing)

### Environment Setup
- [ ] Copy `.env.local.example` to `.env.local`
- [ ] Fill all required environment variables
- [ ] Generate NEXTAUTH_SECRET: `openssl rand -base64 32`
- [ ] Verify no secrets in git (check .gitignore)

### Database
- [ ] Create Supabase project (or use PostgreSQL)
- [ ] Add DATABASE_URL to .env.local
- [ ] Run `pnpm run prisma:generate`
- [ ] Run `pnpm run prisma:migrate`
- [ ] Verify migrations successful: `pnpm run prisma:studio`

### Dependencies
- [ ] Run `pnpm install`
- [ ] No security vulnerabilities: `pnpm audit`
- [ ] All packages up to date

### Local Testing
- [ ] `pnpm dev` runs without errors
- [ ] User registration works
- [ ] User login works
- [ ] Product listing works
- [ ] Order creation works
- [ ] M-Pesa payment flow works
- [ ] Admin dashboard loads
- [ ] Admin product CRUD works
- [ ] Admin orders working
- [ ] Analytics showing data
- [ ] WhatsApp widget visible
- [ ] Emails sending (check Resend dashboard)
- [ ] No console errors
- [ ] Mobile responsive

### Code Quality
- [ ] Run linter: `pnpm lint`
- [ ] No warnings/errors
- [ ] TypeScript strict mode enabled
- [ ] All imports/exports correct

### Build
- [ ] `pnpm build` completes successfully
- [ ] No build warnings
- [ ] Bundle size reasonable

---

## Vercel Deployment

### 1. Push to GitHub
```bash
git add .
git commit -m "feat: complete ecommerce platform"
git push origin main
```

### 2. Connect to Vercel
```bash
# Option 1: Web interface
# 1. Go to vercel.com
# 2. Import project from GitHub
# 3. Select repository

# Option 2: CLI
vercel --prod
```

### 3. Environment Variables
In Vercel Dashboard:
1. Go to Settings → Environment Variables
2. Add all variables from `.env.local`:
   ```
   DATABASE_URL
   DIRECT_URL
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   NEXTAUTH_SECRET
   NEXTAUTH_URL (set to your domain)
   MPESA_CONSUMER_KEY
   MPESA_CONSUMER_SECRET
   MPESA_SHORTCODE
   MPESA_PASSKEY
   MPESA_CALLBACK_URL (update to production)
   CYBERSOURCE_MERCHANT_ID
   CYBERSOURCE_MERCHANT_KEY_ID
   CYBERSOURCE_MERCHANT_SECRET_KEY
   RESEND_API_KEY
   RESEND_FROM_EMAIL
   ADMIN_EMAIL
   ```

### 4. Domain Setup
1. Go to Vercel Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Verify domain

### 5. Database for Production
1. Create **new** Supabase project for production
2. Different from dev/test database
3. Update DATABASE_URL with production connection
4. Run migrations on production: `pnpm run prisma:migrate` (via Vercel CLI)

### 6. Verify Deployment
- [ ] Site accessible at custom domain
- [ ] API endpoints working
- [ ] Admin dashboard accessible
- [ ] Database queries working

---

## Post-Deployment Configuration

### 1. M-Pesa Production Setup
- [ ] Switch from sandbox to production environment
- [ ] Get production API keys from Safaricom
- [ ] Update MPESA_ENVIRONMENT="production"
- [ ] Update MPESA_CALLBACK_URL to production domain
- [ ] Test payment flow end-to-end
- [ ] Document production credentials

### 2. CyberSource Production Setup
- [ ] Get production merchant credentials
- [ ] Switch from test to production environment
- [ ] Update all CYBERSOURCE_* variables
- [ ] Test credit card payment end-to-end

### 3. Email Production Setup
- [ ] Verify domain in Resend dashboard
- [ ] Add DNS records for email authentication
- [ ] Update RESEND_FROM_EMAIL to verified domain
- [ ] Test welcome email
- [ ] Test order confirmation email
- [ ] Test all notification emails

### 4. WhatsApp Production
- [ ] Add real business phone number
- [ ] Link to WhatsApp Business API if needed
- [ ] Update in .env.local

### 5. Analytics (Optional)
- [ ] Setup PostHog account (if using)
- [ ] Add tracking code
- [ ] Verify events tracking

---

## Security Hardening

### API Security
- [ ] HTTPS only (automatic on Vercel)
- [ ] CORS configured for your domain
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (using Prisma)
- [ ] CSRF protection if needed

### Data Security
- [ ] Database backups enabled in Supabase
- [ ] Encryption at rest (Supabase default)
- [ ] Encryption in transit (HTTPS)
- [ ] No sensitive data in logs
- [ ] Regular security audits

### Authentication
- [ ] Passwords hashed (bcryptjs)
- [ ] JWT tokens secure
- [ ] Refresh token rotation
- [ ] No tokens in URLs
- [ ] Secure cookie flags

### Admin Security
- [ ] Change default admin password
- [ ] Add admin 2FA if available
- [ ] IP whitelist for admin (optional)
- [ ] Audit logs for admin actions
- [ ] Regular admin access reviews

---

## Monitoring & Maintenance

### Set Up Monitoring
- [ ] Vercel Analytics (automatic)
- [ ] Error tracking (Sentry optional)
- [ ] Database monitoring (Supabase)
- [ ] Email delivery tracking (Resend)
- [ ] Performance monitoring

### Set Up Alerts
- [ ] Payment failure alerts
- [ ] Database connection alerts
- [ ] Email delivery failures
- [ ] High error rate alerts
- [ ] Performance degradation alerts

### Backups
- [ ] Enable Supabase automated backups
- [ ] Schedule weekly manual backups
- [ ] Test backup restoration
- [ ] Document recovery procedure

### Logging
- [ ] Application logs enabled
- [ ] Database logs enabled
- [ ] API call logging
- [ ] Error tracking configured
- [ ] Access logs reviewed regularly

---

## Testing in Production

### Smoke Tests
- [ ] Homepage loads
- [ ] Product listing works
- [ ] Product detail works
- [ ] Admin dashboard loads
- [ ] Login works
- [ ] Registration works

### Transaction Tests
- [ ] Create order in production
- [ ] Test M-Pesa payment (small amount)
- [ ] Test CyberSource payment (test card)
- [ ] Verify email sent
- [ ] Verify database updated

### Performance Tests
- [ ] Page load times acceptable
- [ ] API response times good
- [ ] Database queries performant
- [ ] No N+1 queries

### Security Tests
- [ ] No sensitive data exposed
- [ ] XSS protection working
- [ ] CSRF tokens present
- [ ] Authorization working
- [ ] Rate limiting working

---

## Documentation

### Update Documentation
- [ ] README with production URLs
- [ ] Admin guide for your team
- [ ] Customer support guidelines
- [ ] Payment refund procedures
- [ ] Troubleshooting guide
- [ ] Runbook for common issues

### Create Runbooks
- [ ] How to respond to payment failures
- [ ] How to manually process order
- [ ] How to issue refund
- [ ] How to handle customer inquiries
- [ ] How to add new products

### Train Team
- [ ] Admin dashboard training
- [ ] Customer support training
- [ ] How to handle refunds
- [ ] How to track orders
- [ ] Security best practices

---

## Go-Live Checklist

### 24 Hours Before
- [ ] All testing completed
- [ ] Team trained
- [ ] Support team ready
- [ ] Documentation finalized
- [ ] Backup verified

### 1 Hour Before
- [ ] Final smoke test
- [ ] Team standing by
- [ ] Support team online
- [ ] Monitoring active

### Go-Live
- [ ] Announce launch
- [ ] Monitor closely for 24 hours
- [ ] Be ready for support
- [ ] Track early metrics

### Post-Launch
- [ ] Review first 24 hours data
- [ ] Handle any support issues
- [ ] Optimize based on feedback
- [ ] Plan next features

---

## Ongoing Operations

### Daily
- [ ] Check error logs
- [ ] Monitor sales
- [ ] Check payment success rate
- [ ] Monitor support tickets

### Weekly
- [ ] Review analytics
- [ ] Check top products
- [ ] Verify emails sending
- [ ] Check inventory levels
- [ ] Update blog/news

### Monthly
- [ ] Full analytics review
- [ ] Performance analysis
- [ ] Security audit
- [ ] Backup verification
- [ ] Plan improvements

### Quarterly
- [ ] Database optimization
- [ ] Code cleanup
- [ ] Dependencies update
- [ ] Security penetration test
- [ ] Plan new features

---

## Troubleshooting Production Issues

### Payment Not Working
1. Check M-Pesa/CyberSource dashboard
2. Verify API credentials
3. Check error logs in Vercel
4. Contact payment provider

### Database Connection Issue
1. Check DATABASE_URL correct
2. Verify Supabase status
3. Check network connectivity
4. Review Supabase logs

### Emails Not Sending
1. Check RESEND_API_KEY valid
2. Check email domain verified
3. Review Resend dashboard
4. Check error logs

### Admin Dashboard Not Loading
1. Check auth token valid
2. Verify NEXTAUTH_SECRET set
3. Check browser dev tools
4. Review Vercel logs

### Performance Degradation
1. Check database performance
2. Review Vercel analytics
3. Check for N+1 queries
4. Consider caching strategy

---

## Scaling Considerations

### When Traffic Increases
- [ ] Monitor database connections
- [ ] Enable caching if needed
- [ ] Consider CDN for images
- [ ] Scale Supabase if needed
- [ ] Add more Vercel regions

### When Data Grows
- [ ] Archive old data
- [ ] Optimize slow queries
- [ ] Add database indexes
- [ ] Consider data partitioning

### When Team Grows
- [ ] Add admin user roles
- [ ] Setup audit logging
- [ ] Create SOPs
- [ ] Document systems
- [ ] Train new team members

---

## Compliance & Legal

- [ ] Privacy policy updated
- [ ] Terms of service created
- [ ] Cookie notice added
- [ ] Data protection compliance (GDPR if needed)
- [ ] Payment processor agreements reviewed
- [ ] Terms accepted by customers

---

## Success Metrics

### Track These Metrics
- [ ] Daily active users
- [ ] Total revenue
- [ ] Average order value
- [ ] Payment success rate
- [ ] Customer satisfaction
- [ ] Support ticket response time
- [ ] Page load time
- [ ] API response time
- [ ] Error rate

---

## Launch Announcement

### Prepare Communications
- [ ] Website launch announcement
- [ ] Email to existing customers
- [ ] Social media posts
- [ ] Press release (optional)
- [ ] Influencer outreach
- [ ] Customer testimonials

---

## Final Sign-Off

Before going live, verify:
- [ ] CEO/Owner approval
- [ ] Product team ready
- [ ] Support team ready
- [ ] Finance ready for payments
- [ ] Marketing ready for launch
- [ ] All tests passing
- [ ] No critical issues
- [ ] Documentation complete

---

**🎉 Ready to Launch!**

Once you complete this checklist, your ecommerce platform is production-ready and can serve real customers with real payments!

Good luck! 🚀
