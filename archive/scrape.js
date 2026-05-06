const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://playful-paprenjak-06fb5c.netlify.app/', { waitUntil: 'networkidle' });
  // wait for the unpacking to finish and React to render
  await page.waitForTimeout(3000);
  const html = await page.content();
  fs.writeFileSync('scraped.html', html);
  console.log('Successfully scraped HTML');
  await browser.close();
})();
