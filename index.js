// const puppeteer = require('puppeteer')
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
// const mongoose = require('mongoose')

const { interactWithBigo } = require('./bigo/bigoInteraction')
// const { Bot } = require('./models/Bot')

// const updateBotStatus = async (bot, state, bigoUrl) => {
//   bot.status = state
//   bot.watchingIdolId = bigoUrl
//   await bot.save()
// }

const runSingleBot = async function (bigoUrl, bot) {
  puppeteer.use(StealthPlugin())

  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      defaultViewport: null,
      args: [
        '--no-sandbox',
        '--user-data-dir=/tmp/chromium',
        '--disable-web-security',
        '--disable-features=site-per-process',
        '--start-maximized'
      ],
      executablePath: '/usr/bin/google-chrome-stable'
    })
    console.log(`** Start login with ${bot}`)

    const [page] = await browser.pages()
    await page.setBypassCSP(true)

    try {
      await interactWithBigo(page, bigoUrl, bot)
    } catch (ex) {
      console.log(ex)
      await page.close()
    }
  } catch (ex) {
    console.log(ex)
  }
}

const runMultipleBots = async function (bigoUrl, bots) {
  try {
    console.log(bigoUrl)
    for (let i = 0; i < bots.length; i++) {
      if (i % 2 === 0) {
        runSingleBot(bigoUrl, bots[i], i)
      } else {
        await runSingleBot(bigoUrl, bots[i], i)
      }
    }
  } catch (ex) {
    console.log(ex)
  }
}

const main = async () => {
  // await mongoose.connect(
  //   'mongodb+srv://<user>:<password>@bgdb.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000',
  //   {
  //     authMechanism: 'SCRAM-SHA-256',
  //     dbName: 'bgdb',
  //     auth: {
  //       username: 'bgadmin',
  //       password: '1204$Honhathy',
  //     },
  //   }
  // )

  // console.log('Connected to mongodb')

  // const bots = await Bot.find({
  //   status: 'FREE',
  // }).limit(1)

  // bots.forEach((x) => updateBotStatus(x, 'BUSY', process.env.bigoUrl))
  const bots = [
    '921627914', // Mỹ Huy
    '364112810', // Bao Khang
    '924879261', // Chi Bao
    '589312506', // Minh Minh
    '585499059', // Hoang Phuc
    '567985413', // Hoang Anh
    '589451236', // Bao Khoa
    '522711367', // Stephen Chow
    '869177531', // Nhat Hy
    '926134534' // Ku em
  ]

  runMultipleBots('https://www.bigo.tv/131474106', bots)
}

main()
