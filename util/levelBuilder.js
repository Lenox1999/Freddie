// JUST REQUIRED AFTER DB WIPE TO SETUP LEVELS IN DB
// COULD BE RUN EACH TIME BUT COSTS TO MUCH PERFORMANCE

const mongoose = require("mongoose");

module.exports = () => {
  // the object which is going to hold the Level Numbers as Keys and the needed XP as Element
  const lvlObj = { 1: 100 };

  // create an object with levels until 1000
  for (let i = 1; i <= 1000; i++) {
    if (lvlObj[i]) {
      continue;
    }
    // multiplies the neccessary XP of previous level by 1.2 and round it
    lvlObj[i] = Math.floor(lvlObj[i - 1] + 100);
  }

  // make level a new Schema in MongoDB

  // get Model from DB
  const lvlList = mongoose.models.levels;
  // add the LvlObj to the new Document
  const newLevels = new lvlList({
    _id: "levelList",
    levelObj: lvlObj,
  });
  // save the new Document in DB
  newLevels.save();
};
