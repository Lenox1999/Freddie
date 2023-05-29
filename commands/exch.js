const { SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");
const mongoose = require("mongoose");
const ecolor = require("../util/embedColors.json")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("exch")
    .setDescription("🠞 Exchange: Banana to Coins"),
    
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

    let t = [
      "Der Exchanger ändert sich jede 12h. Also achte auf den jetztigen Wechselkurs und entscheide spontan, ob du verkaufst.",
      "Du kannst nicht viel voraus sehen, da es immer Random neue Zahlen sind, also es gibt kein Muster",
      "Es ist einfacher als gedacht, aber unberechenbar! ~David",
      "[PLACEHOLDER] (Hatte keine Ideen mehr)",
      "Achso die Zahlen liegen zwischen- Hättest du gedacht ich sage dir das so einfach?"
    ]

    let exchangeEmbed = new EmbedBuilder()
      .setThumbnail("https://cdn.discordapp.com/attachments/661359204572987393/1112483717642997924/exch.png")
      .setColor(ecolor.TEXT)
      .setAuthor({ name: `${interaction.guild.name} Exchanger`, iconURL: interaction.guild.iconURL() })
      .setTitle(`Exchanger Tipps`)
      .setDescription(`*${t[Math.floor(Math.random() * t.length)]}*`)
      .setFields([
        {
          name: `Banana to Coins`,
          value: `1 🍌 ➨ **${exchangeString}** ${client.emojis.cache.find(emoji => emoji.name === "coins")}`,
          inline: false
        }
      ])
      .setTimestamp();
    interaction.reply({ embeds: [exchangeEmbed] });
  },
};
