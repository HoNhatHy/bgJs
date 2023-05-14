const sleep = async function (ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

module.exports = { sleep };
