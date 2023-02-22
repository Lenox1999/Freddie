const mongoose = require("mongoose");

const streakCalc = require("../util/streakCalc");
const getLevel = require("../util/getLevel");

module.exports = async (msg, client) => {
  // define User ID as a const

  // check if the bot reacts to itself or another bot
  if (msg.author.bot) {
    return;
  }
  if (msg.author.id === client.user.id) {
    return;
  }

  const userId = msg.member.id;

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
    // if user isnt registered yet we have to registerer them
    if (count === 0) {
      const newUser = new User({
        _id: msg.member.id,
        name: msg.member.displayName,
        coinAmmount: 0,
        fishAmmount: 1,
        streak: 0,
        lastLogin: Date.now(),
        dailyLastTriggered: 0,
        gears: [],
        lastMessage: Date.now(),
        joinedVC: 0,
        leftVC: 0,
        items: [],
        multiplier: 1,
        XP: 3,
        lvl: 0,
        lastFishing: 0,
      }, {strict: false});
      newUser.save();

      return;
    }

    // finds user in db
    User.findOne({ _id: userId })
      // selects fishAmmount field in User Document
      .select("XP fishAmmount lastLogin")
      .exec(async (err, user) => {
        if (err) {
          console.error(err);
          return;
        }

        let timeSinceLastMsg = Math.round((Date.now() - user.lastLogin) /1000);

        if (timeSinceLastMsg < 30) return;

        // increases coin ammount by one for each written messagen
        user.fishAmmount += 1;
        user.lastLogin = Date.now();

        // increase user xp by 3 with each msg
        user.XP += 3;
        user.save((err, a) => {
          if (err) {
            console.log(err);
          }
        });
        const level = await getLevel(userId, msg);
      });
    return;
    // this only gets executed if user isn't registered yet
  });
};
