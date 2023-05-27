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

const shopDB = require('../economy/shop.json');

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
                name:`Plantage | Lvl __${banana.level}__ > __${banana.level + 1}__`,
                value:`Kosten: ${shopDB.plantation["default-price"] * (user.gears.plantation.level +1)}`,
                inline: false
            },
            {
                name:`Dünger | Lvl __${fertilizer.level}__ > __${fertilizer.level + 1}__`,
                value:`Kosten: ${shopDB.fertilizer["default-price"] * (user.gears.fertilizer.level +1)}`,
                inline: false
            },
            {
                name:`Affenbande | Lvl __${monkeys.level}__ > __${monkeys.level + 1}__`,
                value:`Kosten: ${shopDB.moremonkeys["default-price"] * (user.gears.moremonkeys.level +1)}`,
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
    let maxlevel = new EmbedBuilder()
      .setColor(Colors.DarkRed)
      .setTitle("\`Max. Level\`")
      .setDescription("Du hast das maximale Level schon erreicht!")
      .setTimestamp();
    
    let nomoney = new EmbedBuilder()
      .setColor(Colors.DarkRed)
      .setTitle("\`Du bist arm..\`")
      .setDescription("Du hast nicht genügend Geld um dieses Upgrade zu erwerben!")
      .setTimestamp();

    if (product === 'plantation') {

    if (user.gears.plantation.level >= shopDB.plantation["max-level"]) {
      interaction.reply({embeds: [maxlevel], ephemeral: true});
      return;
    } else if (user.coinAmmount < shopDB.plantation["default-price"] * (user.gears.plantation.level +1)) {
      interaction.reply({embeds: [nomoney], ephemeral: true});
      return;
    }

    await User.updateOne({_id: interaction.member.id}, {$set: {
      coinAmmount: user.coinAmmount -= shopDB.plantation["default-price"] * (user.gears.plantation.level +1),
      "gears.plantation.level": user.gears.plantation.level += 1,
      "gears.plantation.onebanana": user.gears.plantation.onebanana -= 5,
      "gears.plantation.twobanana": user.gears.plantation.twobanana += 4,
      "gears.plantation.threebanana": user.gears.plantation.threebanana += 1,
    }})
    let upgradefinish = new EmbedBuilder()
      .setColor(Colors.Green)
      .setTitle("\`UPGRADE\`")
      .setDescription(`Deine Plantage wurde erfolgreich auf Level ${user.gears[product].level + 1} geupgradet.`)
      .setTimestamp();

    interaction.reply({embeds: [upgradefinish]});
    return;
    } else if (product === 'fertilizer') {

    if (user.gears.fertilizer.level == shopDB.fertilizer["max-level"]) {
      interaction.reply({embeds: [maxlevel], ephemeral: true});
      return;
    } else if (user.coinAmmount < shopDB.fertilizer["default-price"] * (user.gears.fertilizer.level +1)) {
      interaction.reply({embeds: [nomoney], ephemeral: true});
      return;
    }
    await User.updateOne({_id: interaction.member.id}, {$set: {
      coinAmmount: user.coinAmmount -= shopDB.fertilizer["default-price"] * (user.gears.fertilizer.level +1),
      "gears.fertilizer.level": user.gears.fertilizer.level += 1,
      "gears.fertilizer.cooldownmsg": user.gears.fertilizer.cooldownmsg -= 1,
      "gears.fertilizer.cooldownvc": user.gears.fertilizer.cooldownvc -= 1,

    }})
    let upgradefinish = new EmbedBuilder()
      .setColor(Colors.Green)
      .setTitle("\`UPGRADE\`")
      .setDescription(`Dünger wurde erfolgreich auf Level ${user.gears[product].level} geupgradet.`)
      .setTimestamp();

    interaction.reply({embeds: [upgradefinish]});
    return;
    } else  if (product === 'moremonkeys') {
    if (user.gears.moremonkeys.level >= shopDB.moremonkeys["max-level"]) {
      interaction.reply({embeds: [maxlevel], ephemeral: true});
      return;
    } else if (user.coinAmmount < shopDB.moremonkeys["default-price"] * (user.gears.moremonkeys.level +1)) {
      interaction.reply({embeds: [nomoney], ephemeral: true});
      return;
    }

    await User.updateOne({_id: interaction.member.id}, {$set: {
      coinAmmount: user.coinAmmount -= shopDB.moremonkeys["default-price"] * (user.gears.moremonkeys.level +1),
      "gears.moremonkeys.level": user.gears.moremonkeys.level += 1,
      "gears.moremonkeys.time": user.gears.moremonkeys.time -= 0.5,
    }})
    let upgradefinish = new EmbedBuilder()
      .setColor(Colors.Green)
      .setTitle("\`UPGRADE\`")
      .setDescription(`Affenbande wurde erfolgreich auf Level ${user.gears[product].level} geupgradet.`)
      .setTimestamp();

    interaction.reply({embeds: [upgradefinish]});
    return;
    }

  } else if (product === '1.5x' || product === '2.0x' || product === '3.0x') {
    let nomoney = new EmbedBuilder()
      .setColor(Colors.DarkRed)
      .setTitle("\`Du bist arm..\`")
      .setDescription("Du hast nicht genügend Geld um dieses Upgrade zu erwerben!")
      .setTimestamp();

    if (user.multiplier.last != 0) {
      let multiplier2 = new EmbedBuilder()
      .setColor(Colors.DarkRed)
      .setTitle("\`Laufender Multiplier\`")
      .setDescription(`Dein jetztiger Multiplier muss erst auslaufen, bevor du dir einen neuen kaufen kannst.`)
      .setTimestamp();

    interaction.reply({embeds: [multiplier2], ephemeral: true});
    return;
    }

    const price = shopDB[product].price;

    if (user.coinAmmount - price < 0) {
      interaction.reply({embeds: [nomoney], ephemeral: true});
      return;
    }
    
    let multiplier = Number(product.split('').slice(0, 3).join('')); // get the value from the input and slice the x in 2x and so on away
    await User.updateOne({_id: interaction.member.id}, {$set: {
      coinAmmount: user.coinAmmount -= price,
      "multiplier.value": multiplier,
      "multiplier.last": Date.now(), 
    }})
    let multiplierfinish = new EmbedBuilder()
      .setColor(Colors.Green)
      .setTitle("\`Multiplier gekauft\`")
      .setDescription(`Dein Multiplier beträgt jetzt **${multiplier}**!`)
      .setTimestamp();

    interaction.reply({embeds: [multiplierfinish], ephemeral: true});
    return;
  } else if (product === 'rareLoot' || product === 'defaultLoot'  || product === 'epicLoot') {
    interaction.reply('Coming soon! Lootboxen sind noch nicht verfügbar.');
    /*
      items aus items.json werden in einen Array eingelesen
      es wird eine Random Zahl generiert zwischen 0 und der länge des Arrays
      Lootboxen verschiedener Raritäten haben unterschiedliche Wahrscheinlichkeiten auf Items verschiedener Raritäten
      Wenn die Rarität eines gezogenen Items höher ist, als die der Lootbox, muss eine Zahl so und so oft regeneriert werden.
      Wenn der Index beispielsweise mehr als 10 mal von hundert generierten Zahlen auftaucht, wird das Item in die Lootbox gepackt. 
    */
  }

  },
};
