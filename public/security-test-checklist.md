# Security Test Suite for alialshehriholding.com

## Directory Listing Tests
- [ ] Test: `curl -I https://alialshehriholding.com/views/` → Should return 403/404
- [ ] Test: `curl -I https://alialshehriholding.com/vendor/` → Should return 403/404  
- [ ] Test: `curl -I https://alialshehriholding.com/storage/` → Should return 403/404
- [ ] Test: `curl -I https://alialshehriholding.com/node_modules/` → Should return 403/404
- [ ] Test: `curl -I https://alialshehriholding.com/config/` → Should return 403/404

## Template Variable URL Tests
- [ ] Test: `curl -I "https://alialshehriholding.com/page/{{test}}"` → Should return 403/404 + X-Robots-Tag: noindex, nofollow
- [ ] Test: `curl -I "https://alialshehriholding.com/article/{{article.id}}"` → Should return 403/404 + X-Robots-Tag: noindex, nofollow
- [ ] Test: `curl -I "https://alialshehriholding.com/post/%7B%7Bpost.id%7D%7D"` → Should return 403/404 + X-Robots-Tag: noindex, nofollow

## Sensitive File Extension Tests
- [ ] Test: `curl -I https://alialshehriholding.com/config.env` → Should return 403/404
- [ ] Test: `curl -I https://alialshehriholding.com/template.twig` → Should return 403/404
- [ ] Test: `curl -I https://alialshehriholding.com/backup.sql` → Should return 403/404
- [ ] Test: `curl -I https://alialshehriholding.com/app.log` → Should return 403/404

## Security Headers Tests
- [ ] Test: `curl -I https://alialshehriholding.com/` → Should include X-Content-Type-Options: nosniff
- [ ] Test: `curl -I https://alialshehriholding.com/` → Should include X-Frame-Options: DENY
- [ ] Test: `curl -I https://alialshehriholding.com/` → Should include Referrer-Policy: strict-origin-when-cross-origin
- [ ] Test: `curl -I https://alialshehriholding.com/` → Should include Content-Security-Policy
- [ ] Test: `curl -I https://alialshehriholding.com/` → Should include Strict-Transport-Security

## Authentication Pages Tests
- [ ] Test: `curl -I https://alialshehriholding.com/login` → Should include X-Robots-Tag: noindex, nofollow
- [ ] Test: `curl -I https://alialshehriholding.com/auth` → Should include X-Robots-Tag: noindex, nofollow
- [ ] Test: `curl -I https://alialshehriholding.com/register` → Should include X-Robots-Tag: noindex, nofollow
- [ ] Test: `curl -I https://alialshehriholding.com/profile` → Should include X-Robots-Tag: noindex, nofollow
- [ ] Test: `curl -I https://alialshehriholding.com/admin` → Should include X-Robots-Tag: noindex, nofollow

## Robots.txt Tests
- [ ] Test: `curl https://alialshehriholding.com/robots.txt` → Should disallow /views, /vendor, /storage, /node_modules
- [ ] Test: `curl https://alialshehriholding.com/robots.txt` → Should disallow /login, /auth, /register, /profile, /admin
- [ ] Test: `curl https://alialshehriholding.com/robots.txt` → Should disallow template variable patterns

## HTTPS Enforcement Tests
- [ ] Test: `curl -I http://alialshehriholding.com/` → Should redirect to https with 301
- [ ] Test: `curl -I https://alialshehriholding.com/` → Should include HSTS header

## Performance Tests
- [ ] Test: `curl -I https://alialshehriholding.com/` → Should include gzip/compression headers
- [ ] Test: `curl -I https://alialshehriholding.com/style.css` → Should include cache-control headers
- [ ] Test: `curl -I https://alialshehriholding.com/script.js` → Should include cache-control headers

## Expected Results Summary
✅ All internal directories return 403/404 (no directory listing)
✅ All template variable URLs return 403/404 with noindex header
✅ All sensitive file extensions blocked
✅ All public pages include security headers
✅ All auth pages include noindex header
✅ robots.txt properly configured
✅ HTTPS enforced with HSTS
✅ Performance headers configured