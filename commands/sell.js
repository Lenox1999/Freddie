const { SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");
const mongoose = require("mongoose");
const userNotRegistered = require('../util/userNotRegistered');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("sell")
    .setDescription("🠞 Fishtrading: Become Coins for fish"),
  async execute(interaction, client) {
    const userId = interaction.member.id;

    const User = mongoose.models.User;
    const Exchange = mongoose.models.Exchanges;

    const user = await User.findOne(
      { _id: userId },
      "fishAmmount coinAmmount name"
    );

    if (!user) {
      userNotRegistered(interaction, client);
    }

    const exchange = await Exchange.findOne({ _id: "Exchange" }, "value");
    console.log(exchange);

    if (interaction.member.id === client.user.id) {
      return;
    }
    if (interaction.member.bot) {
      return;
    }

    if (user.fishAmmount === 0) {
      let sellErrorEmbed = new EmbedBuilder()
        .setColor(Colors.Red)
        .setAuthor({
          name: interaction.member.displayName,
          iconURL: interaction.member.displayAvatarURL(),
        })
        .setTitle("\`ERROR: No fish..\`")
        .setDescription(
          `
        *Wenn du Fische bekommen willst, dann schreibe etwas oder gehe mit jemanden reden ;)*
        `
        );
      interaction.reply({ embeds: [sellErrorEmbed] });
      return;
    }
    const gainedCoins = Math.round(exchange.value * user.fishAmmount);
    user.coinAmmount = Math.round(
      user.coinAmmount + exchange.value * user.fishAmmount
    );
    user.fishAmmount = 0;

    user.save();

    // create output string with only two digits after comma
    const exchangeString = exchange.value
      .toString()
      .split("")
      .splice(0, 4)
      .join("");

    let sellEmbed = new EmbedBuilder()
      .setColor(Colors.Green)
      .setAuthor({
        name: interaction.member.displayName,
        iconURL: interaction.member.displayAvatarURL(),
      })
      .setTitle("\`COMPLETE\`")
      .setFooter({ text: `mom. Wechselkurs: 1 🐟 ➨ ${exchangeString} Coins` })
      .setDescription(
        `
        *Du hast erfolgreich **${gainedCoins}** ${client.emojis.cache.find(
          (emoji) => emoji.name === "coins"
        )} bekommen!*
        `
      );
    interaction.reply({ embeds: [sellEmbed] });
    return;
  },
};
