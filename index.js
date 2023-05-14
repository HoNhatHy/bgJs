const puppeteer = require("puppeteer");
const mongoose = require("mongoose");

const { interactWithBigo } = require("./bigo/bigoInteraction");
const { Bot } = require('./models/Bot')

const updateBotStatus = async (bot, state, bigoUrl) => {
  bot.status = state
  bot.watchingIdolId = bigoUrl
  await bot.save()
}

const runSingleBot = async function (bigoUrl, bot) {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      defaultViewport: null,
      args: ["--start-maximized", "--no-sandbox"],
      executablePath: "C:\\Program Files\\Google\\Chrome\\Application\chrome.exe",
    });
    console.log(`** Start login with ${bot.phoneNum}`);

    const [page] = await browser.pages();
    await page.setBypassCSP(true);

    try {
      await interactWithBigo(page, bigoUrl, bot.phoneNum);
      updateBotStatus(bot, "BUSY", bigoUrl)

    } catch (ex) {
      updateBotStatus(bot, "FREE", "")

      console.log(ex);
      await page.close();
    }
  } catch (ex) {
    console.log(ex);
  }
};

const runMultipleBots = async function (bigoUrl, bots) {
  try {
    for (let i = 0; i < bots.length; i++) {
      if (i % 2 == 0) {
        runSingleBot(bigoUrl, bots[i], i);
      } else {
        await runSingleBot(bigoUrl, bots[i], i);
      }
    }
  } catch (ex) {
    console.log(ex);
  }
};

const main = async () => {
    await mongoose.connect('mongodb://localhost:27017', {
    authMechanism: 'DEFAULT',
    dbName: 'bigo-db',
    auth: {
      username: 'admin',
      password: 'admin'
    }
  })

  console.log('Connected to mongodb')

  const bots = await Bot.find({
    status: 'FREE'
  }).limit(10)

  runMultipleBots(
    `https://www.bigo.tv/en/${process.env.bigoUrl
      .slice(0, -8)
      .substring(2, process.env.bigoUrl.length)}`,
    bots
  );
}

main()
