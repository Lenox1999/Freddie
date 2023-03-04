const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CompenentType,
} = require("discord.js");
const mongoose = require("mongoose");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shop")
    .setDescription("Hier kannst du Items kaufen und upgraden"),
  async execute(interaction, client) {
    const User = mongoose.models.User;
    const user = await User.findOne({ _id: interaction.member.id }, "gears");

    const banana = user.gears.plantation;
    const fertilizer = user.gears.fertilizer;
    const monkeys = user.gears.moreMonkeys;

    let startembed = new EmbedBuilder().setTitle("SHOP").setDescription(`
      Plantation: [Description Plantation] Level ${banana.level} 
      Fertilizer: [Description Fertilizer] Level ${fertilizer.level}
      Monkeys: [Description Monkeys] Level ${monkeys.level}
    `);

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("upgrade")
        .setLabel("Upgrades")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("multiplier")
        .setLabel("Coin-Multiplier")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("lootbox")
        .setLabel("Lootboxen")
        .setStyle(ButtonStyle.Primary)
    );

    // embed für coin multiplier
    let multiplierEmbed = new EmbedBuilder().setTitle("Multiplier")
      .setDescription(`
      Mit Multipliern bekommst du mehr Coins 
      1.5x Multiplier - Dauer: 5h, Preis: 5000 Coins - Code: 1.5x
      2x Multiplier - Dauer: 4h, Preis: 15000 Coins -  Code 2x
      3x Multiplier - Dauer 1.5h, Preis 35000 Coins - Code 3x
    `);

    let lootBoxEmbed = new EmbedBuilder().setTitle("Lootboxen").setDescription(`
      Rare Lootbox: Preis: 500 coins 
      Epic Lootbox: Preis: 2000 Coins
      Legendary Lootbox: Preis: 5000 Coins
    `);

    const msg = await interaction.reply({
      embeds: [startembed],
      components: [buttons],
      fetchReply: true,
      ephemeral: true,
    });

    let collector = msg.createMessageComponentCollector({
      ComponentType: CompenentType.Button,
      time: 300000,
    });

    collector.on("collect", async (BI) => {
      const id = BI.customId;

      if (id === "upgrade") {
        BI.deferUpdate();
        interaction.editReply({ embeds: [startembed] });
      } else if (id === "multiplier") {
        BI.deferUpdate();
        interaction.editReply({ embeds: [multiplierEmbed] });
      } else if (id === "lootbox") {
        BI.deferUpdate();
        interaction.editReply({ embeds: [lootBoxEmbed] });
      }
    });

    collector.on("end", async () => {
      let shopTimeout = new EmbedBuilder()
        .setTitle("Shop geschlossen")
        .setTimestamp();

      interaction.editReply({ components: [], embeds: [shopTimeout] });
      return;
    });
  },
};
