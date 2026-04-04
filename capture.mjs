import { chromium } from 'playwright';

(async () => {
  console.log("Iniciando Playwright...");
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER_LOG:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER_ERROR:', err.message));
  
  console.log("Navegando a http://localhost:5173/");
  await page.goto('http://localhost:5173/');
  
  await page.waitForTimeout(3000); 
  
  const content = await page.content();
  console.log("BODY HTML:", content.replace(/\n/g, '').substring(0, 500));
  
  await browser.close();
})();
