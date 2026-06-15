// Dev-only helper: capture the BIP-Brain landing screenshot and discover
// candidate Deep Metrics logo URLs. Run with: node scripts/capture.mjs
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

mkdirSync('public/projects', { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1280, height: 760 },
  deviceScaleFactor: 2,
});
const page = await ctx.newPage();

// 1) BIP-Brain screenshot
try {
  await page.goto('https://www.brain.ufscar.br/pt', {
    waitUntil: 'networkidle',
    timeout: 45000,
  });
  await page.waitForTimeout(1500);
  // dismiss cookie consent if present
  try {
    await page.getByRole('button', { name: /aceitar|accept/i }).click({ timeout: 4000 });
  } catch {
    /* no banner */
  }
  await page.waitForTimeout(1200);
  await page.screenshot({ path: 'public/projects/bip-brain.png' });
  console.log('OK: bip-brain.png captured');
} catch (e) {
  console.log('WARN bip-brain:', e.message);
}

// 2) Deep Metrics logo candidates
try {
  await page.goto('https://deepmetrics.com.br', {
    waitUntil: 'domcontentloaded',
    timeout: 30000,
  });
  await page.waitForTimeout(1500);
  const candidates = await page.evaluate(() => {
    const out = {};
    out.og = document
      .querySelector('meta[property="og:image"]')
      ?.getAttribute('content');
    out.apple = document
      .querySelector('link[rel="apple-touch-icon"]')
      ?.getAttribute('href');
    out.icon = document
      .querySelector('link[rel="icon"]')
      ?.getAttribute('href');
    const imgs = [...document.querySelectorAll('img')]
      .map((i) => i.src)
      .filter((s) => /logo|brand|deep/i.test(s))
      .slice(0, 5);
    out.imgs = imgs;
    return out;
  });
  console.log('DEEPMETRICS_CANDIDATES', JSON.stringify(candidates, null, 2));
} catch (e) {
  console.log('WARN deepmetrics:', e.message);
}

await browser.close();
