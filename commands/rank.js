const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const mongoose = require("mongoose");
const canvacord = require("canvacord")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rank")
    .setDescription("🠞 Levelsystem: Get your Level, XP and Rank"),

  async execute(interaction, client) {
    const User = mongoose.models.User;
    //console.log(mongoose.modelNames());
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

    let data = await User.find({})
    let members = [];

    for(let obj of data) {
      members.push({id: obj._id ,xp: obj.XP})
    };

    let sorted = members.sort((b, a) => (a.xp) - (b.xp))

    let currentRank = sorted.findIndex((lvl) => lvl.id === interaction.member.id) + 1;

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


        const background = 'https://cdn.discordapp.com/attachments/661359204572987393/1113004823319674942/bg.png'
        const rank = new canvacord.Rank()
          .setAvatar(interaction.member.displayAvatarURL({ size: 256 }))
          .setRank(currentRank)
          .setLevel(user.lvl)
          .setCurrentXP(nextLvLDiff)
          .setRequiredXP(LvLDiff)
          .setStatus(interaction.member.presence.clientStatus.desktop)
          .setProgressBar("#FFFFFF","COLOR")
          .setUsername(interaction.member.displayName)
          .setBackground("IMAGE", background)
          .setDiscriminator(interaction.member.user.discriminator)

        rank.build()
          .then(data => {
            const attachment = new AttachmentBuilder(data, "RankC.png")
            interaction.reply({ files: [attachment] })
          })
      })
  },
};
