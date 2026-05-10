// Headless Chrome smoke test for the Frame dev server.
// Walks through Pricing → Auth → FRAMEApp, exercises the main interactions,
// fails on any console error or unhandled rejection.
//
// Usage:
//   npm run dev:full          # in one terminal
//   node scripts/smoke-test.mjs

import puppeteer from 'puppeteer-core';

const URL = process.env.SMOKE_URL || 'http://localhost:5173/';
const CHROME =
  process.env.CHROME_PATH ||
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const errors = [];
const warnings = [];

function log(label, msg) {
  console.log(`[${label}] ${msg}`);
}

async function main() {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 480, height: 900 });

  page.on('console', (m) => {
    const t = m.type();
    if (t === 'error') errors.push('console.error: ' + m.text());
    else if (t === 'warning') warnings.push('console.warn: ' + m.text());
  });
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('requestfailed', (req) => {
    const f = req.failure();
    if (f && !req.url().includes('/api/')) {
      errors.push('requestfailed: ' + req.url() + ' — ' + f.errorText);
    }
  });

  log('nav', URL);
  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 15000 });

  // Clear any persisted state from prior runs so assertions are stable
  await page.evaluate(() => {
    for (const k of Object.keys(localStorage)) {
      if (k.startsWith('frame:')) localStorage.removeItem(k);
    }
  });
  await page.reload({ waitUntil: 'networkidle2' });

  // ─── Pricing ────────────────────────────────────────────────────────────
  await page.waitForSelector('.plan-card', { timeout: 5000 });
  const planCount = await page.$$eval('.plan-card', (els) => els.length);
  if (planCount !== 4) throw new Error(`Expected 4 plan cards, got ${planCount}`);
  log('pricing', `${planCount} plan cards rendered`);

  const headline = await page.$eval('.pg-headline', (el) => el.textContent);
  if (!headline.includes('Every shot')) throw new Error('Pricing headline missing');
  log('pricing', 'headline ok');

  // Toggle annual billing to make sure toggle works
  await page.click('.toggle-track');
  await page.waitForFunction(
    () => document.querySelector('.toggle-track')?.classList.contains('on'),
    { timeout: 1000 }
  );
  log('pricing', 'annual toggle ok');

  // Open a FAQ
  await page.click('.faq-item');
  await page.waitForFunction(
    () => document.querySelector('.faq-a')?.classList.contains('open'),
    { timeout: 1000 }
  );
  log('pricing', 'FAQ expand ok');

  // Select the third plan (Pro), verify checkout bar appears with price
  await page.evaluate(() => document.querySelectorAll('.plan-card')[2].click());
  await page.waitForSelector('.checkout-bar.visible', { timeout: 2000 });
  const checkoutText = await page.$eval('.checkout-bar', (el) => el.textContent);
  if (checkoutText.includes('undefined')) {
    throw new Error('Checkout bar shows undefined: ' + checkoutText);
  }
  if (!checkoutText.includes('Pro')) {
    throw new Error('Expected "Pro" in checkout bar, got: ' + checkoutText);
  }
  log('pricing', 'checkout bar ok: ' + checkoutText.replace(/\s+/g, ' ').trim());

  // Click the checkout button to advance to Auth with the selected plan
  await page.click('.checkout-btn');

  // ─── Auth ──────────────────────────────────────────────────────────────
  await page.waitForSelector('.auth-card', { timeout: 5000 });
  log('auth', 'auth card rendered');

  // Switch login mode
  const switchBtn = await page.$('.auth-switch button');
  if (!switchBtn) throw new Error('Auth mode-switch button missing');
  await switchBtn.click();
  log('auth', 'switched mode');

  // Continue as guest to enter the app
  await page.click('.auth-guest');

  // ─── FRAMEApp ──────────────────────────────────────────────────────────
  await page.waitForSelector('.app-hdr', { timeout: 5000 });
  log('app', 'app header rendered');

  // All four tabs present?
  const tabs = await page.$$eval('.app-tab', (els) =>
    els.map((e) => e.textContent.trim())
  );
  const expectedTabs = ['Shot List', 'Moodboard', 'Schedule', 'Notes & Crew'];
  for (const t of expectedTabs) {
    if (!tabs.includes(t)) throw new Error(`Missing tab "${t}". Got: ${tabs.join(', ')}`);
  }
  log('app', `tabs: ${tabs.join(' | ')}`);

  // Add a manual shot
  await page.click('.aadd-row');
  const shotsAfterAdd = await page.$$eval('.shot-card', (els) => els.length);
  if (shotsAfterAdd !== 1) throw new Error(`Expected 1 shot card, got ${shotsAfterAdd}`);
  log('app', 'manual add shot ok');

  // Switch to Moodboard tab and verify empty state
  const moodTab = await page.evaluateHandle(() =>
    [...document.querySelectorAll('.app-tab')].find((t) =>
      t.textContent.includes('Moodboard')
    )
  );
  await moodTab.asElement().click();
  await page.waitForSelector('.aempty', { timeout: 2000 });
  log('app', 'moodboard tab ok');

  // Switch to Schedule tab and verify pre-seeded blocks
  const schedTab = await page.evaluateHandle(() =>
    [...document.querySelectorAll('.app-tab')].find((t) =>
      t.textContent.includes('Schedule')
    )
  );
  await schedTab.asElement().click();
  await page.waitForSelector('.blk', { timeout: 2000 });
  const blockCount = await page.$$eval('.blk', (els) => els.length);
  if (blockCount < 3) throw new Error(`Expected ≥3 schedule blocks, got ${blockCount}`);
  log('app', `${blockCount} schedule blocks ok`);

  // Switch to Notes tab
  const notesTab = await page.evaluateHandle(() =>
    [...document.querySelectorAll('.app-tab')].find((t) =>
      t.textContent.includes('Notes')
    )
  );
  await notesTab.asElement().click();
  await page.waitForSelector('.notes-ta', { timeout: 2000 });
  log('app', 'notes tab ok');

  // Take a screenshot of each screen for human review
  await page.screenshot({ path: '/tmp/frame-notes.png', fullPage: true });
  log('shot', 'wrote /tmp/frame-notes.png');

  // ─── Verdict ────────────────────────────────────────────────────────────
  await browser.close();

  if (warnings.length) {
    console.log('\n--- WARNINGS ---');
    warnings.forEach((w) => console.log(w));
  }
  if (errors.length) {
    console.log('\n--- ERRORS ---');
    errors.forEach((e) => console.log(e));
    process.exit(1);
  }
  console.log('\n✓ SMOKE TEST PASSED');
}

main().catch((e) => {
  console.error('\n✗ SMOKE TEST FAILED:', e.message);
  if (errors.length) {
    console.log('\n--- console errors captured before failure ---');
    errors.forEach((x) => console.log(x));
  }
  process.exit(1);
});
