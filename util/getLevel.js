const mongoose = require("mongoose");
const { EmbedBuilder, Colors } = require("discord.js")

module.exports = async (userId, msg) => {
  const Users = mongoose.models.User;
  const Levels = mongoose.models["levels"];

  const levelList= await Levels.findOne({ _id: "levelList" }, "levelObj");

  Users.findOne({ _id: userId })
    .select("lvl XP")
    .exec((err, user) => {
      if (err) {
        console.log(err);
        return;
      }
      if (user.XP >= levelList.levelObj[user.lvl + 1]) {
        let newLvl = Object.keys(levelList.levelObj).reduce((prev, curr) => {
          return Math.abs(levelList.levelObj[curr] - user.XP) <
            Math.abs(levelList.levelObj[prev] - user.XP)
            ? curr
            : prev;
        });

        if (levelList.levelObj[newLvl] > user.XP) {
          newLvl -= 1;
        }

        const lvlDiff = levelList.levelObj[user.lvl] - levelList.levelObj[user.lvl + 1];

        user.lvl = newLvl;
        user.save();

        var levelupembed = new EmbedBuilder()
          .setColor(Colors.Green)
          .setTitle("\`LEVEL UP\`")
          .setThumbnail(msg.member.displayAvatarURL())
          .setDescription(`
          Du bist nun Level **${user.lvl}**. Mach weiter so!
          `)

        msg.reply({ embeds: [levelupembed] });
        return user.lvl;
      } else {
        return user.lvl;
      }
    });
};
