const mongoose = require("mongoose");

module.exports = () => {
  const lvlObj = { 1: 200 };

  for (let i = 1; i <= 1000; i++) {
    if (lvlObj[i]) {
      console.log("LvL 1 geskippt");
      continue;
    }
    // multiplies the neccessary XP of previous level by 1.2 and round it
    lvlObj[i] = Math.floor(lvlObj[i - 1] * 1.2);
  }

  // make level a new
  const Level = new mongoose.Schema({
    levels: Object,
  });
  console.log("moin");
  mongoose.model("levels", Level);

  const lvlList = mongoose.models.levels;
  const addLevels = new lvlList({
    levels: lvlObj,
  });
  addLevels.save();
};
