const puppeteer = require("puppeteer");
const mongoose = require("mongoose");

const { interactWithBigo } = require("./bigo/bigoInteraction");
const { Bot } = require("./models/Bot");

const updateBotStatus = async (bot, state, bigoUrl) => {
  bot.status = state;
  bot.watchingIdolId = bigoUrl;
  await bot.save();
};

const runSingleBot = async function (bigoUrl, bot) {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      args: ["--start-maximized", "--no-sandbox"],
      executablePath: "/usr/bin/google-chrome-stable",
    });
    console.log(`** Start login with ${bot}`);

    const [page] = await browser.pages();
    await page.setBypassCSP(true);

    try {
      await interactWithBigo(page, bigoUrl, bot);
    } catch (ex) {
      console.log(ex);
      await page.close();
    }
  } catch (ex) {
    console.log(ex);
  }
};

const runMultipleBots = async function (bigoUrl, bots) {
  try {
    console.log(bigoUrl);
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
  // await mongoose.connect(
  //   "mongodb+srv://<user>:<password>@bgdb.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000",
  //   {
  //     authMechanism: "SCRAM-SHA-256",
  //     dbName: "bgdb",
  //     auth: {
  //       username: "bgadmin",
  //       password: "1204$Honhathy",
  //     },
  //   }
  // );

  // console.log("Connected to mongodb");

  // const bots = await Bot.find({
  //   status: "FREE",
  // }).limit(1);

  // bots.forEach((x) => updateBotStatus(x, "BUSY", process.env.bigoUrl));
  const bots = [
    "921627914", // Mỹ Huy
    "364112810", // Bao Khang
    "924879261", // Chi Bao
    "589312506", // Minh Minh
    "585499059", // Hoang Phuc
    "567985413", // Hoang Anh
    "589451236", // Bao Khoa
    "921627914", // Mỹ Huy
    "364112810", // Bao Khang
    "924879261", // Chi Bao
    "589312506", // Minh Minh
    "585499059", // Hoang Phuc
    "567985413", // Hoang Anh
    "589451236", // Bao Khoa
  ];

  runMultipleBots(`https://www.bigo.tv/918970883`, bots);
};

main();
