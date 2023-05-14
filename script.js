const { executablePath } = require("puppeteer");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      "--no-sandbox",
      '--user-data-dir="/tmp/chromium"',
      "--disable-web-security",
      "--disable-features=site-per-process",
      "--start-maximized",
    ],
    executablePath: executablePath(),
  });

  const loginUrl = "https://www.bigo.tv";
  const page = await browser.newPage();
  await page.goto(loginUrl, { waitUntil: "networkidle2", timeout: 0 });
})();
