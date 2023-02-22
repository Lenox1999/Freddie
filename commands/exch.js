const { SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");
const mongoose = require("mongoose");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("exch")
    .setDescription("Momentanen Fisch-Wechselkurs ausgeben"),
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
      .setColor(Colors.DarkAqua)
      .setTitle(`Momentaner Fisch-Wechselkurs von ${interaction.guild.name}`)
      .setDescription(`
        Der derzeitige Fisch-Wechselkurs beträgt **${exchangeString}**!      
      `);
    interaction.reply({ embeds: [exchangeEmbed] });
  },
};
