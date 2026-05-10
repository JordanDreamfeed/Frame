// Desktop-sized screenshots (1280x900) for the in-app screens.
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
await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 });

await page.goto(URL, { waitUntil: 'networkidle2' });

await page.waitForSelector('.plan-card');
await page.screenshot({ path: '/tmp/frame-d1-pricing.png', fullPage: true });
console.log('d1 pricing');

await page.click('.beta-btn');
await page.waitForSelector('.auth-card');
await page.screenshot({ path: '/tmp/frame-d2-auth.png', fullPage: true });
console.log('d2 auth');

await page.click('.auth-guest');
await page.waitForSelector('.app-hdr');

await page.waitForSelector('.ai-wrap');
await page.screenshot({ path: '/tmp/frame-d3-shots-empty.png', fullPage: true });
console.log('d3 shots empty');

// Add a shot manually so we can see the slate-style shot card
await page.click('.aadd-row');
await page.waitForSelector('.shot-card');
await new Promise((r) => setTimeout(r, 300));
await page.screenshot({ path: '/tmp/frame-d3b-shots-with-card.png', fullPage: true });
console.log('d3b shots with card');

async function clickTab(label) {
  const handle = await page.evaluateHandle(
    (lbl) =>
      [...document.querySelectorAll('.app-tab')].find((t) =>
        t.textContent.includes(lbl)
      ),
    label
  );
  await handle.asElement().click();
  await new Promise((r) => setTimeout(r, 350));
}

await clickTab('Moodboard');
await page.waitForSelector('.aempty');
await page.screenshot({ path: '/tmp/frame-d4-moodboard.png', fullPage: true });
console.log('d4 moodboard');

await clickTab('Schedule');
await page.waitForSelector('.blk');
await page.screenshot({ path: '/tmp/frame-d5-schedule.png', fullPage: true });
console.log('d5 schedule');

await clickTab('Notes');
await page.waitForSelector('.notes-ta');
await new Promise((r) => setTimeout(r, 350));
await page.screenshot({ path: '/tmp/frame-d6-notes.png', fullPage: true });
console.log('d6 notes');

await browser.close();
console.log('done');
