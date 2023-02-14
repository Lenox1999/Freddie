const { SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");
const mongoose = require("mongoose");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bal")
    .setDescription("Erfahre alles über deinen derzeitigen KontoStand"),

  async execute(interaction, client) {
    const User = mongoose.models.User;
    User.findOne({ _id: interaction.member.id })
      .select("coinAmmount")
      .exec((err, user) => {
        if (err) {
          console.log(err);
          return;
        }
        let ballance = user.coinAmmount.toString()
        interaction.reply(`Dein derzeitiger Kontostand beträgt ${ballance} Coins!`);
      });
  },
};
