const { SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");
const mongoose = require("mongoose");
const userNotRegistered = require('../util/userNotRegistered');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bal")
    .setDescription("🠞 Account-Info: Coins, Banana, Multiplier und Streaks"),

  async execute(interaction, client) {
    const User = mongoose.models.User;
    const Exchanges = mongoose.models.Exchanges;
    const exchange = await Exchanges.findOne({ _id: "Exchange" }, "value");

    User.findOne({ _id: interaction.member.id })
      .select("coinAmmount bananaAmmount streak multiplier")
      .exec((err, user) => {
        if (err) {
          console.log(err);
          return;
        }

        // Is User in DB?
        if (!user) {
          userNotRegistered(interaction, client);
        }

        let coins = user.coinAmmount.toString();
        let bananas = user.bananaAmmount.toString();
        let multiplier = user.multiplier.toString();
        let streak = user.streak.toString();

        var whenselling = ``;
        const gainedCoins = Math.round(exchange.value * user.bananaAmmount);
        const allinall = Math.floor(gainedCoins + user.coinAmmount)

        if(user.bananaAmmount > 0) {
          whenselling = `
          ⠀→ *+${gainedCoins}* ${client.emojis.cache.find(emoji => emoji.name === "coins")}
          ⠀→ *${allinall}* ${client.emojis.cache.find(emoji => emoji.name === "coins")}`
        }

        var balembed = new EmbedBuilder()
          .setColor(Colors.Blue)
          .setTitle(`Account: \`${interaction.member.displayName}\``)
          .setThumbnail(interaction.member.displayAvatarURL())
          .setDescription(`
          ・Bananas **${bananas}** 🍌${whenselling}
          ・Coins **${coins}** ${client.emojis.cache.find(emoji => emoji.name === "coins")}
          ・Multiplier **${multiplier}**x
          ・Daily-Streak **${streak}** ${client.emojis.cache.find(emoji => emoji.name === "daily")}
          `)
        interaction.reply({ embeds: [balembed]});
      });
  },
};
