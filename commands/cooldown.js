const { SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");
const mongoose = require("mongoose");
const userNotRegistered = require('../util/userNotRegistered');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("cooldown")
    .setDescription("🠞 Cooldowns: For VC, Message and Fish per Message/VC-Time"),
    
  async execute(interaction, client) {
    const User = mongoose.models.User;

    const user = await User.findOne(
      { _id: interaction.member.id },
      "name gears"
    );

    if (!user) {
        userNotRegistered(interaction, client);
    }

    let outputname = [];
    let outputmultiplier = [];
    let outputcooldown = [];

    // objectstructure of user: user -> gears -> "0" -> item (-> level/cooldown/multiplier)

    for (const [key, value] of Object.entries(user.gears[0])) {
      // make first letter of the name upper case
      let name = key.split('');
      name[0] = name[0].toUpperCase();
      name = name.join('')

      outputname.push(`\`${name}\``);
      outputcooldown.push(`**${value.cooldown}**`)
      outputmultiplier.push(`**${value.multiplier}**`)
    }

    let cooldownembed = new EmbedBuilder()
        .setColor(Colors.Blue)
        .setTitle(`Cooldowns: \`${interaction.member.displayName}\``)
        .setThumbnail(interaction.member.displayAvatarURL())
        .setDescription("*Mit \`/gears\` siehst du deine Fischerausrüstung + Level + Fähigkeiten und \`/shop\` kannst du dein Equipment aufwerten!*")
        .setFields([
            {
                name:`${outputname[0]}`,
                value:`Du bekommst ${outputmultiplier[0]} 🐟 pro Nachricht.`,
                inline: true
            },
            {
                name:`${outputname[1]}`,
                value:`Du bekommst ${outputmultiplier[1]} 🐟 pro Voice-Time.`,
                inline: true
            },
            {
                name:`${outputname[2]}`,
                value:`Die Fische pro Nachricht bekommst du mit ein Cooldown von ${outputcooldown[2]} Sekunden!`,
                inline: true
            },
            {
                name:`${outputname[3]}`,
                value:`Die Fische pro Voice-Time bekommst du mit ein Cooldown von ${outputcooldown[3]} Sekunden!`,
                inline: true
            },
        ])
    interaction.reply({ embeds: [cooldownembed] })
    }
};
