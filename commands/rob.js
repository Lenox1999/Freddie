// mit jedem Mal, dass jemand /rob benutzt ohne geschnappt zu werden, steigt die Wahrscheinlichkeit geschnappt zu werden
// ausgangswahrscheinlichkeit ist 1/2

const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const mongoose = require("mongoose");
const ecolor = require("../util/embedColors.json");
const { execute } = require("./inv");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rob")
    .setDescription("🠞 Rob: Steal something")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Wähle dein Opfer")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const victim = interaction.options.getUser("user");

    const robCoolDown = 24 * 60 * 60 * 1000;
    const defaultProtection = 12 * 60 * 60 * 1000;

    const User = mongoose.models.User;

    const user1 = await User.findOne(
      { _id: interaction.member.id },
      "coinAmmount rob"
    );

    // await User.updateMany(
    //   {},
    //   { $set: { rob: { lastRobbed: 0, protection: 0, robCount: 0 } } }
    // );

    const user2 = await User.findOne({ _id: victim.id }, "coinAmmount rob");

    let odds = Math.random() * 100;

    if (odds > 50) {
      interaction.reply(
        `Du wurdest geschnappt!`
      );
    } else if (odds < 50) {
      interaction.reply('Du wurdest nicht geschnappt');
    }

    return;
  },
};
