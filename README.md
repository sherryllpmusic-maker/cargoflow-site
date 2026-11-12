# CargoFlow website

Plain HTML, CSS and JavaScript. No build step, no framework, no server. Free to host anywhere (Cloudflare Pages, Netlify, GitHub Pages).

## Before going live (3 things)
1. **WhatsApp number**: open `app.js`, set `WHATSAPP_NUMBER = '91XXXXXXXXXX'`. The demo booking then opens WhatsApp to you with the visitor's choices typed in, and their number arrives with the message, so they type nothing.
2. **Domain**: `node tools/set-domain.mjs https://your-domain` (fills the address into the page, robots.txt, sitemap.xml and llms.txt).
3. **Optional lead safety net**: create a free form endpoint (Web3Forms or Formspree) and put its URL in `FORM_ENDPOINT` in `app.js`, so a booking is kept even if the visitor never presses send in WhatsApp.

## Deploy free
Cloudflare Pages: connect the folder or drag it in, no build command, output folder is the root. Or Netlify Drop (drag the folder).
Then submit `https://your-domain/sitemap.xml` in Google Search Console and Bing Webmaster Tools.

## Your photos
Put Indian truck / road photos you have the right to use in `assets/photos/` and list them in `PHOTOS` in `app.js`. A swipe strip appears. (Pinterest images belong to their owners: use your own, or free-licence ones.)

## What is where
- `index.html`: all copy, English with Hindi on the toggle, plus search markup (title, description, keywords, Open Graph, schema.org Organization, SoftwareApplication and FAQ).
- `styles.css`: mobile first, curved panels, liquid glass.
- `app.js`: the road and truck, scroll effects, the question game, language switch, booking sheet.
- `llms.txt`, `robots.txt`, `sitemap.xml`: let search engines and AI assistants (ChatGPT, Claude, Perplexity, Gemini) read a short, accurate description. `robots.txt` allows their crawlers on purpose.
- `tools/shot.cjs`: phone-size screenshots for testing. `tools/og.cjs`: rebuilds `og.png`.

## What the page says and does not say
It sells outcomes (trucks accounted for, money in the right book, the evening report, fewer phone calls), not how each feature works. No prices, no fleet sizes, no invented numbers. The one product glimpse is a cropped sample-data card, labelled as such. Nothing on a public page can be hidden from a determined competitor, so the protection is simply that the depth is not published.
