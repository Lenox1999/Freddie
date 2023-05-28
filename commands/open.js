const { SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");
const mongoose = require("mongoose");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("open")
    .setDescription("Open your lootboxes"),

  async execute(interaction, client) {
    const User = mongoose.models.User;
    const user = await User.findOne({ _id: interaction.member.id }, "inventory");

    const lootboxes = user.inventory.lootboxes;
    const listOfRarities = [];
    const alreadyListedRarities = [];

    for (let i = 0; i <= lootboxes.length -1; i++) {
      let currRarity = lootboxes[i].rarity;
      if (alreadyListedRarities.includes(currRarity.toUpperCase())){
        console.log(alreadyListedRarities, currRarity, "das jibts schon");
        continue;
      }
      let rarityCount = 1;
      for (let k = i+1; k <= lootboxes.length -1; k++) {
        if(lootboxes[k].rarity === currRarity) {
          rarityCount += 1;
          console.log('ey');
        } else {
          continue;
        }
      }
      currRarity = currRarity.toUpperCase();
      alreadyListedRarities.push(currRarity);
      listOfRarities.push(`${rarityCount}x ${currRarity}`);
    }

    let finalString = listOfRarities.join("\n");

    let listEmbed = new EmbedBuilder()
      .setColor(Colors.Green)
      .setTitle("Deine gesammelten Lootboxen")
      .setDescription(`${finalString}`);

    interaction.reply({ embeds: [listEmbed], ephermeral: true });
  },
};
