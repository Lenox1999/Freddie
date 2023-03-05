const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  Colors
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
    const monkeys = user.gears.moremonkeys;

    let startembed = new EmbedBuilder()
        .setColor(Colors.Blue)
        .setTitle("\`Shop\`")
        .setThumbnail(interaction.guild.iconURL())
        .setDescription(`*Hier kannst du deine Gears upgraden, Coin-Multiplier kaufen oder auch Lootboxen erwerben!*`)

    let gearsembed = new EmbedBuilder()
        .setColor(Colors.Blue)
        .setTitle("Shop \`Gears Update\`")
        .setThumbnail(interaction.guild.iconURL())
        .setFields([
            {
                name:`Plantage Lvl ${banana.level}`,
                value:`Kosten: ...`,
                inline: false
            },
            {
                name:`Dünger Lvl ${fertilizer.level}`,
                value:`Kosten: ...`,
                inline: false
            },
            {
                name:`Affenbande Lvl ${monkeys.level}`,
                value:`Kosten: ...`,
                inline: false
            }
        ])

    let multiplierembed = new EmbedBuilder()
        .setColor(Colors.Blue)
        .setTitle("Shop \`Coin-Multiplier\`")
        .setThumbnail(interaction.guild.iconURL())
        .setFields([
            {
                name:`1.5x Multiplier`,
                value:`Kosten: ...`,
                inline: false
            },
            {
                name:`2x Multiplier`,
                value:`Kosten: ...`,
                inline: false
            },
            {
                name:`3x Multiplier`,
                value:`Kosten: ...`,
                inline: false
            }
        ])

    let lootboxembed = new EmbedBuilder()
        .setColor(Colors.Blue)
        .setTitle("Shop \`Lootboxen\`")
        .setThumbnail(interaction.guild.iconURL())
        .setFields([
            {
                name:`Default Lootbox`,
                value:`Kosten: ...`,
                inline: false
            },
            {
                name:`Rare Lootbox`,
                value:`Kosten: ...`,
                inline: false
            },
            {
                name:`Epic Lootbox`,
                value:`Kosten: ...`,
                inline: false
            }
        ])

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

    const msg = await interaction.reply({
      embeds: [startembed],
      components: [buttons],
      fetchReply: true,
      ephemeral: true,
    });

    let collector = msg.createMessageComponentCollector({
      ComponentType: ComponentType.Button,
      time: 300000,
    });

    collector.on("collect", async (BI) => {
      const id = BI.customId;

      if (id === "upgrade") {
        BI.deferUpdate();
        interaction.editReply({ embeds: [gearsembed] });
      } else if (id === "multiplier") {
        BI.deferUpdate();
        interaction.editReply({ embeds: [multiplierembed] });
      } else if (id === "lootbox") {
        BI.deferUpdate();
        interaction.editReply({ embeds: [lootboxembed] });
      }
    });

    collector.on("end", async () => {
      let shopTimeout = new EmbedBuilder()
        .setColor(Colors.Red)
        .setTitle("\`ERROR: Shop closed..\`")
        .setTimestamp();

      interaction.editReply({ components: [], embeds: [shopTimeout] });
      return;
    });
  },
};
