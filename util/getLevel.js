const mongoose = require("mongoose");

module.exports = async (userId, msg) => {
  const Users = mongoose.models.User;
  const Levels = mongoose.models["levels"];

  const lvlObj = await Levels.findOne({ _id: "Levels" }, "levels");

  Users.findOne({ _id: userId })
    .select("lvl XP")
    .exec((err, user) => {
      if (err) {
        console.log(err);
        return;
      }
      if (user.XP >= lvlObj.levels[user.lvl + 1]) {
        let newLvl = Object.keys(lvlObj.levels).reduce((prev, curr) => {
          return Math.abs(lvlObj.levels[curr] - user.XP) <
            Math.abs(lvlObj.levels[prev] - user.XP)
            ? curr
            : prev;
        });

        if (lvlObj.levels[newLvl] > user.XP) {
          newLvl -= 1;
        }
        console.log(newLvl);
        user.lvl = newLvl;
        console.log("Level ist auf gestiegen: ", user.lvl);
        user.save();
        msg.reply(`Dein Level ist auf ${user.lvl} gestiegen!`);
        return user.lvl;
      } else {
        return user.lvl;
      }
    });
};
