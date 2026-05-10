// Drive the app through each screen and tab, save a screenshot of each.
// Run after `npm run dev:full` is up.

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
await page.setViewport({ width: 480, height: 900, deviceScaleFactor: 2 });

await page.goto(URL, { waitUntil: 'networkidle2' });

await page.waitForSelector('.plan-card');
await page.screenshot({ path: '/tmp/frame-1-pricing.png', fullPage: true });
console.log('1 pricing');

await page.click('.beta-btn');
await page.waitForSelector('.auth-card');
await page.screenshot({ path: '/tmp/frame-2-auth.png', fullPage: true });
console.log('2 auth');

await page.click('.auth-guest');
await page.waitForSelector('.app-hdr');

// shots tab is default
await page.waitForSelector('.ai-wrap');
await page.screenshot({ path: '/tmp/frame-3-shots.png', fullPage: true });
console.log('3 shots');

async function clickTab(label) {
  const handle = await page.evaluateHandle(
    (lbl) =>
      [...document.querySelectorAll('.app-tab')].find((t) =>
        t.textContent.includes(lbl)
      ),
    label
  );
  await handle.asElement().click();
  // Let the active-indicator CSS transition (.25s) finish before snapping.
  await new Promise((r) => setTimeout(r, 350));
}

await clickTab('Moodboard');
await page.waitForSelector('.aempty');
await page.screenshot({ path: '/tmp/frame-4-moodboard.png', fullPage: true });
console.log('4 moodboard');

await clickTab('Schedule');
await page.waitForSelector('.blk');
await page.screenshot({ path: '/tmp/frame-5-schedule.png', fullPage: true });
console.log('5 schedule');

await clickTab('Notes');
await page.waitForSelector('.notes-ta');
await new Promise((r) => setTimeout(r, 350));
await page.screenshot({ path: '/tmp/frame-6-notes.png', fullPage: true });
console.log('6 notes');

await browser.close();
console.log('done');
