const { SlashCommandBuilder, EmbedBuilder, Colors, AttachmentBuilder } = require("discord.js");
const mongoose = require("mongoose");
const ecolor = require("../util/embedColors.json")
const canvacord = require("canvacord")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rank")
    .setDescription("🠞 Levelsystem: Level + XP"),

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

        console.log(nextLvLDiff, LvLDiff)

        const rank = new canvacord.Rank()
          .setAvatar(interaction.member.displayAvatarURL({ size: 256 }))
          .setLevel(user.lvl)
          .setCurrentXP(nextLvLDiff)
          .setRequiredXP(LvLDiff)
          .setStatus(interaction.member.presence.clientStatus.desktop)
          .setProgressBar("#FFC300","COLOR")
          .setUsername(interaction.member.displayName)
          .setDiscriminator(interaction.member.user.discriminator)
        const data = rank.build();
        const attachment = new AttachmentBuilder(data);
        interaction.reply({files: [attachment]})
        console.log(attachment);

        var levelembed = new EmbedBuilder()
          .setColor(Colors.Blue)
          .setTitle(`\`Rank ${user.lvl}\``)
          .setDescription(`
          **${nextLvLDiff}** | **${LvLDiff}** XP
          `)
          .setAuthor({ name: `${interaction.member.displayName}`, iconURL: interaction.member.displayAvatarURL() })
        //interaction.followUp({ embeds: [levelembed] });
      });
  },
};
