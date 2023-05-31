const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  InteractionResponse
} = require("discord.js");

const createLootbox = require('../economy/lootbox');
const mongoose = require("mongoose");
const shopDB = require('../economy/shop.json');
const ecolor = require("../util/embedColors.json")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shop")
    .setDescription("Hier kannst du Items kaufen oder upgraden")
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
        {name: 'Default Lootbox', value: 'default'},
        {name: 'Rare Lootbox', value: 'rare'},
        {name: 'Epic Lootbox', value: 'epic'},
        {name: 'Mystical Lootbox', value: 'mystical'}

      ).setRequired(false)),
  async execute(interaction, client) {
    let poortext = [
      "Arm sein ist asozial.. (bitte als Joke nehmen)",
      "Du bist pleite-",
      "Tja arm sein ist kacke..",
      "HAHAH DU HAST KEIN GELD",
      "No money here- *Grillen zirpen*"
    ]

    let poor = new EmbedBuilder()
      .setColor(ecolor.DENY)
      .setTitle(`*${poortext[Math.floor(Math.random() * poortext.length)]}*`)
      .setAuthor({ name: interaction.member.displayName, iconURL: interaction.member.displayAvatarURL() })

    let maxlevel = new EmbedBuilder()
      .setColor(ecolor.DENY)
      .setTitle("Bereits ausgelevelt")
      .setAuthor({ name: interaction.member.displayName, iconURL: interaction.member.displayAvatarURL() })
      .setTimestamp();

    const User = mongoose.models.User;
    const user = await User.findOne({ _id: interaction.member.id }, "gears coinAmmount multiplier ");

    const product = interaction.options.getString('produkt');


    if (product === null) {

    const banana = user.gears.plantation;
    const fertilizer = user.gears.fertilizer;
    const monkeys = user.gears.moremonkeys;

    let startembed = new EmbedBuilder()
        .setColor(ecolor.TEXT)
        .setTitle("\`Shop\`")
        .setAuthor({ name: interaction.member.displayName, iconURL: interaction.member.displayAvatarURL() })
        .setThumbnail(interaction.guild.iconURL())
        .setDescription(`*Hier kannst du deine Gears upgraden, Coin-Multiplier kaufen oder auch Lootboxen erwerben!*`)

    let gearsembed = new EmbedBuilder()
        .setColor(ecolor.TEXT)
        .setTitle("Shop \`Gears Update\`")
        .setAuthor({ name: interaction.member.displayName, iconURL: interaction.member.displayAvatarURL() })
        .setThumbnail(interaction.guild.iconURL())
        .setFields([
            {
                name:`**Plantage** | Lvl ${banana.level} > ${banana.level + 1}`,
                value:`Kosten: ${shopDB.plantation["default-price"] * (user.gears.plantation.level +1)} ${client.emojis.cache.find(emoji => emoji.name === "coins")}`,
                inline: false
            },
            {
                name:`**Dünger** | Lvl ${fertilizer.level} > ${fertilizer.level + 1}`,
                value:`Kosten: ${shopDB.fertilizer["default-price"] * (user.gears.fertilizer.level +1)} ${client.emojis.cache.find(emoji => emoji.name === "coins")}`,
                inline: false
            },
            {
                name:`**Affenbande** | Lvl ${monkeys.level} > ${monkeys.level + 1}`,
                value:`Kosten: ${shopDB.moremonkeys["default-price"] * (user.gears.moremonkeys.level +1)} ${client.emojis.cache.find(emoji => emoji.name === "coins")}`,
                inline: false
            }
        ])

    let multiplierembed = new EmbedBuilder()
        .setColor(ecolor.TEXT)
        .setTitle("Shop \`Coin-Multiplier\`")
        .setAuthor({ name: interaction.member.displayName, iconURL: interaction.member.displayAvatarURL() })
        .setThumbnail(interaction.guild.iconURL())
        .setFields([
            {
                name:`**1.5**x Multiplier`,
                value:`Kosten: ${shopDB["1.5x"].price} ${client.emojis.cache.find(emoji => emoji.name === "coins")}`,
                inline: false
            },
            {
                name:`**2**x Multiplier`,
                value:`Kosten: ${shopDB["2.0x"].price} ${client.emojis.cache.find(emoji => emoji.name === "coins")}`,
                inline: false
            },
            {
                name:`**3**x Multiplier`,
                value:`Kosten: ${shopDB["3.0x"].price} ${client.emojis.cache.find(emoji => emoji.name === "coins")}`,
                inline: false
            }
        ])

    let lootboxembed = new EmbedBuilder()
        .setColor(ecolor.TEXT)
        .setTitle("Shop \`Lootboxen\`")
        .setAuthor({ name: interaction.member.displayName, iconURL: interaction.member.displayAvatarURL() })
        .setThumbnail(interaction.guild.iconURL())
        .setFields([
            {
                name:`**Default** Lootbox`,
                value:`Kosten: ${shopDB["default"].price} ${client.emojis.cache.find(emoji => emoji.name === "coins")}`,
                inline: false
            },
            {
                name:`**Rare** Lootbox`,
                value:`Kosten: ${shopDB["rare"].price} ${client.emojis.cache.find(emoji => emoji.name === "coins")}`,
                inline: false
            },
            {
                name:`**Epic** Lootbox`,
                value:`Kosten: ${shopDB["epic"].price} ${client.emojis.cache.find(emoji => emoji.name === "coins")}`,
                inline: false
            },
            {
                name:`**Mystical** Lootbox`,
                value:`Kosten: ${shopDB["mystical"].price} ${client.emojis.cache.find(emoji => emoji.name === "coins")}`,
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
        interaction.editReply({ embeds: [gearsembed], ephemeral: true });
      } else if (id === "multiplier") {
        BI.deferUpdate();
        interaction.editReply({ embeds: [multiplierembed], ephemeral: true });
      } else if (id === "lootbox") {
        BI.deferUpdate();
        interaction.editReply({ embeds: [lootboxembed], ephemeral: true });
      }
    });

    collector.on("end", async () => {
      let shopTimeout = new EmbedBuilder()
        .setColor(ecolor.DENY)
        .setAuthor({ name: interaction.member.displayName, iconURL: interaction.member.displayAvatarURL() })
        .setTitle("\`Shop closed..\`")
        .setTimestamp();

      interaction.editReply({ components: [], embeds: [shopTimeout], ephemeral: true });
      return;
    });

  // means user wants to buy a product
  } else if (product === 'plantation' || product === 'fertilizer' || product === 'moremonkeys'){
    if (product === 'plantation') {

    if (user.gears.plantation.level >= shopDB.plantation["max-level"]) {
      maxlevel.setDescription(`Leider hast du bei den **Plantagen bereits das maximale Level** erreicht. Auf der einen Seite Glückwunsch und auf der anderen Seite HAHHAHAHA`)
      interaction.reply({embeds: [maxlevel], ephemeral: true});
      return;
    } else if (user.coinAmmount < shopDB.plantation["default-price"] * (user.gears.plantation.level +1)) {
      poor.setDescription(`Das **Plantagen Upgrade kostet leider zu viel** für dich. Gehe ein wenig aktiv in einen Voice Channel mit paar Friends oder schreibe etwas im Chat. Du kannst aber auch auf eigene Gefahr in die Lotterie gehen..`)
      interaction.reply({embeds: [poor], ephemeral: true});
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
      .setColor(ecolor.ACCEPT)
      .setTitle("PLANTAGEN UPGRADE")
      .setAuthor({ name: interaction.member.displayName, iconURL: interaction.member.displayAvatarURL() })
      .setDescription(`${user.gears[product].level - 1} >>> ${user.gears[product].level}`)
      .setTimestamp();

    interaction.reply({embeds: [upgradefinish]});
    return;
    } else if (product === 'fertilizer') {

    if (user.gears.fertilizer.level == shopDB.fertilizer["max-level"]) {
      maxlevel.setDescription(`Leider hast du bei dem **Dünger bereits das maximale Level** erreicht. Auf der einen Seite Glückwunsch und auf der anderen Seite HAHHAHAHA`)
      interaction.reply({embeds: [maxlevel], ephemeral: true});
      return;
    } else if (user.coinAmmount < shopDB.fertilizer["default-price"] * (user.gears.fertilizer.level +1)) {
      poor.setDescription(`Das **Dünger Upgrade kostet leider zu viel** für dich. Gehe ein wenig aktiv in einen Voice Channel mit paar Friends oder schreibe etwas im Chat. Du kannst aber auch auf eigene Gefahr in die Lotterie gehen..`)
      interaction.reply({embeds: [poor], ephemeral: true});
      return;
    }
    await User.updateOne({_id: interaction.member.id}, {$set: {
      coinAmmount: user.coinAmmount -= shopDB.fertilizer["default-price"] * (user.gears.fertilizer.level +1),
      "gears.fertilizer.level": user.gears.fertilizer.level += 1,
      "gears.fertilizer.cooldownmsg": user.gears.fertilizer.cooldownmsg -= 1,
      "gears.fertilizer.cooldownvc": user.gears.fertilizer.cooldownvc -= 1,

    }})
    let upgradefinish = new EmbedBuilder()
      .setColor(ecolor.ACCEPT)
      .setTitle("DÜNGER UPGRADE")
      .setAuthor({ name: interaction.member.displayName, iconURL: interaction.member.displayAvatarURL() })
      .setDescription(`${user.gears[product].level - 1} >>> ${user.gears[product].level}`)
      .setTimestamp();

    interaction.reply({embeds: [upgradefinish]});
    return;
    } else  if (product === 'moremonkeys') {
    if (user.gears.moremonkeys.level >= shopDB.moremonkeys["max-level"]) {
      maxlevel.setDescription(`Leider sind deine Affen **bereits auf dem maximalen Level**. Auf der einen Seite Glückwunsch und auf der anderen Seite HAHHAHAHA`)
      interaction.reply({embeds: [maxlevel], ephemeral: true});
      return;
    } else if (user.coinAmmount < shopDB.moremonkeys["default-price"] * (user.gears.moremonkeys.level +1)) {
      poor.setDescription(`Das **Affenbande Upgrade kostet leider zu viel** für dich. Gehe ein wenig aktiv in einen Voice Channel mit paar Friends oder schreibe etwas im Chat. Du kannst aber auch auf eigene Gefahr in die Lotterie gehen..`)
      interaction.reply({embeds: [poor], ephemeral: true});
      return;
    }

    await User.updateOne({_id: interaction.member.id}, {$set: {
      coinAmmount: user.coinAmmount -= shopDB.moremonkeys["default-price"] * (user.gears.moremonkeys.level +1),
      "gears.moremonkeys.level": user.gears.moremonkeys.level += 1,
      "gears.moremonkeys.time": user.gears.moremonkeys.time -= 0.5,
    }})
    let upgradefinish = new EmbedBuilder()
      .setColor(ecolor.ACCEPT)
      .setTitle("AFFENBANDE UPGRADE")
      .setAuthor({ name: interaction.member.displayName, iconURL: interaction.member.displayAvatarURL() })
      .setDescription(`${user.gears[product].level - 1} >>> ${user.gears[product].level}`)
      .setTimestamp();

    interaction.reply({embeds: [upgradefinish]});
    return;
    }

  } else if (product === '1.5x' || product === '2.0x' || product === '3.0x') {
    if (user.multiplier.last != 0) {
      let multiplier2 = new EmbedBuilder()
        .setColor(ecolor.DENY)
        .setTitle("Laufender Multiplier")
        .setAuthor({ name: interaction.member.displayName, iconURL: interaction.member.displayAvatarURL() })
        .setDescription(`Dein jetztiger Multiplier muss erst auslaufen, bevor du dir einen neuen kaufen kannst. 
        
        Ein Multiplier geht immer 4h also kannst du dir selber ausrechnen wie lange deiner noch geht.. Dazu kannst du einfach gucken, wenn dein Multiplier wieder bei **1**x ist!`)
        .setTimestamp();

    interaction.reply({embeds: [multiplier2], ephemeral: true});
    return;
    }

    const price = shopDB[product].price;

    if (user.coinAmmount - price < 0) {
      poor.setDescription(`Der **Multiplier kostet leider zu viel** für dich. Gehe ein wenig aktiv in einen Voice Channel mit paar Friends oder schreibe etwas im Chat. Du kannst aber auch auf eigene Gefahr in die Lotterie gehen..`)
      interaction.reply({embeds: [poor], ephemeral: true});
      return;
    }
    
    let multiplier = Number(product.split('').slice(0, 3).join('')); // get the value from the input and slice the x in 2x and so on away
    await User.updateOne(
      {_id: interaction.member.id},
      {
        $set: {
         coinAmmount: user.coinAmmount -= price,
         "multiplier.value": multiplier,
         "multiplier.last": Date.now(), 
    }})

    let mb = [
      "Das ging jetzt ins Geld, aber",
      "Alter krass, dass wird dir viel bringen und das war jetzt unironisch, aber",
      "Da ist das Geld weg, aber",
      "DIREKT IN DIE LOTTERIE UND GRINDEN achso und",
      "Nett hier. Aber waren Sie schon mal in Baden-Württemberg? Achso und"
    ]

    let multiplierfinish = new EmbedBuilder()
      .setColor(ecolor.ACCEPT)
      .setTitle("NEUER MULTIPLIER")
      .setAuthor({ name: interaction.member.displayName, iconURL: interaction.member.displayAvatarURL() })
      .setDescription(`${mb[Math.floor(Math.random() * mb.length)]} du hast jetzt ein Multiplier von **${multiplier}**x erworben.`)
      .setTimestamp();

    interaction.reply({embeds: [multiplierfinish]});
    return;
  } else if (product === 'default' || product === 'rare'  || product === 'epic' || product === 'mystical') {
    

    if (user.coinAmmount < shopDB[product].price) {
      poor.setDescription(`Die **Lootbox kostet leider zu viel** für dich. Gehe ein wenig aktiv in einen Voice Channel mit paar Friends oder schreibe etwas im Chat. Du kannst aber auch auf eigene Gefahr in die Lotterie gehen..`)
      interaction.reply({embeds: [poor], ephemeral: true})
      return;
    }

    lootbox = await createLootbox(product, undefined)

    await User.updateOne({_id: interaction.member.id,}, {$set: {"coinAmmount": user.coinAmmount -= shopDB[product].price}})
    await User.updateOne({_id: interaction.member.id}, {$push: {"inventory.lootboxes": lootbox}} )

    let lootboxfinish = new EmbedBuilder()
      .setColor(ecolor.ACCEPT)
      .setTitle("LOOTBOX ERWORBEN")
      .setAuthor({ name: interaction.member.displayName, iconURL: interaction.member.displayAvatarURL() })
      .setDescription(`Du hast die gerade eine **${product}** Lootbox gekauft.. Bist du schon gespannt, wie ein Bettlaken was da drin ist?`)
      .setTimestamp();

    interaction.reply({ embeds: [lootboxfinish] });

    return;
    /*
      items aus items.json werden in einen Array eingelesen
      es wird eine Random Zahl generiert zwischen 0 und der länge des Arrays
      Lootboxen verschiedener Raritäten haben unterschiedliche Wahrscheinlichkeiten auf Items verschiedener Raritäten
      Wenn die Rarität eines gezogenen Items höher ist, als die der Lootbox, muss eine Zahl so und so oft regeneriert werden.
      Wenn der Index beispielsweise mehr als 10 mal avon hundert generierten Zahlen auftaucht, wird das Item in die Lootbox gepackt. 
    */
  }

  },
};