const { SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");
const mongoose = require("mongoose");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("daily")
    .setDescription("Infos über Daily Reward"),
  async execute(interaction, client) {
    const User = mongoose.models.User;

    const minDiff = 86400000;
    const maxDiff = 86400000 * 2;

    const user = await User.findOne(
      { _id: interaction.member.id },
      "streak lastLoginDay dailyLastTriggered coinAmmount"
    );
    if (!user) {
      let errorEmbed = new EmbedBuilder()
        .setColor(Colors.Red)
        .setTitle("\`Fehler\`")
        .setThumbnail(interaction.member.displayAvatarURL())
        .setDescription(
          `
          Du bist noch nicht registriert!
          Schreibe eine Nachricht um dich zu registrieren.
          Danach kannst du deinen Command ausführen!
          `
        )
        interaction.reply({embeds: [errorEmbed]});
        return;
    }

    if (user.dailyLastTriggered === 0) {
      user.dailyLastTriggered = Date.now();
      user.streak += 1;
      user.save();

      var firststreamembed = new EmbedBuilder()
        .setColor(Colors.DarkGreen)
        .setTitle("\`DAILY REWARD\`")
        .setThumbnail(interaction.member.displayAvatarURL())
        .setDescription(
          `*Du hast deine tägliche Belohnung abgeholt und deine erste Streak abgesahnt!*`
        );

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
        .setColor(Colors.Green)
        .setTitle("\`DAILY REWARD\`")
        .setThumbnail(interaction.member.displayAvatarURL())
        .setDescription(
          `*Du hast deine Streak um 1 Tag verlängert und bekommst **${rewardedCoins}** ${client.emojis.cache.find(
            (emoji) => emoji.name === "coins"
          )}*`
        );

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
        .setColor(Colors.Yellow)
        .setTitle("\`DAILY\`")
        .setThumbnail(interaction.member.displayAvatarURL())
        .setDescription(
          `*Sorry, du hast bereits Daily benutzt, komme in **${durationMsg}** wieder um deine Streak zu verlängern!*`
        );

      interaction.reply({ embeds: [alreadydailyembed] });
      return;
    } else if (Date.now() - user.dailyLastTriggered > maxDiff) {
      user.lastLoginDay = new Date().getDate();
      user.dailyLastTriggered = Date.now();
      user.streak = 0;
      user.save();

      var faildailyembed = new EmbedBuilder()
        .setColor(Colors.Red)
        .setTitle("\`DAILY FAIL\`")
        .setThumbnail(interaction.member.displayAvatarURL())
        .setDescription(
          `*Sorry, du bist leider zu spät und hast somit deine Streak verkackt! Komme in **24h** wieder um deine Streak wiederaufzuholen!*`
        );

      interaction.reply({ embeds: [faildailyembed] });
      return;
    }
  },
};
