const { SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");
const mongoose = require("mongoose");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("open")
    .setDescription("Open your lootboxes")
    .addStringOption((option) =>
      option
        .setName("typ")
        .setDescription("Gewünschtes Produkt")
        .addChoices(
          { name: "Default", value: "default" },
          { name: "Rare", value: "rare" },
          { name: "Epic", value: "epic" },
          { name: "Mystical", value: "mystical" }
        )
    ),

  async execute(interaction, client) {
    const User = mongoose.models.User;
    const user = await User.findOne(
      { _id: interaction.member.id },
      "inventory"
    );

    const lootboxes = user.inventory.lootboxes;

    const type = interaction.options.getString("typ");
    console.log(type);

    if (type) {
      let searchRes;

      lootboxes.forEach((lb) => {
        if (lb.rarity === type) {
          searchRes = lb;
        }
      });

      if (!searchRes) {
        interaction.reply(
          "Du besitzt keine solche Lootbox! Kaufe dir mithilfe von /shop eine!"
        );
        return;
      }

      const names = [];
      const contents = searchRes.contents;

      //extract lootbox
      for (let i = 0; i <= searchRes.contents.length - 1; i++) {
        let content = searchRes.contents[i];
        names.push(content.name);
      }
      // check if inventory.contents already exists for user in db
      if (user.inventory["contents"]) {
        contents.forEach(async (e) => {
          console.log(e);
          await User.updateOne(
            { _id: interaction.member.id },
            { $push: { "inventory.contents": e } }
          );
        });
        await user.save();
      } else {
        await User.updateOne(
          { _id: interaction.member.id },
          { $set: { "inventory.contents": [contents] } }
        );
      }

      const timestamp = searchRes.timestamp;

      // remove lootbox from inventory.lootboxes with the help of the unique timestamp
      await User.updateOne(
        { _id: interaction.member.id },
        { $pull: { "inventory.lootboxes": { timestamp: timestamp } } }
      );

      let finalString = names.join("\n");
      let openEmbed = new EmbedBuilder()
        .setColor(Colors.Green)
        .setTitle("Der Inhalt der geöffneten Lootbox")
        .setDescription(`${finalString}`);

      interaction.reply({ embeds: [openEmbed] });
      return;
    }

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

    let finalString = listOfRarities.join("\n");

    let listEmbed = new EmbedBuilder()
      .setColor(Colors.Green)
      .setTitle("Deine gesammelten Lootboxen")
      .setDescription(`${finalString}`);

    interaction.reply({ embeds: [listEmbed], ephermeral: true });
  },
};
