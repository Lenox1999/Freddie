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
        // selects coinAmmount field in User Document
        .select("coinAmmount XP")
        .exec(async (err, user) => {
          if (err) {
            console.error(err);
            return;
          }
          // increases coin ammount by one for each written messagen
          user.coinAmmount += 1;

          // STREAK
          // let isStreak = streakCalc(user.lastLoginDay, new Date().getDate());
          // if (isStreak === 0) {
          //   // nur Streak erweitern wen Tagesunterschied 1 ist und Nachricht länger als 1 Zeichen ist
          //   msg.content.length > 1 ? (user.streak += 1) : 0;
          // } else if (isStreak === 1) {
          //   user.streak = 0;
          // }
          // STREAK

          // every coin is worth 3 XP
          user.XP += 3;

          // setzt last login auf jetzigen Zeitpunkt
          // user.lastLogin = Date.now();
          // saving changes
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
      coinAmmount: 1,
      streak: 0,
      lastLogin: Date.now(),
      lastLoginDay: new Date().getDate(), // get day of month
      abilities: [],
      items: [],
      multiplier: 0,
      XP: 3,
      lvl: 0,
      dailyLastTriggered: 0,
    });

    newUser.save();
  });
};
