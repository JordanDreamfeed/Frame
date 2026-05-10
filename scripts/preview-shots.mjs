import puppeteer from 'puppeteer-core';

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new',
  args: ['--no-sandbox']
});
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 });

const errors = [];
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
page.on('console', (m) => {
  if (m.type() === 'error') errors.push('console.error: ' + m.text());
});

await page.goto('http://localhost:5173/preview.html', { waitUntil: 'networkidle2' });
await new Promise((r) => setTimeout(r, 1500)); // let webfonts/imgs settle

const sections = ['pricing', 'auth', 'shots', 'moodboard', 'schedule', 'notes'];
for (const s of sections) {
  await page.evaluate((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'instant', block: 'start' });
  }, s);
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: `/tmp/preview-${s}.png`, fullPage: false });
  console.log('preview-' + s);
}

// also a full-page composite
await page.evaluate(() => window.scrollTo(0, 0));
await new Promise((r) => setTimeout(r, 400));
await page.screenshot({ path: '/tmp/preview-full.png', fullPage: true });
console.log('preview-full');

if (errors.length) {
  console.log('ERRORS:');
  errors.forEach((e) => console.log(' -', e));
}

await browser.close();
console.log('done');
