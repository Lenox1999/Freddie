// import { EmbedBuilder } from "@discordjs/builders";
const mongoose = require("mongoose");

// const User = require("../start.js");

module.exports = async (msg, client) => {
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

  // if (User.findById(msg.member.id)) {
  //   const query = User.findOne({ _id: msg.member.id });
  //   query.select("name coinAmmount");
  //   query.exec((err, user) => {
  //     if (err) {
  //       console.log(err);
  //       return;
  //     }
  //     msg.reply(user.coinAmmount);
  //   });

  //   return;
  // } else {
    User.countDocuments({ _id: userId }, (err, count) => {
      if (err) {
        console.log(err);
        return;
      }
      if (count > 0) {
        const query = User.findOne({ _id: userId });
        query.select("name coinAmmount");
        query.exec((err, user) => {
          if (err) {
            console.error(err);
            return;
          }
          msg.reply(user.coinAmmount.toString());
          return;
        });
      } else {
        const newUser = new User({
          _id: msg.member.id,
          name: msg.member.displayName,
          coinAmmount: 1,
        });

        newUser.save();

        const user = User.findOne({ _id: msg.member.id });

        user.select("name coinAmmount");

        user.exec((err, user) => {
          if (err) {
            console.log(err);
            return;
          }

          console.log(user);
          // msg.reply(user.coinAmmount);
        });
        // }
      }
    });
  // }
};
