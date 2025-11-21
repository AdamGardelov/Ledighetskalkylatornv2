# Analytics Setup

## Vercel Analytics

This project uses Vercel Analytics for tracking website traffic and performance.

### Features:
- **Page views** - Track page visits
- **Unique visitors** - Count unique users
- **Referrers** - See where traffic comes from
- **Countries** - Geographic distribution
- **Performance metrics** - Page load times and Core Web Vitals

### Setup:
1. The analytics packages are already installed (`@vercel/analytics` and `@vercel/speed-insights`)
2. Components are added in `src/main.tsx`
3. Analytics will automatically work when deployed to Vercel
4. View analytics in your Vercel dashboard under the "Analytics" tab

### Privacy:
- Vercel Analytics is privacy-friendly
- No cookies required
- GDPR compliant
- No personal data collected

### Alternative: Google Analytics

If you prefer Google Analytics, you can:

1. Get a Google Analytics 4 (GA4) measurement ID
2. Add it to `index.html`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

3. Or use a React library like `react-ga4`

