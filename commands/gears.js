const { SlashCommandBuilder } = require("discord.js");
const mongoose = require("mongoose");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("gears")
    .setDescription("Erhalte Auskunft über deine aktuellen Gears"),
  async execute(interaction, client) {
    const User = mongoose.models.User;

    const user = await User.findOne(
      { _id: interaction.member.id },
      "name gears"
    );

    if (!user) {
      console.log('user not found');
      return;
    }
    console.log(user.gears);

    let output = [];

    for (const [key, value] of Object.entries(user.gears[0])) {
      // make first letter of the name upper case
      let name = key.split('');
      name[0] = name[0].toUpperCase();
      name = name.join('')

      output.push(`${name}: Level ${value.level}`);
    }

    interaction.reply(`Dies sind deine aktuellen Gears:
     ${output.join('\n')} `);
  },
};
