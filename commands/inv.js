const { SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");
const mongoose = require("mongoose");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("inv")
    .setDescription("See whats in your inventory"),

  async execute(interaction, client) {
    const User = mongoose.models.User;
    const user = await User.findOne(
      { _id: interaction.member.id },
      "inventory"
    );

    // go through every element which is save in inventory
    // sort between classes and lootboxes

    // find lootboxes in inventory

    const lootboxes = user.inventory.lootboxes;

    const listOfRarities = [];
    const alreadyListedRarities = [];

    for (let i = 0; i <= lootboxes.length - 1; i++) {
      let currRarity = lootboxes[i].rarity;
      if (alreadyListedRarities.includes(currRarity.toUpperCase())) {
        continue;
      }
      let rarityCount = 1;
      for (let k = i + 1; k <= lootboxes.length - 1; k++) {
        if (lootboxes[k].rarity === currRarity) {
          rarityCount += 1;
        } else {
          continue;
        }
      }
      currRarity = currRarity.toUpperCase();
      alreadyListedRarities.push(currRarity);
      listOfRarities.push(`${rarityCount}x ${currRarity}`);
    }

    const rarityString = listOfRarities.join("\n");
    console.log(listOfRarities);

    let classObj = {};

    const items = user.inventory.contents;

    for (let i = 0; i < items.length - 1; i++) {
      let currItem = items[i];
      let currClass = currItem.class;

      if (!classObj[currClass]) {
        classObj[currClass] = [currItem];
      } else if (classObj[currClass]) {
        classObj[currClass].push(currItem);
      }
    }

    // console.log(classObj);

    let finalString = [];

    let alreadyItems = [];

    for (const [key, value] of Object.entries(classObj)) {
      classObj[`${key}String`] = [`**${key.toUpperCase()}** \n`];
      classObj[key].forEach((e) => {
        if (alreadyItems.indexOf(e.name) === -1) {
          classObj[`${key}String`].push(`1x ${e.name}\n`);
          alreadyItems.push(e.name);
        } 
      });
      finalString.push(classObj[`${key}String`].join(""));
    }

    if (listOfRarities.length > 0) {
      finalString.push(`**Lootboxen**`, rarityString);
    }

    // console.log(finalString.join('\n'));
    var invEmbed = new EmbedBuilder()
      .setTitle("`Dein Inventar`")
      .setAuthor({
        name: `${interaction.member.displayName}`,
        iconURL: interaction.member.displayAvatarURL(),
      }).setDescription(`

        ${finalString.join(`\n`)}
        `);

    interaction.reply({ embeds: [invEmbed] });
    return;
  },
};
