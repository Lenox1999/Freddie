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
      const newUser = new User(
        {
          _id: msg.member.id,
          name: msg.member.displayName,
          coinAmmount: 0,
          bananaAmmount: 1,
          streak: 0,
          lastLogin: Date.now(),
          dailyLastTriggered: 0,
          gears: {
              plantation: { level: 1, onebanana: 95, twobanana: 4, threebanana: 1  }, //max Level 9, onebanana: 50(+5), twobanana: 40(+4), threebanana: 10(+1)
              fertilizer: { level: 1, cooldownmsg: 30, cooldownvc: 60 }, //max Level: 10, cooldownmsg: 20, cooldownvc: 50
              moremonkeys: { level: 1, max: 1, min: 5 }, //max Level: 10, cooldownmsg: 10(+1), cooldownvc: 25(+2)
          },
          lastMessage: Date.now(),
          joinedVC: 0,
          leftVC: 0,
          items: [],
          multiplier: 1,
          XP: 3,
          lvl: 0,
          lastFishing: 0,
        },
        { strict: false }
      );
      newUser.save();

      return;
    }

    // finds user in db
    User.findOne({ _id: userId })
      // selects fishAmmount field in User Document
      .select("XP fishAmmount lastLogin gears")
      .exec(async (err, user) => {
        if (err) {
          console.error(err);
          return;
        }

        let bananas = user.gears.plantation;
        let cooldowns = user.gears.fertilizer;
        let getbanana = 0;

        let amount = Math.floor(Math.random() * 100);
        if(amount <= bananas.onebanana) { 
          getbanana = 1;
         } else if(amount <= bananas.twobanana + bananas.onebanana) {
          getbanana = 2;
         } else if(amount <= bananas.threebanana + bananas.twobanana + bananas.onebanana) {
          getbanana = 3
         }

        let timeSinceLastMsg = Math.abs(
          Math.round((Date.now() - user.lastLogin) / 1000)
        );


        if (timeSinceLastMsg < cooldowns.cooldownmsg) {
          console.log(timeSinceLastMsg, cooldowns.cooldownmsg);
          return;
        }

        // increases coin ammount by one for each written messagen
        user.fishAmmount += getbanana;
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
