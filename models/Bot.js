const mongoose = require("mongoose");

const BotSchema = new mongoose.Schema({
  phoneNum: String,
  password: String,
  status: {
    type: String,
    enum: ["FREE", "BUSY"],
    default: "FREE",
  },
  watchingIdolId: {
    type: String,
    default: "longbuibao-bigo-idol",
  },
  watchingOnVmId: {
    type: String,
    default: "someVm-id",
  },
});

const Bot = mongoose.model("Bot", BotSchema);

const botFactory = ({
  phoneNum,
  password,
  status,
  watchingIdolId,
  watchingOnVmId,
}) => {
  return new Bot({
    phoneNum,
    password,
    status,
    watchingIdolId,
    watchingOnVmId,
  });
};

module.exports = { botFactory, Bot };
