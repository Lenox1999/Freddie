// mit jedem Mal, dass jemand /rob benutzt ohne geschnappt zu werden, steigt die Wahrscheinlichkeit geschnappt zu werden
// ausgangswahrscheinlichkeit ist 1/2

const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const mongoose = require("mongoose");
const ecolor = require("../util/embedColors.json");
const { execute } = require("./inv");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rob")
    .setDescription("🠞 Rob: Steal something")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Wähle dein Opfer")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const victim = interaction.options.getUser("user");

    const robCoolDown = 24 * 60 * 60 * 1000;
    const defaultProtection = 12 * 60 * 60 * 1000;

    const User = mongoose.models.User;

    // await User.updateMany(
    //   {},
    //   { $set: { rob: { lastRobbed: 0, protection: 0, robCount: 0 } } }
    // );

    // Nuterkonten des Räubers und des potentiellen Opfers werden aus der Datenbank geladen

    const user1 = await User.findOne(
      { _id: interaction.member.id },
      "coinAmmount rob"
    );

    const user2 = await User.findOne({ _id: victim.id }, "coinAmmount rob");

    // überprüfen ob Krimineller wieder Rauben darf und ob Opfer noch laufenden Schutz besitzt

    if (Date.now() - user1.rob.lastRobbed < robCoolDown) {
      let duration = user1.rob.lastRobbed + robCoolDown - Date.now();
      let seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

      hours = hours < 10 ? "0" + hours : hours;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      let durationMsg = hours + "h " + minutes + "min " + seconds + "s";
      interaction.reply(
        `Du darfst erst in ${durationMsg} wider widerwärtige Straftaten begehen!`
      );
      return;
    } else if (Date.now() - user2.rob.protection < defaultProtection) {
      let duration = user2.rob.protection + defaultProtection - Date.now();
      let seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

      hours = hours < 10 ? "0" + hours : hours;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      let durationMsg = hours + "h " + minutes + "min " + seconds + "s";
      interaction.reply(`${victim} darf erst in ${durationMsg} wieder ausgeraubt werden, noch wird er von der Polizei beschützt`);
    }

    // Wahrscheinlichkeit wird kreiert
    let odds = Math.random() * 100;

    if (odds < 40) {
      // Raub nicht erfolgreich
      let criminalLoss = user1.coinAmmount * 0.3;

      await User.updateOne(
        { _id: interaction.member.id },
        { coinAmmount: (user1.coinAmmount -= criminalLoss) }
      );
      interaction.reply(
        `Du wurdest geschnappt! Die Polizei nimmt dich fest! Um dich Freizukaufen wendest du ${criminalLoss} auf!`
      );
      return;
    } else if (odds >= 40) {
      // Raub erfolgreich
      let victimLoss = user2.coinAmmount * 0.2;

      // Opfer wird Geld abgezogen und Schutz zugerechnet
      await User.updateOne(
        { _id: victim.id },
        {
          $set: {
            coinAmmount: (user2.coinAmmount -= victimLoss),
            "rob.protection": Date.now(),
          },
        }
      );

      // Räuber wird gestohlenes Geld zugerechnet und Cooldown verpasst
      await User.updateOne(
        { _id: interaction.member.id },
        {
          $set: {
            coinAmmount: (user1.coinAmmount += victimLoss),
            "rob.lastRobbed": Date.now(),
          },
        }
      );

      interaction.reply(
        `Du wurdest nicht geschnappt! Du erbeutest ${victimLoss} von ${victim}!`
      );
      return;
    }

    return;
  },
};
