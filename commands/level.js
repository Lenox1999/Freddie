const { SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");
const mongoose = require("mongoose");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("level")
    .setDescription("Erhalte Auskunft über dein derzeitiges Level"),
  async execute(interaction, client) {
    const User = mongoose.models.User;
    if (!User) {
      console.log("DB ERROR!");
      return;
    }
    User.findOne({ _id: interaction.member.id })
      .select("XP")
      .exec((err, user) => {
        if (err) {
          console.log(err);
          return;
        }
        interaction.reply(`Du hast derzeit ${user.XP.toString()} XP!`);
      });
  },
};
