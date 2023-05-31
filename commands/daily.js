const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const mongoose = require("mongoose");
const ecolor = require("../util/embedColors.json")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("daily")
    .setDescription("🠞 Daily Reward: COINS COINS COINS"),
    
  async execute(interaction, client) {
    const User = mongoose.models.User;

    const minDiff = 86400000;
    const maxDiff = 86400000 * 2;

    const user = await User.findOne(
      { _id: interaction.member.id },
      "streak lastLoginDay dailyLastTriggered coinAmmount"
    );

    if (user.dailyLastTriggered === 0) {
      user.dailyLastTriggered = Date.now();
      user.coinAmmount += 10;
      user.streak += 1;
      user.save();

      var firststreamembed = new EmbedBuilder()
        .setColor(ecolor.UPDATE)
        .setAuthor({ name: `${interaction.member.displayName}`, iconURL: interaction.member.displayAvatarURL() })
        .setTitle(`\`FIRST DAILY REWARD\``)
        .setThumbnail("https://cdn.discordapp.com/attachments/661359204572987393/1112472169067319377/FirstDaily.gif")
        .setDescription(
          `*Du hast deine tägliche Belohnung abgeholt und deine erste Streak abgesahnt! 
          
          Wie lange schaffst du es diese Streak laufen zu lassen?*
          +**10** ${client.emojis.cache.find(emoji => emoji.name === "coins")}
          `
        )
        .setTimestamp();

      interaction.reply({ embeds: [firststreamembed] });
    } else if (
      Date.now() - user.dailyLastTriggered < maxDiff &&
      Date.now() - user.dailyLastTriggered > minDiff
    ) {
      // Streak möglich
      user.lastLoginDay = new Date().getDate();
      user.dailyLastTriggered = Date.now();
      user.streak += 1;
      await user.save();
      let rewardedCoins = user.streak * 10;
      user.coinAmmount += rewardedCoins;
      user.save();

      var nextdailyembed = new EmbedBuilder()
        .setColor(ecolor.ACCEPT)
        .setAuthor({ name: `${interaction.member.displayName}`, iconURL: interaction.member.displayAvatarURL() })
        .setTitle(`\`DAILY REWARD\``)
        .setThumbnail("https://cdn.discordapp.com/attachments/661359204572987393/1112472168744370227/Dailyagain.gif")
        .setDescription(
          `*Du hast deine Streak um 1 Tag verlängert und bekommst **${rewardedCoins}** ${client.emojis.cache.find(
            (emoji) => emoji.name === "coins"
          )}*`
        )
        .setTimestamp();

      interaction.reply({ embeds: [nextdailyembed] });
      return;
    } else if (Date.now() - user.dailyLastTriggered < minDiff) {
      let duration = user.dailyLastTriggered + minDiff - Date.now();
      let seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

      hours = hours < 10 ? "0" + hours : hours;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      let durationMsg = hours + "h " + minutes + "min " + seconds + "s";

      var alreadydailyembed = new EmbedBuilder()
        .setColor(ecolor.ATTENTION)
        .setAuthor({ name: `${interaction.member.displayName}`, iconURL: interaction.member.displayAvatarURL() })
        .setTitle(`\`TRY TO BECOME DAILY AGAIN\``)
        .setThumbnail("https://cdn.discordapp.com/attachments/661359204572987393/1112473161632583810/tryagain.png")
        .setDescription(
          `*Sorry, du hast bereits Daily benutzt, komme in **${durationMsg}** wieder um deine Streak zu verlängern!*`
        )
        .setTimestamp();

      interaction.reply({ embeds: [alreadydailyembed], ephemeral: true });
      return;
    } else if (Date.now() - user.dailyLastTriggered > maxDiff) {
      user.lastLoginDay = new Date().getDate();
      user.dailyLastTriggered = Date.now();
      user.streak = 0;
      user.save();

      var faildailyembed = new EmbedBuilder()
        .setColor(ecolor.DENY)
        .setAuthor({ name: `${interaction.member.displayName}`, iconURL: interaction.member.displayAvatarURL() })
        .setTitle("\`DAILY FAIL\`")
        .setThumbnail("https://cdn.discordapp.com/attachments/661359204572987393/1112473801054236842/fail.png")
        .setDescription(
          `*Sorry, du bist leider zu spät und hast somit deine Streak verkackt! Komme in **24h** wieder um deine Streak wiederaufzuholen!*`
        )
        .setTimestamp();

      interaction.reply({ embeds: [faildailyembed] });
      return;
    }
  },
};
