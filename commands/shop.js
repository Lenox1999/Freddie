const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  Colors,
  InteractionResponse
} = require("discord.js");
const mongoose = require("mongoose");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shop")
    .setDescription("Hier kannst du Items kaufen und upgraden")
    .addStringOption((option) => 
       option
        .setName("produkt")
        .setDescription("Gewünschtes Produkt")
        .addChoices(
        {name: 'Plantage', value: 'plantation'},
        {name: 'Dünger', value: 'fertilizer'},
        {name: 'Affenbande', value: 'moremonkeys'},
        {name: '1.5x Multiplier', value: '1.5x'},
        {name: '2x Multiplier', value: '2.0x'},
        {name: '3x Multiplier', value: '3.0x'},
        {name: 'Default Lootbox', value: 'defaultLoot'},
        {name: 'Rare Lootbox', value: 'rareLoot'},
        {name: 'Epic Lootbox', value: 'epicLoot'},

      ).setRequired(false)),
  async execute(interaction, client) {
    const User = mongoose.models.User;
    const user = await User.findOne({ _id: interaction.member.id }, "gears coinAmmount multiplier");

    const product = interaction.options.getString('produkt');


    if (product === null) {

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

  // means user wants to buy a product
  } else if (product === 'plantation' || product === 'fertilizer' || product === 'moremonkeys'){
    if (product === 'plantation') {

    if (user.gears.plantation.level >= 9) {
      interaction.reply('Deine Plantage hat bereits das Maximallevel erreicht');
      return;
    } else if (user.coinAmmount < 1500) {
      interaction.reply('Du hast zu wenig Geld um dieses Upgrade zu erwerben');
    }

    await User.updateOne({_id: interaction.member.id}, {$set: {
      coinAmmount: user.coinAmmount -= 1500,
      "gears.plantation.level": user.gears.plantation.level += 1,
      "gears.plantation.onebanana": user.gears.plantation.onebanana -= 5,
      "gears.plantation.twobanana": user.gears.plantation.twobanana += 4,
      "gears.plantation.threebanana": user.gears.plantation.threebanana += 1,
    }})
    interaction.reply(`Deine Plantage wurde erfolgreich auf Level ${user.gears[product].level + 1} geupgradet`);
    return;
    } else if (product === 'fertilizer') {

    if (user.gears.fertilizer.level == 10) {
      interaction.reply('Dein Dünger hat bereits das Maximallevel erreicht');
      return;
    } else if (user.coinAmmount < 1500) {
      interaction.reply('Du hast zu wenig Geld um dieses Upgrade zu erwerben');
    }

    await User.updateOne({_id: interaction.member.id}, {$set: {
      coinAmmount: user.coinAmmount -= 1500,
      "gears.fertilizer.level": user.gears.fertilizer.level += 1,
      "gears.fertilizer.cooldownmsg": user.gears.fertilizer.cooldownmsg -= 1,
      "gears.fertilizer.cooldownvc": user.gears.fertilizer.cooldownvc -= 1,

    }})

    interaction.reply(`Dünger wurde erfolgreich auf Level ${user.gears[product].level} geupgradet`);
    return;
    } else  if (product === 'moremonkeys') {
    if (user.gears.moremonkeys.level >= 6) {
      interaction.reply('Deine Affenbande hat bereits das Maximallevel erreicht');
      return;
    } else if (user.coinAmmount < 1500) {
      interaction.reply('Du hast zu wenig Geld um dieses Upgrade zu erwerben');
    }

    await User.updateOne({_id: interaction.member.id}, {$set: {
      coinAmmount: user.coinAmmount -= 1500,
      "gears.moremonkeys.level": user.gears.moremonkeys.level += 1,
      "gears.moremonkeys.time": user.gears.moremonkeys.time -= 0.5,
    }})

    interaction.reply(`Affenbande wurde erfolgreich auf Level ${user.gears[product].level} geupgradet`);
    return;
    }

  } else if (product === '1.5x' || product === '2.0x' || product === '3.0x') {
    let multiplier = Number(product.split('').slice(0, 3).join('')); // get the value from the input and slice the x in 2x and so on away
    await User.updateOne({_id: interaction.member.id}, {$set: {
      "multiplier.value": multiplier,
      "multiplier.last": Date.now(), 
    }})
    interaction.reply(`Dein Multiplier beträgt jetzt ${multiplier}!`);
    return;
  } else if (product === 'rareLoot' || product === 'defaultLoot'  || product === 'epicLoot') {
    interaction.reply('Coming soon! Lootboxen sind noch nicht verfügbar.');
  }

  },
};
