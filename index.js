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
        '--disable-web-security',
        '--disable-features=site-per-process',
        '--start-maximized'
      ],
      executablePath: process.platform === 'win32' ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' : '/usr/bin/google-chrome-stable'
    })
    console.log(`** Start login with ${bot.phone}`)

    const [page] = await browser.pages()
    await page.setBypassCSP(true)
    await page.setUserAgent(`BigoLive/5.41.2.2942(Android,9)/(bigoId,${bot.userId})`)

    try {
      await interactWithBigo(page, bigoUrl, bot.phone)
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
    {
      phone: '921627914', // Mỹ Huy
      userId: '903991743'
    },
    {
      phone: '364112810', // Bao Khang
      userId: '903944434'
    },
    {
      phone: '924879261', // Chi Bao
      userId: '903982690'
    },
    {
      phone: '589312506', // Minh Minh
      userId: '903982707'
    },
    {
      phone: '585499059', // Hoang Phuc
      userId: '903982723'
    },
    {
      phone: '567985413', // Hoang Anh
      userId: '903982737'
    },
    {
      phone: '589451236', // Bao Khoa
      userId: '903982754'
    },
    {
      phone: '522711367', // Stephen Chow
      userId: '902913067'
    },
    {
      phone: '869177531', // Nhat Hy
      userId: '902868157'
    },
    {
      phone: '926134534', // Ku em
      userId: '902868456'
    }
    // {
    //   phone: '386179721', // nhatquang912
    //   userId: '919566295'
    // },
    // {
    //   phone: '374512062', // ngocchung9210
    //   userId: '919566285'
    // },
    // {
    //   phone: '924900529', // thuannguyen7382
    //   userId: '919566266'
    // },
    // {
    //   phone: '342592183', // vutruong1203
    //   userId: '919602523'
    // },
    // {
    //   phone: '928421380', // duongtin6272
    //   userId: '919602461'
    // },
    // {
    //   phone: '369115446', // congvuong0182
    //   userId: '919566107'
    // },
    // {
    //   phone: '333098911', // donghiep7291
    //   userId: '919602289'
    // },
    // {
    //   phone: '383704011', // tungduong0803
    //   userId: '919565978'
    // },
    // {
    //   phone: '862581848', // viettan1930
    //   userId: '919565959'
    // },
    // {
    //   phone: '928420653', // hoangnhan0282
    //   userId: '919565932'
    // }
  ]

  runMultipleBots('https://www.bigo.tv/797312596', bots)
}

main()
