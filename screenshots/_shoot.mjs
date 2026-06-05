import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const pages = [
  { name: 'index', file: 'index.html' },
  { name: 'story', file: 'story.html' },
];

const viewports = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

const browser = await puppeteer.launch({ headless: 'new' });
try {
  for (const pg of pages) {
    const pageUrl = 'file://' + path.resolve(__dirname, '..', pg.file);
    for (const vp of viewports) {
      const page = await browser.newPage();
      await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 });
      await page.goto(pageUrl, { waitUntil: 'networkidle0' });
      // Tailwind CDN + fonts settle
      await new Promise(r => setTimeout(r, 1200));
      const out = path.join(__dirname, `${pg.name}-${vp.name}.png`);
      await page.screenshot({ path: out, fullPage: true });
      console.log(`shot ${pg.name} ${vp.name} → ${out}`);
      await page.close();
    }
  }
} finally {
  await browser.close();
}
