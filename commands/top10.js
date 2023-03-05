const {
  SlashCommandBuilder,
  EmbedBuilder,
  Colors
} = require("discord.js");
const mongoose = require("mongoose");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("top10")
    .setDescription("🠞 Leaderboard: First 10 Members in Coins or XP")
    .addStringOption((option) =>
      option
        .setName("art")
        .setDescription("Coins or XP?")
        .addChoices(
          { name: "Coins", value: "vcoin" },
          { name: "XP", value: "vxp" }
        )
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const top10 = {};
    const User = mongoose.models.User;

    const sortable = [];
    const users = await User.find({});

    if (interaction.options.getString("art") === "vcoin") {
      users.forEach((user) => {
        top10[user.name] = user.coinAmmount;
      });

      for (const user in top10) {
        sortable.push([user, top10[user]]);
      }

      sortable.sort((a, b) => {
        return b[1] - a[1];
      });

      const finalTop10 = [];

      for (let i = 0; i <= 10; i++) {
        if (i >= sortable.length) {
          break;
        }
        finalTop10.push(
          `${i + 1}. ${sortable[i][0]} → ${
            sortable[i][1]
          } ${client.emojis.cache.find((emoji) => emoji.name === "coins")}`
        );
      }
      finalTop10.join(" ");

      let top10CoinEmbed = new EmbedBuilder()
        .setThumbnail(interaction.guild.iconURL())
        .setColor(Colors.Gold)
        .setTitle(`Top 10-Coins von ${interaction.guild.name}`).setDescription(`

          ${finalTop10.join("\n")}
          
        `);

      interaction.reply({ embeds: [top10CoinEmbed] });
    } else {
      users.forEach((user) => {
        top10[user.name] = user.XP;
      });

      for (const user in top10) {
        sortable.push([user, top10[user]]);
      }

      sortable.sort((a, b) => {
        return b[1] - a[1];
      });

      const finalTop10 = [];

      for (let i = 0; i <= 10; i++) {
        if (i >= sortable.length) {
          break;
        }
        finalTop10.push(
          `${i + 1}. ${sortable[i][0]} → ${
            sortable[i][1]
          } XP`
        );
      }
      finalTop10.join(" ");

      let top10XPEmbed = new EmbedBuilder()
        .setThumbnail(interaction.guild.iconURL())
        .setColor(Colors.Gold)
        .setTitle(`Top 10-XP von ${interaction.guild.name}`).setDescription(`

          ${finalTop10.join("\n")}
          
        `);

      interaction.reply({ embeds: [top10XPEmbed] });
      return;
    }
  },
};
