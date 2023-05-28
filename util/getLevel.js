const mongoose = require("mongoose");
const { EmbedBuilder, Colors } = require("discord.js")
//EmbedColor
const ecolor = require("../util/embedColors.json")

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

        let quote = [
          "\"Du bist nicht soweit gekommen, um nur so weit zu kommen.\"",
          "\"Du kennst deine Grenzen erst, wenn du über sie hinausgewachsen bist.\"",
          "\"Die Tat unterscheidet das Ziel vom Traum.\"",
          "\"Wer sich selbst alles zutraut, wird andere übertreffen.\"",
          "\"Man gibt nicht auf, wenn es schwierig wird. Man legt erst richtig los.\"",
          "\"Niemand, der sein Bestes gegeben hat, hat es später bereut.\"",
          "\"Du kannst die Zukunft verändern mit dem, was du heute tust.\"",
          "\"Höre nicht auf, wenn es weh tut. Höre auf, wenn du fertig bist.\"",
          "\"Scheitern ist nicht das Gegenteil von Erfolg. Es ist ein Teil davon.\"",
          "\"Chancen sind wie Sonnenaufgänge. Wer wartet, verpasst sie.\""]

        var levelupembed = new EmbedBuilder()
          .setColor(ecolor.UPDATE)
          .setTitle("\`LEVEL UP\`")
          .setThumbnail(msg.member.displayAvatarURL())
          .setDescription(`
          Levelaufstieg..
          Du bist jetzt Level **${user.lvl}**.
          
          *${quote[Math.floor(Math.random() * quote.length)]}*
          `)

        msg.reply({ embeds: [levelupembed] });
        return user.lvl;
      } else {
        return user.lvl;
      }
    });
};
