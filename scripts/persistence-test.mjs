// Verify localStorage persistence: add a shot + custom title, reload, confirm survived.
import puppeteer from 'puppeteer-core';

const URL = 'http://localhost:5173/';
const CHROME =
  process.env.CHROME_PATH ||
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox']
});
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900 });

const errs = [];
page.on('pageerror', (e) => errs.push('pageerror: ' + e.message));
page.on('console', (m) => {
  if (m.type() === 'error') errs.push('console.error: ' + m.text());
});

// Clear any prior state so this is a clean test
await page.goto(URL, { waitUntil: 'networkidle2' });
await page.evaluate(() => {
  for (const k of Object.keys(localStorage)) {
    if (k.startsWith('frame:')) localStorage.removeItem(k);
  }
});

// Enter the app
await page.reload({ waitUntil: 'networkidle2' });
await page.click('.beta-btn');
await page.waitForSelector('.auth-guest');
await page.click('.auth-guest');
await page.waitForSelector('.app-hdr');

// Set the shoot title to something unique
const TITLE = 'Persistence Test ' + Date.now();
await page.click('.hdr-inp', { clickCount: 3 });
await page.type('.hdr-inp', TITLE);

// Add a shot with a custom description
await page.click('.aadd-row');
await page.waitForSelector('.shot-card');
const DESC = 'Open wide on rooftop. Tilt up.';
await page.evaluate((desc) => {
  const inp = document.querySelector('.shot-card .finp');
  if (inp) {
    inp.value = '';
    const setter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value'
    ).set;
    setter.call(inp, desc);
    inp.dispatchEvent(new Event('input', { bubbles: true }));
  }
}, DESC);
await new Promise((r) => setTimeout(r, 400));

// Reload the page
await page.reload({ waitUntil: 'networkidle2' });

// Should land back in the app (skipping pricing) — but we navigated through
// pricing/auth which are separate screens. Reload starts at pricing.
// So we need to enter the app again, but persisted state should still be there.
await page.click('.beta-btn');
await page.waitForSelector('.auth-guest');
await page.click('.auth-guest');
await page.waitForSelector('.app-hdr');

// Verify title was restored
const restoredTitle = await page.$eval('.hdr-inp', (el) => el.value);
if (restoredTitle !== TITLE) {
  console.log('✗ FAIL: title did not persist');
  console.log('  expected:', TITLE);
  console.log('  got:     ', restoredTitle);
  process.exit(1);
}
console.log('✓ title persisted');

// Verify shot was restored
const shotCount = await page.$$eval('.shot-card', (els) => els.length);
if (shotCount !== 1) {
  console.log('✗ FAIL: expected 1 shot, got', shotCount);
  process.exit(1);
}
const restoredDesc = await page.$eval('.shot-card .finp', (el) => el.value);
if (restoredDesc !== DESC) {
  console.log('✗ FAIL: shot description did not persist');
  console.log('  expected:', DESC);
  console.log('  got:     ', restoredDesc);
  process.exit(1);
}
console.log('✓ shot persisted with description');

// Clean up so subsequent runs aren't affected
await page.evaluate(() => {
  for (const k of Object.keys(localStorage)) {
    if (k.startsWith('frame:')) localStorage.removeItem(k);
  }
});

if (errs.length) {
  console.log('\n--- ERRORS ---');
  errs.forEach((e) => console.log(e));
  process.exit(1);
}

await browser.close();
console.log('\n✓ PERSISTENCE TEST PASSED');
