import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1100, height: 900 }, deviceScaleFactor: 1 });
const pages = [['about','/pt'],['experience','/pt/experience'],['projects','/pt/projects'],['skills','/pt/skills']];
for (const [name,path] of pages) {
  await page.goto('http://localhost:3000'+path, { waitUntil:'networkidle', timeout:30000 });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `/tmp/shot-${name}.png` });
  console.log('shot', name);
}
await browser.close();
