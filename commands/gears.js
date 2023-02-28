const { SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");
const mongoose = require("mongoose");
const userNotRegistered = require('../util/userNotRegistered');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("gears")
    .setDescription("🠞 Fishing equipment: rod, bait, knife, bucket"),
  async execute(interaction, client) {
    const User = mongoose.models.User;

    const user = await User.findOne(
      { _id: interaction.member.id },
      "name gears"
    );

    if (!user) {
        userNotRegistered(interaction, client);
    }

    let output = [];

    for (const [key, value] of Object.entries(user.gears[0])) {
      // make first letter of the name upper case
      let name = key.split('');
      name[0] = name[0].toUpperCase();
      name = name.join('')

      output.push(`${name}・Level \`${value.level}\``);
    }

    let gearsembed = new EmbedBuilder()
        .setColor(Colors.Blue)
        .setTitle(`Gears: \`${interaction.member.displayName}\``)
        .setThumbnail(interaction.member.displayAvatarURL())
        .setDescription("*Mit \`/cooldown\` siehst du deine aktuellen Cooldowns und Fische pro Nachricht bzw. pro Voice-Time und \`/shop\` kannst du dein Equipment aufwerten!*")
        .setFields([
            {
                name:`${output[0]}`,
                value:`Die Angel kann deine Fische pro Nachricht verbessern.`,
                inline: true
            },
            {
                name:`${output[1]}`,
                value:`Der Köder verbessert die Fische pro Voice-Time im Channel.`,
                inline: true
            },
            {
                name:`${output[2]}`,
                value:`Das Messer verkürzt den Cooldown zwischen geschriebenen Nachrichten.`,
                inline: true
            },
            {
                name:`${output[3]}`,
                value:`Der Eimer verkürzt den Cooldown der Fische die man bekommt pro Voice-Time.`,
                inline: true
            },
        ])
    interaction.reply({ embeds: [gearsembed] })
    },
};
