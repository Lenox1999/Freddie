const { SlashCommandBuilder } = require("discord.js");
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
      "streak lastLoginDay dailyLastTriggered"
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
      interaction.reply(
        "Deine Daily-Streak wurde aktualisiert! Komme morgen wieder!"
      );
    } else if (
      Date.now() - user.dailyLastTriggered < maxDiff &&
      Date.now() - user.dailyLastTriggered > minDiff
    ) {
      // Streak möglich
      user.lastLoginDay = new Date().getDate();
      user.dailyLastTriggered = Date.now();
      user.streak += 1;
      user.save();
      interaction.reply(
        "GLÜCKWUNSCH DU HAST DEINEN DAILY STREAK UM 1 VERLÄNGERT"
      );
      return;
    } else if (Date.now() - user.dailyLastTriggered < minDiff) {
      let duration = user.dailyLastTriggered + minDiff - Date.now();
      var milliseconds = Math.floor((duration % 1000) / 100),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

      hours = hours < 10 ? "0" + hours : hours;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      let durationMsg = hours + "h " + minutes + "min " + seconds + "s";
      interaction.reply(
        `Sorry, du kannst deinen Streak nur einmal pro Tag verlängern. Du kannst sie frühestens in ${durationMsg} wieder verlängern`
      );
      return;
    } else if (Date.now() - user.dailyLastTriggered > maxDiff) {
      user.lastLoginDay = new Date().getDate();
      user.dailyLastTriggered = Date.now();
      user.streak = 0;
      user.save();
      interaction.reply(
        "Sorry, du bist leider zu spät! Komme morgen wieder um sie wieder aufzunehmen"
      );
      return;
    }
  },
};
