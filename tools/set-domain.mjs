// Replaces the placeholder domain everywhere once you know your real address:  node tools/set-domain.mjs https://www.yourdomain.in
import fs from 'fs';
const to = (process.argv[2] || '').replace(/\/+$/, ''); if (!/^https:\/\//.test(to)) { console.log('usage: node tools/set-domain.mjs https://your-domain'); process.exit(1); }
const host = to.replace(/^https:\/\//, '');
for (const f of ['index.html', 'robots.txt', 'sitemap.xml', 'llms.txt']) { if (!fs.existsSync(f)) continue; fs.writeFileSync(f, fs.readFileSync(f, 'utf8').split('https://YOUR-DOMAIN').join(to).split('YOUR-DOMAIN').join(host)); console.log('updated', f); }
