const mongoose = require("mongoose");

const streakCalc = require("../util/streakCalc");
const getLevel = require("../util/getLevel");

module.exports = async (msg, client) => {
  // define User ID as a const
  const userId = msg.member.id;

  // check if the bot reacts to itself or another bot
  if (msg.member.id === client.user.id) {
    return;
  }
  if (msg.member.bot) {
    return;
  }
  // get access to users document in DB
  const User = mongoose.models.User;
  // check for eventual loading errors
  if (!User) {
    console.error("DB ERROR");
    return;
  }
  // looks if user is already in DB

  User.countDocuments({ _id: userId }, async (err, count) => {
    if (err) {
      console.log(err);
      return;
    }
    // only gets executed if User is already registered
    if (count > 0) {
      // finds user in db
      User.findOne({ _id: userId })
        // selects burgerAmmount field in User Document
        .select("XP burgerAmmount")
        .exec(async (err, user) => {
          if (err) {
            console.error(err);
            return;
          }

          // increases coin ammount by one for each written messagen
          user.burgerAmmount += 1;

          user.XP += 3;
          user.save((err, a) => {
            if (err) {
              console.log(err);
            }
          });
          const level = await getLevel(userId, msg);
        });
      return;
    }
    // this only gets executed if user isn't registered yet
    const newUser = new User({
      _id: msg.member.id,
      name: msg.member.displayName,
      coinAmmount: 0,
      burgerAmmount: 1,
      streak: 0,
      lastLogin: Date.now(),
      lastLoginDay: new Date().getDate(), // get day of month
      abilities: [],
      items: [],
      multiplier: 1,
      XP: 3,
      lvl: 0,
      dailyLastTriggered: 0,
    });

    newUser.save();
  });
};
