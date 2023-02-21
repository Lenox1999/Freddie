const { SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");
const mongoose = require("mongoose");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bal")
    .setDescription("Infos über Fische, Streak, aktive Multiplier"),

  async execute(interaction, client) {
    // !!! KANN BISHER NUR KONTOSTAND ABLESEN, ES FEHLT NOCH STREAK MULTIPLIER UND FÄHIGKEITEN !!!

    const User = mongoose.models.User;
    User.findOne({ _id: interaction.member.id })
      .select("coinAmmount fishAmmount streak multiplier")
      .exec((err, user) => {
        if (err) {
          console.log(err);
          return;
        }
        // check if user isnt registered in DB yet
        if (!user) {
          var notregisterembed = new EmbedBuilder()
            .setColor(Colors.Red)
            .setTitle("\`Keinen Account\`")
            .setThumbnail(interaction.member.displayAvatarURL())
            .setDescription(`Du besitzt noch keine Coins.. Schreibe eine Nachricht um Coins zu erhalten!`)
          interaction.reply({ embeds: [notregisterembed], ephemeral: true });
          return;
        }
        let coins = user.coinAmmount.toString();
        let fish = user.fishAmmount.toString();
        let multiplier = user.multiplier.toString();
        let streak = user.streak.toString();
        var balembed = new EmbedBuilder()
          .setColor(Colors.Aqua)
          .setTitle("\`Account\`")
          .setThumbnail(interaction.member.displayAvatarURL())
          .setDescription(`
          ・Coins **${coins}** ${client.emojis.cache.find(emoji => emoji.name === "coins")}

          ・Fische **${fish}** 🐟

          ・Multiplier **${multiplier}**x

          ・Daily-Streak **${streak}** ${client.emojis.cache.find(emoji => emoji.name === "daily")}
          `)
        interaction.reply({ embeds: [balembed], ephemeral: true });
      });
  },
};
