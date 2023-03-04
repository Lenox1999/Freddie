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

    let output = []
    let outputplantation = [];
    let outputfertilizer = [];
    let outputmoremonkeys = [];

    for (const [key, value] of Object.entries(user.gears)) {
      let name = key.split('');
      name[0] = name[0].toUpperCase();
      name = name.join('')

      output.push(`${name}`);
      outputplantation.push(`${value.level}`, `${value.onebanana}`,  `${value.twobanana}`,  `${value.threebanana}`)
      outputfertilizer.push(`${value.level}`, `${value.cooldownmsg}`, `${value.cooldownvc}`)
      outputmoremonkeys.push(`${value.level}`, `${value.time}`)
    }

    let gearsembed = new EmbedBuilder()
        .setColor(Colors.Blue)
        .setTitle(`Gears: \`${interaction.member.displayName}\``)
        .setThumbnail(interaction.member.displayAvatarURL())
        .setDescription("*Mit \`/shop\` kannst du diese Tools upgraden.*")
        .setFields([
            {
                name:`Plantage **Lvl \`${outputplantation[0]}\``,
                value:`Die Chance auf 1🍌 = **${outputplantation[1]}**%, auf 2🍌 = **${outputplantation[2]}**% und auf 3🍌 = **${outputplantation[3]}**%.`,
                inline: true
            },
            {
                name:`Dünger **Lvl \`${outputfertilizer[0]}\``,
                value:`Der Cooldown von Nachrichten **${outputfertilizer[1]}** Sekunden und Cooldown von VC-Zeit **${outputfertilizer[2]}** Sekunden.`,
                inline: true
            },
            {
                name:`Affenbande **Lvl \`${outputmoremonkeys[0]}\``,
                value:`Die Zeit beträgt gerade **${outputmoremonkeys[1]}**h bis deine Affen wieder da sind.`,
                inline: true
            },
        ])
    interaction.reply({ embeds: [gearsembed] })
    },
};
