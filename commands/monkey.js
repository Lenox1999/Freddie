const { SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");
const mongoose = require("mongoose");

const userNotRegistered = require('../util/userNotRegistered');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("monkeys")
    .setDescription("🠞 4h-Event: Every 4h you can looking what the monkeys bring you.. wtf"),
  async execute(interaction, client) {
    const User = mongoose.models.User;
    const user = await User.findOne({ _id: interaction.member.id });

    if (!user) {
      userNotRegistered(interaction, client);
    }

    let bananamm = user.gears.moremonkeys.time
    const bananawaiting = bananamm * 60 * 60 * 1000;

    let lastMonkeycomes;

    const sinceLastTriggered = (Date.now() - user.lastMonkeys) / 1000 / 60;

    if (sinceLastTriggered < 4) {
      let duration = user.lastMonkeys + bananawaiting - Date.now();
      let seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

      hours = hours < 10 ? "0" + hours : hours;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      let durationMsg = hours + "h " + minutes + "min " + seconds + "s";

      var falsebananaembed = new EmbedBuilder()
        .setColor(Colors.Red)
        .setTitle("\`No monkeys here..\`")
        .setThumbnail(interaction.member.displayAvatarURL())
        .setDescription(`*Da noch keine 4h vorbei sind musst du noch ${durationMsg} auf die Beute  warten!*`)
      interaction.reply({ embeds: [falsebananaembed], ephemeral: true  });
    } else if (sinceLastTriggered > 4 || lastMonkeycomes === 0) {
      let defaultitem = ["einen Ast", "einer Zeitung", "einen gammligen Schuh", "einen Affen weniger", "einer Dose"];
      let rareitem = ["eine Bananenstaude", "einen Bananenbaum", "einen Rucksack mit Bananen"];
      let epicitem = ["geben dir eine goldene Banane", "zeigen dir einen Bananentempel mit Bananen"]
      
      let randomNumber = Math.floor(Math.random() * 100);
 
      if(randomNumber <= 50) {
        let randomitemd = Math.floor(Math.random() * defaultitem.length);
        var defaultbananaembed = new EmbedBuilder()
          .setColor(Colors.Gold)
          .setTitle("\`Looting some shit..\`")
          .setThumbnail(interaction.member.displayAvatarURL())
          .setDescription(`Leider kamen sie nur mit **${defaultitem[randomitemd]}** wieder. \n*Du schickst die Affen weg und kannst in ${user.gears.moremonkeys.time}h wiederkommen!*`)
        interaction.reply({ embeds: [defaultbananaembed] })
      } else if(randomNumber <= 99) {
        let randomitemr = Math.floor(Math.random() * rareitem.length);
        var rarebananaembed = new EmbedBuilder()
          .setColor(Colors.Gold)
          .setTitle("\`Looting some basic stuff..\`")
          .setThumbnail(interaction.member.displayAvatarURL())
          .setDescription(`Die Affen haben dir **${rareitem[randomitemr]}** mitgebracht, dass entspricht **10** 🍌. \n*Du schickst die Affen weg und kannst in ${user.gears.moremonkeys.time}h wiederkommen!*`)
        interaction.reply({ embeds: [rarebananaembed] })
        user.bananaAmmount += 10;
      } else if(randomNumber == 100) {
        let randomiteme = Math.floor(Math.random() * epicitem.length);
        var epicbananaembed = new EmbedBuilder()
          .setColor(Colors.Gold)
          .setTitle("\`Looting very big bananananas..\`")
          .setThumbnail(interaction.member.displayAvatarURL())
          .setDescription(`GLÜCKWUNSCH! Die Affen **${epicitem[randomiteme]}**, im Wert von **100** 🍌. \n*Du schickst die Affen weg und kannst in ${user.gears.moremonkeys.time}h wiederkommen!*`)
        interaction.reply({ embeds: [epicbananaembed] })
        user.bananaAmmount += 100;
      }
      user.lastMonkeys = Date.now();
      user.save();
    }
  },
};
