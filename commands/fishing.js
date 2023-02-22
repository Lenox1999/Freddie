const { SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");
const mongoose = require("mongoose");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("fishing")
    .setDescription("Angle jede 4h um Fische zu bekommen"),
  async execute(interaction, client) {
    const User = mongoose.models.User;
    const user = await User.findOne({ _id: interaction.member.id });

    const fishingCooldown = 4 * 60 * 60 * 1000;

    let lastFisching;

    const sinceLastTriggered = (Date.now() - user.lastFishing) / 1000 / 60;

    if (sinceLastTriggered < 4) {
      let duration = user.lastFishing + fishingCooldown - Date.now();
      let seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

      hours = hours < 10 ? "0" + hours : hours;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      let durationMsg = hours + "h " + minutes + "min " + seconds + "s";

      interaction.reply(
        `Du warst vor weniger als 4 Stunden das letzte Mal fischen, du kannst erst wieder in ${durationMsg} wieder fischen`
      );
    } else if (sinceLastTriggered > 4 || lastFisching === 0) {
      let odds = Math.random();

      if (odds < 0.125) {
        user.fishAmmount += 8;
        interaction.reply(
          "Du hast eine normalle Forelle gefangen. Diese ist 8 Fische wert!"
        );
      } else if (odds > 0.125 && odds < 0.33) {
        // scheiße kommt raus
        interaction.reply("Du hast einen Stock geangelt. Schade!");
      } else if (odds > 0.5 && odds < 0.6) {
        user.fishAmmount += 30;
        interaction.reply(
          "Du hast einen durchschnittlichen Thunfisch geangelt! Diser bringt dir 30 Fische ein!"
        );
      } else if (odds > 0.6 && odds < 0.605) {
        // wertvollster fisch
        user.fishAmmount += 500;
        interaction.reply(
          "Du findest einen extrem seltenen Blauflossen-Thunfisch bekommen! Dieser bringt dir 500 Coins ein!"
        );
      } else if (odds > 0.75) {
        // casual fisch
        user.fishAmmount += 10;
        interaction.reply(
          "Du hast einen Hering geangelt! Dieser bringt dir 10 Fische ein!"
        );
      } else if (odds > 0.605 && odds < 0.75) {
        // nischt
        interaction.reply("Du hast einen Plastikbecher geangelt. Schade!");
      } else if (odds > 0.33 && odds < 0.45) {
        interaction.reply(
          "Du hattest einen richtig guten am Haken, aber er ist dir entwischt"
        );
        // nischt besonderes
      } else if (odds > 0.45 && odds < 0.5) {
        // man findet ein verrostetes Fahrrad
        interaction.reply(
          "Du hast ein Portemonaie geangelt. Du gibst es dem Besitzer zurück und er gibt dir 3 Fische Finderlohn!"
        );
        user.fishAmmount += 3;
      }

      user.lastFishing = Date.now();
      user.save();
    }
  },
};
