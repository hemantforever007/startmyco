# StartMyCo — Static Website

Business registration & compliance services platform for Indian startups and SMEs.  
Built with plain HTML, CSS, and vanilla JS — no build step, GitHub Pages ready.

---

## Project Structure

```
startmyco/
├── index.html   — Single-page site with section anchors
├── styles.css   — All styles (mobile-first, responsive)
├── script.js    — Nav toggle, smooth scroll, form validation, animations
├── CNAME        — Custom domain for GitHub Pages
└── README.md    — This file
```

---

## Local Development

No build step required.

```bash
# Python (Python 3)
python3 -m http.server 8000
# open http://localhost:8000

# Node.js
npx serve .
# open http://localhost:3000
```

---

## Deploy to GitHub Pages

### 1. Create a GitHub repository

1. Go to **github.com/new**
2. Name the repository `startmyco` (or anything you like)
3. Set visibility to **Public**
4. Click **Create repository** — do **not** add a README (you already have one)

### 2. Push code

```bash
cd /path/to/startmyco

git init
git add .
git commit -m "Initial commit: StartMyCo website"
git remote add origin https://github.com/YOUR_USERNAME/startmyco.git
git branch -M main
git push -u origin main
```

### 3. Enable GitHub Pages

1. Open your repo on GitHub → **Settings → Pages**
2. Under **Source**, choose **Deploy from a branch**
3. Select branch **main**, folder **/ (root)**
4. Click **Save**

Your site goes live at `https://YOUR_USERNAME.github.io/startmyco` within ~60 seconds.

---

## Custom Domain — startmyco.com

### 4. Tell GitHub Pages about your domain

The `CNAME` file already contains `startmyco.com`.  
GitHub Pages reads this file automatically when Pages is enabled.

You can also set it in the UI:  
**Settings → Pages → Custom domain** → type `startmyco.com` → **Save**

### 5. Add DNS records at your registrar

Log in to your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.) and add:

**A records** (point root domain → GitHub Pages)

| Type | Name / Host | Value            | TTL  |
|------|-------------|------------------|------|
| A    | @           | 185.199.108.153  | 3600 |
| A    | @           | 185.199.109.153  | 3600 |
| A    | @           | 185.199.110.153  | 3600 |
| A    | @           | 185.199.111.153  | 3600 |

**CNAME record** (point www → your Pages URL)

| Type  | Name / Host | Value                         | TTL  |
|-------|-------------|-------------------------------|------|
| CNAME | www         | YOUR_USERNAME.github.io       | 3600 |

> Replace `YOUR_USERNAME` with your actual GitHub username.

### 6. Wait for DNS propagation

DNS changes take anywhere from a few minutes to 48 hours.  
Check propagation at **dnschecker.org** or run:

```bash
dig startmyco.com +short
# Should return the four GitHub IPs above
```

### 7. Enforce HTTPS

Once GitHub verifies your custom domain:

1. **Settings → Pages**
2. Tick **Enforce HTTPS**
3. Wait a few minutes for the Let's Encrypt certificate to issue

Your site is then live at **https://startmyco.com** and **https://www.startmyco.com**.

---

## Customisation Guide

| What to change            | Where                                           |
|---------------------------|-------------------------------------------------|
| Phone number              | `index.html` — search `1800-000-0000`           |
| Email                     | `index.html` footer section                     |
| WhatsApp number           | `index.html` footer — replace `98XXX XXXXX`    |
| Brand colors              | `styles.css` → `:root` CSS variables           |
| Service descriptions      | `index.html` `.service-card` blocks             |
| Testimonials              | `index.html` `.testi-card` blocks               |
| Company info / CIN / GST  | `index.html` footer-bottom                      |
| Form submission backend   | `script.js` — replace the success block with your API call / form service (Formspree, EmailJS, etc.) |
| Add Google Analytics      | Paste the GA `<script>` tag before `</head>` in `index.html` |
| Add a favicon             | Save a `favicon.ico` in root; add `<link rel="icon" href="favicon.ico">` in `<head>` |

---

## Connecting a Form Service (Formspree example)

Replace the `<form>` tag in `index.html`:

```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST" ...>
```

And update the submit handler in `script.js` to do a `fetch` POST instead of hiding the form client-side.

---

## License

MIT — use freely for your business.
