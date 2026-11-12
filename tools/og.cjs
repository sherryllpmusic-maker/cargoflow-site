const { createRequire } = require('module'); const p0 = require('path');
const puppeteer = createRequire('C:/Users/karti/Downloads/CargoFlow-Logistics-Ops/cargoflow-reels/package.json')('puppeteer-core');
(async () => { const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--no-sandbox'] }); const p = await b.newPage();
  await p.setViewport({ width: 1200, height: 630 }); await p.goto('http://localhost:5200/', { waitUntil: 'networkidle2' }); await new Promise((r) => setTimeout(r, 1500));
  await p.evaluate(() => { document.getElementById('bar').style.display = 'none'; document.querySelectorAll('.hint,.ghostbtn').forEach((e) => e.remove()); });
  await p.screenshot({ path: p0.join(__dirname, '..', 'og.png') }); await p.setViewport({ width: 1280, height: 800 }); await p.evaluate(() => window.scrollTo(0, 2300)); await new Promise((r) => setTimeout(r, 1500)); await p.screenshot({ path: p0.join(__dirname, '..', '.shots', 'desk.jpg'), type: 'jpeg', quality: 70 }); await b.close(); })();
