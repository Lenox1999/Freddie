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

    if (user.dailyLastTriggered === 0) {
      user.dailyLastTriggered = Date.now();
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
      interaction.reply(
        "Sorry, du kannst deinen Streak nur einmal pro Tag verlängern"
      );
      return;
    } else if (Date.now() - user.dailyLastTriggered > maxDiff) {
      user.lastLoginDay = new Date().getDate();
      user.dailyLastTriggered = Date.now();
      user.streak = 0;
      user.save();
      interaction.reply("Sorry, du bist leider zu spät!");
      return;
    }
  },
};
