const { SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");
const mongoose = require("mongoose");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("exch")
    .setDescription("🠞 Exchange: Fish to Coins"),
    
  async execute(interaction, client) {
    const Exchanges = mongoose.models.Exchanges;

    const exchange = await Exchanges.findOne({ _id: "Exchange" }, "value");

    if (!exchange) {
      console.log("DB ERROR");
      return;
    }

    const exchangeString = exchange.value
      .toString()
      .split("")
      .splice(0, 4)
      .join("");

    let exchangeEmbed = new EmbedBuilder()
      .setThumbnail(interaction.guild.iconURL())
      .setColor(Colors.Blue)
      .setTitle(`\`${interaction.guild.name}'s Exchange\``)
      .setDescription(`
      1 🍌 ➨ **${exchangeString}** ${client.emojis.cache.find(emoji => emoji.name === "coins")}
      `);
    interaction.reply({ embeds: [exchangeEmbed], ephemeral: true });
  },
};
