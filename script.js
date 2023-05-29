const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')

puppeteer.use(StealthPlugin());

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-web-security',
      '--disable-features=site-per-process',
      '--start-maximized'
    ],
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  })

  const loginUrl = 'https://shopee.vn/'
  const page = await browser.newPage()
  await page.goto(loginUrl, { waitUntil: 'networkidle2', timeout: 0 })
})()
