// Screenshots the site at phone size at several scroll positions, and reports console errors and sideways overflow.
// usage: node tools/shot.cjs [width] [height]   (needs the site served on http://localhost:5200)
const { createRequire } = require('module'); const path = require('path'); const fs = require('fs');
const puppeteer = createRequire('C:/Users/karti/Downloads/CargoFlow-Logistics-Ops/cargoflow-reels/package.json')('puppeteer-core');
(async () => {
  const W = Number(process.argv[2] || 390), H = Number(process.argv[3] || 844); const out = path.join(__dirname, '..', '.shots'); fs.mkdirSync(out, { recursive: true });
  const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--no-sandbox'] });
  const p = await b.newPage(); await p.setViewport({ width: W, height: H, deviceScaleFactor: 2, isMobile: W < 700, hasTouch: W < 700 });
  const errs = []; p.on('pageerror', (e) => errs.push('pageerror ' + e.message)); p.on('console', (m) => { if (m.type() === 'error') errs.push('console ' + m.text()); });
  await p.goto('http://localhost:5200/', { waitUntil: 'networkidle2' }); await new Promise((r) => setTimeout(r, 1500));
  const total = await p.evaluate(() => document.documentElement.scrollHeight); const over = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  console.log('page height', total, 'sideways overflow px', over);
  const marks = (process.argv[4] || '0,0.12,0.26,0.4,0.55,0.7,0.85,1').split(',').map(Number);
  for (const [i, f] of marks.entries()) { await p.evaluate((y) => window.scrollTo(0, y), Math.round((total - H) * f)); await new Promise((r) => setTimeout(r, 1300)); await p.screenshot({ path: path.join(out, `s${i}.jpg`), type: 'jpeg', quality: 70 }); }
  if (process.argv[5] === 'book') { await p.evaluate(() => window.scrollTo(0, 0)); await new Promise((r) => setTimeout(r, 500)); await p.click('.row .cta'); await new Promise((r) => setTimeout(r, 700)); await p.screenshot({ path: path.join(out, 'b0.jpg'), type: 'jpeg', quality: 70 }); await p.click('.opt'); await new Promise((r) => setTimeout(r, 400)); await p.click('.opt:nth-child(1)'); await p.click('.opt:nth-child(3)'); await p.screenshot({ path: path.join(out, 'b1.jpg'), type: 'jpeg', quality: 70 }); await p.click('#foot .cta'); await new Promise((r) => setTimeout(r, 400)); await p.click('.opt:nth-child(2)'); await p.click('.opt:nth-child(7)'); await p.click('#foot .cta'); await new Promise((r) => setTimeout(r, 400)); await p.screenshot({ path: path.join(out, 'b2.jpg'), type: 'jpeg', quality: 70 }); }
  console.log(errs.length ? errs.join('\n') : 'no errors'); await b.close();
})();
