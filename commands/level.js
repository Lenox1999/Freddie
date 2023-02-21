const { SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");
const mongoose = require("mongoose");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("level")
    .setDescription("Infos über Level"),
  async execute(interaction, client) {
    const User = mongoose.models.User;
    console.log(mongoose.modelNames());
    const Levels = mongoose.models.levels;

    if (!Levels || !User) {
      console.log("Error");
      return;
    }
    const levelList = await Levels.findOne({ _id: "levelList" }, "levelObj");

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

        let LvLDiff = 0;

        if(levelList.levelObj[user.lvl] === undefined) {
          LvLDiff = levelList.levelObj[user.lvl + 1] - 0
        } else {
          LvLDiff = levelList.levelObj[user.lvl + 1] - levelList.levelObj[user.lvl]
        }

        let nextLvLDiff = LvLDiff - (levelList.levelObj[user.lvl + 1] - user.XP)

        var levelembed = new EmbedBuilder()
          .setColor(Colors.Aqua)
          .setTitle(`\`Level ${user.lvl}\``)
          .setThumbnail(interaction.member.displayAvatarURL())
          .setDescription(`
          **${nextLvLDiff}** | **${LvLDiff}** XP
          `)
        interaction.reply({ embeds: [levelembed], ephemeral: true });
      });
  },
};
