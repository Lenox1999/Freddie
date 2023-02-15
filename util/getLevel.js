const mongoose = require("mongoose");
const { EmbedBuilder, Colors } = require("discord.js")

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

        const lvlDiff = lvlObj.levels[user.lvl] - lvlObj.levels[user.lvl + 1];

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
