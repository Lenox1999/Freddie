const { SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");
const mongoose = require("mongoose");
const userNotRegistered = require('../util/userNotRegistered');

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

    if (!user) {
        userNotRegistered(interaction, client);
    }

    let gearsembed = new EmbedBuilder()
        .setColor(Colors.Blue)
        .setTitle(`Gears: \`${interaction.member.displayName}\``)
        .setThumbnail(interaction.member.displayAvatarURL())
        .setDescription("*Mit \`/shop\` kannst du diese Tools upgraden.*")
        .setFields([
            {
                name:`Plantage Lvl \`${user.gears.plantation.level}\``,
                value:`Die Chance auf\n1🍌 = **${user.gears.plantation.onebanana}**%\n2🍌 = **${user.gears.plantation.twobanana}**%\n3🍌 = **${user.gears.plantation.threebanana}**%.`,
                inline: true
            },
            {
                name:`Dünger Lvl \`${user.gears.fertilizer.level}\``,
                value:`Der Cooldown von Nachrichten **${user.gears.fertilizer.cooldownmsg}**sec\nVC-Zeit **${user.gears.fertilizer.cooldownvc}**sec`,
                inline: true
            },
            {
                name:`Affenbande Lvl \`${user.gears.moremonkeys.level}\``,
                value:`Die Zeit beträgt gerade **${user.gears.moremonkeys.time}**h bis deine Affen wieder da sind.`,
                inline: true
            },
        ])
    interaction.reply({ embeds: [gearsembed] })
    },
};
