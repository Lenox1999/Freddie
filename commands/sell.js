const { SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");
const mongoose = require("mongoose");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("sell")
    .setDescription("Alle Burger verkaufen um Geld bekommen")
    .addStringOption((option) =>
      option
        .setName("wunsch")
        .setDescription("Verkaufen oder nur Wechselkurs einsehen?")
        .addChoices(
          { name: "Wechselkurs", value: "xchange" },
          { name: "Verkaufen", value: "xsell" }
        ).setRequired(true)
    ),
  async execute(interaction, client) {
    const userId = interaction.member.id;

    const User = mongoose.models.User;
    const Exchange = mongoose.models.Exchanges;

    const user = await User.findOne(
      { _id: userId },
      "burgerAmmount coinAmmount name"
    );

    const exchange = await Exchange.findOne({ _id: "Exchange" }, "value");
    console.log(exchange);

    if (interaction.member.id === client.user.id) {
      return;
    }
    if (interaction.member.bot) {
      return;
    }

    if (interaction.options.getString("wunsch") === "xsell") {
      user.coinAmmount = Math.round(
        user.coinAmmount + exchange.value * user.burgerAmmount
      );
      user.burgerAmmount = 0;

      user.save();

      let sellEmbed = new EmbedBuilder()
        .setAuthor({
          name: interaction.member.displayName,
          iconURL: interaction.member.displayAvatarURL(),
        })
        .setTitle("ERFOLG ALLE COINS VERKAUFT!")
        .setDescription(
          `
        Erfolg! Du hast jetzt ${user.coinAmmount} Coins und ${user.burgerAmmount} Burger, ${user.name}
        Der derzeitige Wechselkurs beträgt ${exchange.value} 
        `
        );
      interaction.reply({ embeds: [sellEmbed] });
      return;
    } else {
      let showExchangeEmbed = new EmbedBuilder()
        .setTitle(`Derzeitiger Wechselkurs von ${interaction.guild.name}`)
        .setThumbnail(interaction.guild.iconURL())
        .setDescription(
          `
          Der derzeitige Wechselkurs dieses Servers beträgt ${exchange.value}!
          Das bedeutet ein Burger ist derzeit ${exchange.value} Coins wert!
        `
        );

      interaction.reply({ embeds: [showExchangeEmbed] });
    }
  },
};
