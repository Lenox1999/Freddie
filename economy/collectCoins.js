const mongoose = require("mongoose");

const getUser = require("../util/getUser");

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
        .select("coinAmmount")
        .exec((err, user) => {
          if (err) {
            console.error(err);
            return;
          }
          // increases coin ammount by one for each written messagen
          user.coinAmmount += 1;
          // saving changes
          user.save((err, a) => {
            if (err) {
              console.log(err);
            }
          });
        });
      return;
    }
    // this only gets executed if user isn't registered yet
    const newUser = new User({
      _id: msg.member.id,
      name: msg.member.displayName,
      coinAmmount: 1,
    });

    newUser.save();
  });
};
