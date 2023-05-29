const { SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");
const mongoose = require("mongoose");
const ecolor = require("../util/embedColors.json")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("open")
    .setDescription("🠞 Lootbox Opening: Open your Lootboxes and see what is inside-")
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
        var nolb = new EmbedBuilder()
          .setColor(ecolor.DENY)
          .setTitle("Du hast nix")
          .setThumbnail("https://cdn.discordapp.com/attachments/661359204572987393/1112826303020798043/nochest.png")
          .setAuthor({ name: `${interaction.member.displayName}`, iconURL: interaction.member.displayAvatarURL() })
          .setDescription(`
          *Leider bist du nicht Besitzer eines solchen Exemplares. Du kannst jetzt folgene Dinge tun:*
          ∘ Weinen.. du bist zwar stark aber sowas belastet auch mich-
          ∘ Dir eine in Shop kaufen mit \`/shop\`
          ∘ Wieder weinen, dass Leben ist traurig-
          ∘ In die Lotterie gehen und dir Geld holen für eine Lootbox
          `)
          .setTimestamp();
        interaction.reply({ embeds: [nolb] })
        return;
      }

      const names = [];
      const contents = searchRes.contents;

      //extract lootbox
      for (let i = 0; i <= searchRes.contents.length - 1; i++) {
        let content = searchRes.contents[i];
        names.push(`∘ **${content.name}**`);
      }
      // check if inventory.contents already exists for user in db
      if (user.inventory["contents"]) {
        // if
        contents.forEach(async (e) => {
          await User.updateOne(
            { _id: interaction.member.id },
            { $push: { "inventory.contents": e } }
          );
        });
        await user.save();
      } else {
        await User.updateOne(
          { _id: interaction.member.id },
          { $set: { "inventory.contents": contents } }
        );
      }

      const timestamp = searchRes.timestamp;

      // remove lootbox from inventory.lootboxes with the help of the unique timestamp
      await User.updateOne(
        { _id: interaction.member.id },
        { $pull: { "inventory.lootboxes": { timestamp: timestamp } } }
      );

      let finalString = names.join("\n");

      var openEmbed = new EmbedBuilder()
        .setColor(ecolor.UPDATE)
        .setTitle("\`Du öffnest eine Lootbox\`")
        .setThumbnail("https://cdn.discordapp.com/attachments/661359204572987393/1112825638496243712/loot-gold.png")
        .setAuthor({ name: `${interaction.member.displayName}`, iconURL: interaction.member.displayAvatarURL() })
        .setDescription(`
        *Diese Items waren in der Lootbox:*\n \n${finalString}
        `)
        .setTimestamp();

        (`${finalString}`)

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
      listOfRarities.push(`∘ **${rarityCount}**x \`${currRarity}\``);
    }

    let finalString = listOfRarities.join("\n");

    if(finalString === "") {
      listOfRarities.push(`∘ Ich will nicht Lügen, aber du hast \`keine Lootboxen\``);
      finalString = listOfRarities.join("\n");
    }

    var listEmbed = new EmbedBuilder()
      .setColor(ecolor.ACCEPT)
      .setTitle("Lootbox Inventory")
      .setThumbnail("https://cdn.discordapp.com/attachments/661359204572987393/1112825774827917342/lootchest.png")
      .setAuthor({ name: `${interaction.member.displayName}`, iconURL: interaction.member.displayAvatarURL() })
      .setDescription(`
      *Deinen momentanes Inventar kannst du dir mit \`/inv\` angucken, um zu sehen welche Items du hast.. Hier siehst du aber deine **vorhandenen/gekauften Lootboxen**:*\n \n${finalString}
      `)
      .setTimestamp();

    interaction.reply({ embeds: [listEmbed], ephemeral: true });
  },
};
