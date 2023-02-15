const mongoose = require("mongoose");

module.exports = () => {
  const lvlObj = {};

  for (let i = 1; i <= 1000; i++) {
    if (lvlObj[i]) {
      continue;
    }
  }

  const Levels = new mongoose.Schema({});
};
