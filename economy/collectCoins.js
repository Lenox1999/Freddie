const mongoose = require("mongoose");

const getUser = require("../util/getUser");

module.exports = async (msg, client) => {
  let ammount;
  const userId = msg.member.id;

  if (msg.member.id === client.user.id) {
    return;
  }
  if (msg.member.bot) {
    return;
  }

  const User = mongoose.models.User;
  if (!User) {
    console.log("Holy fuck");
    return;
  }

  User.countDocuments({ _id: userId }, async (err, count) => {
    if (err) {
      console.log(err);
      return;
    }
    if (count > 0) {
      User.findOne({ _id: userId })
        .select("coinAmmount")
        .exec((err, user) => {
          if (err) {
            console.error(err);
            return;
          }
          ammount = user.coinAmmount + 1;
          if (!user.coinAmmount) {
            ammount = 1;
          }
          user.coinAmmount += 1;
          user.save((err, a) => {
            if (err) {
              console.log(err);
            }
          });
        });
      return;
    } else {
      const newUser = new User({
        _id: msg.member.id,
        name: msg.member.displayName,
        coinAmmount: 1,
      });

      newUser.save();
    }
  });
};
