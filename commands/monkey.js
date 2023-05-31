const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const mongoose = require("mongoose");
const ecolor = require("../util/embedColors.json")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("monkeys")
    .setDescription("🠞 4h-Event: Every 4h you can looking what the monkeys bring you.. wtf"),
  async execute(interaction, client) {
    const User = mongoose.models.User;
    const user = await User.findOne({ _id: interaction.member.id });

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

      let nmtext = [
        `Ich sehe nicht das deine Affen wieder da sind, aber ich habe sie in der Weiter erspäht.. Ich denke sie kommen in so **${durationMsg}** wieder!`,
        `Ich habe gedacht sie sind wieder da- Naja was solls ich schätze sie brauchen so lange wie das letzte mal also noch ca. **${durationMsg}**..`,
        `Dadurch das sie nicht hier sind, denke ich das sie im fernen Osten sind.. Ach ne da waren ja Lenox seine schon alles looten, dann eher im Nachbardorf- Let me see, dass dauer etwa noch **${durationMsg}**.`,
        `Achso bist du **${interaction.member.displayName}** gut das ich dir hier sehe, deine Affen haben Moneypolis ausgeraubt und alle Bananen von Davids Bananenplantagen genommen- Das wird viel Ärger, aber sie sind in **${durationMsg}** wieder back.`,
        `Guck mal Richtung Westen, siehst du sie.. Ich sehe sie gerade auch nicht, aber du hast doch ein Peilsender! Da steht noch 22,34km also dauert das bis hier her noch etwa **${durationMsg}**... Damn-`
      ]

      var falsebananaembed = new EmbedBuilder()
        .setColor(ecolor.DENY)
        .setAuthor({ name: `${interaction.member.displayName}`, iconURL: interaction.member.displayAvatarURL() })
        .setTitle("\`No monkeys here..\`")
        .setThumbnail("https://cdn.discordapp.com/attachments/661359204572987393/1112818714895732796/nomonkey.png")
        .setDescription(`*${nmtext[Math.floor(Math.random() * nmtext.length)]}*`)
        .setTimestamp();
      interaction.reply({ embeds: [falsebananaembed], ephemeral: true  });
    } else if (sinceLastTriggered > 4 || lastMonkeycomes === 0) {
      let defaultitem = ["einen Ast", "einer Zeitung", "einen gammligen Schuh", "einen Affen weniger", "einer Dose"];
      let rareitem = ["eine Bananenstaude", "einen Bananenbaum", "einen Rucksack mit Bananen"];
      let epicitem = ["geben dir eine goldene Banane", "zeigen dir einen Bananentempel mit Bananen"]
      
      let randomNumber = Math.floor(Math.random() * 100);
 
      if(randomNumber <= 50) {
        let randomitemd = Math.floor(Math.random() * defaultitem.length);
        var defaultbananaembed = new EmbedBuilder()
          .setColor(ecolor.DEFAULT)
          .setTitle("\`Looting some shit..\`")
          .setThumbnail("https://cdn.discordapp.com/attachments/661359204572987393/1112818714560167956/monkeyshit.png")
          .setAuthor({ name: `${interaction.member.displayName}`, iconURL: interaction.member.displayAvatarURL() })
          .setDescription(`Leider kamen sie nur mit **${defaultitem[randomitemd]}** wieder. \n*Du schickst die Affen weg und kannst in ${user.gears.moremonkeys.time}h wiederkommen!*`)
          .setTimestamp();
        interaction.reply({ embeds: [defaultbananaembed] })
      } else if(randomNumber <= 99) {
        let randomitemr = Math.floor(Math.random() * rareitem.length);
        var rarebananaembed = new EmbedBuilder()
          .setColor(ecolor.RARE)
          .setTitle("\`Looting some basic stuff..\`")
          .setThumbnail("https://cdn.discordapp.com/attachments/661359204572987393/1112818714241421333/monkeybanana.png")
          .setAuthor({ name: `${interaction.member.displayName}`, iconURL: interaction.member.displayAvatarURL() })
          .setDescription(`Die Affen haben dir **${rareitem[randomitemr]}** mitgebracht, dass entspricht **10** 🍌. \n*Du schickst die Affen weg und kannst in ${user.gears.moremonkeys.time}h wiederkommen!*`)
          .setTimestamp();
          interaction.reply({ embeds: [rarebananaembed] })
        user.bananaAmmount += 10;
      } else if(randomNumber == 100) {
        let randomitems = Math.floor(Math.random() * epicitem.length);
        var epicbananaembed = new EmbedBuilder()
          .setColor(ecolor.EPIC)
          .setTitle("\`Looting very big bananananas..\`")
          .setThumbnail("https://cdn.discordapp.com/attachments/661359204572987393/1112818713847136286/Look_at_this.png")
          .setAuthor({ name: `${interaction.member.displayName}`, iconURL: interaction.member.displayAvatarURL() })
          .setDescription(`GLÜCKWUNSCH! Die Affen **${epicitem[randomitems]}**, im Wert von **100** 🍌. \n*Du schickst die Affen weg und kannst in ${user.gears.moremonkeys.time}h wiederkommen!*`)
          .setTimestamp();
          interaction.reply({ embeds: [epicbananaembed] })
        user.bananaAmmount += 100;
      }
      user.lastMonkeys = Date.now();
      user.save();
    }
  },
};
