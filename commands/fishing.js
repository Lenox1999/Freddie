const { SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");
const mongoose = require("mongoose");

const userNotRegistered = require('../util/userNotRegistered');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("fishing")
    .setDescription("🠞 Daily Reward: Every 4h you can go fishing. BLUB.. BLUB"),
  async execute(interaction, client) {
    const User = mongoose.models.User;
    const user = await User.findOne({ _id: interaction.member.id });

    if (!user) {
      userNotRegistered(interaction, client);
    }

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

      var falsefishingembed = new EmbedBuilder()
        .setColor(Colors.Red)
        .setTitle("\`No fishing time.\`")
        .setThumbnail(interaction.member.displayAvatarURL())
        .setDescription(`*Du warst vor weniger als 4 Stunden das letzte Mal fischen, du kannst erst wieder in ${durationMsg} wieder fischen!*`)
      interaction.reply({ embeds: [falsefishingembed], ephemeral: true  });
    } else if (sinceLastTriggered > 4 || lastFisching === 0) {
      let defaultitem = ["einen Stock", "eine Zeitung", "einen gammligen Schuh", "ein Fahrrad", "eine Dose"];
      let rareitem = ["ein Dorsch", "einen Hering", "einen Lachs"];
      let epicitem = ["einen Megalodon", "einen Oktopus"]
      
      let randomNumber = Math.floor(Math.random() * 100);
 
      if(randomNumber <= 50) {
        let randomitemd = Math.floor(Math.random() * defaultitem.length);
        var defaultfishingend = new EmbedBuilder()
          .setColor(Colors.Gold)
          .setTitle("\`Fishing..\`")
          .setThumbnail(interaction.member.displayAvatarURL())
          .setDescription(`*Leider hast du diese mal kein Glück und angelst nur **${defaultitem[randomitemd]}**. \nKomme in 4h wieder um erneut zu angeln!*`)
        interaction.reply({ embeds: [defaultfishingend] })
      } else if(randomNumber <= 99) {
        let randomitemr = Math.floor(Math.random() * rareitem.length);
        var rarefishingend = new EmbedBuilder()
          .setColor(Colors.Gold)
          .setTitle("\`Fishing..\`")
          .setThumbnail(interaction.member.displayAvatarURL())
          .setDescription(`*Du fängst **${rareitem[randomitemr]}** und bekommst somit **10** 🐟. \nKomme in 4h wieder um erneut zu angeln!*`)
        interaction.reply({ embeds: [rarefishingend] })
        user.fishAmmount += 10;
      } else if(randomNumber == 100) {
        let randomiteme = Math.floor(Math.random() * epicitem.length);
        var epicfishingend = new EmbedBuilder()
          .setColor(Colors.Gold)
          .setTitle("\`Fishing..\`")
          .setThumbnail(interaction.member.displayAvatarURL())
          .setDescription(`*GLÜCKWUNSCH! Dein Fang war sehr erfolgreich, du fängst **${epicitem[randomiteme]}** und bekommst somit **100** 🐟. \nKomme in 4h wieder um erneut zu angeln!*`)
        interaction.reply({ embeds: [epicfishingend] })
        user.fishAmmount += 100;
      }
      user.lastFishing = Date.now();
      user.save();
    }
  },
};
