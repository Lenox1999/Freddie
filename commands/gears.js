const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const mongoose = require("mongoose");
const ecolor = require("../util/embedColors.json")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("gears")
    .setDescription("🠞 Equipment: plantation, fertilizer and moremonkeys"),
  async execute(interaction, client) {
    const User = mongoose.models.User;

    const user = await User.findOne(
      { _id: interaction.member.id },
      "name gears"
    );

    let gearsembed = new EmbedBuilder()
        .setColor(ecolor.TEXT)
        .setAuthor({ name: `${interaction.member.displayName}`, iconURL: interaction.member.displayAvatarURL() })
        .setTitle(`Gears`)
        .setThumbnail(interaction.member.displayAvatarURL())
        .setDescription(`
        ∘ Plantage | Level \`${user.gears.plantation.level}\`
        ⠀∘ Chance auf Bananen bei Voice Time/Message
        ⠀⠀→ 1🍌 zu **${user.gears.plantation.onebanana}**%
        ⠀⠀→ 2🍌 zu **${user.gears.plantation.twobanana}**%
        ⠀⠀→ 3🍌 zu **${user.gears.plantation.threebanana}**%

        ∘ Dünger | Level \`${user.gears.fertilizer.level}\`
        ⠀∘ Cooldown zwischen Chance auf Bananen
        ⠀⠀→ Messages jede **${user.gears.fertilizer.cooldownmsg}**sec
        ⠀⠀→ Voice Time jede **${user.gears.fertilizer.cooldownvc}**sec

        ∘ Affenbande | Level \`${user.gears.moremonkeys.level}\`
        ⠀→ Zeit bis deine Affen wieder da sind: **${user.gears.moremonkeys.time}**h
        `)
        .setFields([
            {
                name: "Info",
                value:`*Mit \`/shop\` kannst du diese Tools upgraden.*`,
                inline: true
            },
        ])
        .setTimestamp();
    interaction.reply({ embeds: [gearsembed] })
    },
};
