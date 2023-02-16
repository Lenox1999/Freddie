const { SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");
const mongoose = require("mongoose");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("sell")
    .setDescription("Alle Burger verkaufen um Geld bekommen"),
  async execute(interaction, client) {
    const userId = interaction.member.id;

    const User = mongoose.models.User;
    const Exchange = mongoose.models.Exchanges;

    const user = await User.findOne(
      { _id: userId },
      "burgerAmmount coinAmmount name"
    );

    const exchange = await Exchange.findOne({_id: 'Exchange'}, 'value');
    console.log(exchange);

    if (interaction.member.id === client.user.id) {
      return;
    }
    if (interaction.member.bot) {
      return;
    }

    user.coinAmmount = Math.round(user.coinAmmount + (exchange.value * user.burgerAmmount));
    user.burgerAmmount = 0;

    user.save();

    interaction.reply(
      `Erfolg! Du hast jetzt ${user.coinAmmount} Coins und ${user.burgerAmmount} Burger, ${user.name}`
    );
  },
};
