const { SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");
const mongoose = require("mongoose");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("level")
    .setDescription("Erhalte Auskunft über dein derzeitiges Level"),
  async execute(interaction, client) {
    const User = mongoose.models.User;
    const Levels = mongoose.models.levels;

    if (!Levels || !User) {
      console.log("shit");
      return;
    }
    const lvlObj = await Levels.findOne({ _id: "Levels" }, "levels");

    if (!User) {
      console.log("DB ERROR!");
      return;
    }
    User.findOne({ _id: interaction.member.id })
      .select("XP lvl")
      .exec((err, user) => {
        if (err) {
          console.log(err);
          return;
        }

        let nextLvlDiff = lvlObj.levels[user.lvl + 1] - user.XP;
        console.log(nextLvlDiff);

        interaction.reply(
          `Du bist derzeit Level ${
            user.lvl
          }! Dir Fehlen noch ${nextLvlDiff} XP bis zu Level ${user.lvl + 1}`
        );
      });
  },
};
