const { SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js")
const mongoose = require("mongoose");

module.exports = {
    data: new SlashCommandBuilder()
      .setName("slots")
      .setDescription("Slots starten")
      .addNumberOption(option =>
        option.setName("einsatz")
            .setDescription("10-500?")
            .setRequired(true)
            .setMaxValue(500)
            .setMinValue(10)
        ),
    async execute(interaction, client) {
        const User = mongoose.models.User;

        const user = await User.findOne(
            { _id: interaction.member.id },
            "coinAmmount"
          );
          if (!user) {
            let errorEmbed = new EmbedBuilder()
              .setColor(Colors.Red)
              .setTitle("\`Fehler\`")
              .setThumbnail(interaction.member.displayAvatarURL())
              .setDescription(
                `
                Du bist noch nicht registriert!
                Schreibe eine Nachricht um dich zu registrieren.
                Danach kannst du deinen Command ausführen!
                `
              )
              interaction.reply({embeds: [errorEmbed]});
              return;
          }
        
        if(user.coinAmmount < interaction.options.getNumber("einsatz")) {
            var failmoney = new EmbedBuilder()
                .setColor(Colors.Red)
                .setTitle("\`Zu wenig Coins\`")
                .setDescription("*Du kannst z.B. **Nachrichten schreiben**, um Coins zu bekommen..*")
            interaction.reply({ embeds: [failmoney], ephemeral: true })
            return;
        }

        user.coinAmmount -= interaction.options.getNumber("einsatz");
        user.save();

        let slots = ["🍇", "🍊", "🍋", "🍌", "🍒", "🍐"];
        let result1 = Math.floor(Math.random() * slots.length);
        let result2 = Math.floor(Math.random() * slots.length);
        let result3 = Math.floor(Math.random() * slots.length);

        var sm1 = new EmbedBuilder()
            .setColor(Colors.DarkOrange)
            .setTitle("🎰 SLOT MASCHINE 🎰")
            .setDescription(`
            Loading.
            ⚪️ | ⚪️ | ⚪️
        `)
        var sm2 = new EmbedBuilder()
            .setColor(Colors.Blue)
            .setTitle("🎰 SLOT MASCHINE 🎰")
            .setDescription(`
            ${slots[result1]} | ⚪️ | ⚪️
        `)
        var sm3 = new EmbedBuilder()
        .setColor(Colors.Fuchsia)
            .setTitle("🎰 SLOT MASCHINE 🎰")
            .setDescription(`
            ${slots[result1]} | ${slots[result2]} | ⚪️
        `)
        var sm = new EmbedBuilder()
            .setColor(Colors.Gold)
            .setTitle("🎰 SLOT MASCHINE 🎰")
            .setAuthor({ name: interaction.member.displayName })
            .setDescription(`
            ${slots[result1]} | ${slots[result2]} | ${slots[result3]}
        `)

        interaction.reply({embeds: [sm1], components: [], ephemeral: true})
        setTimeout(() => {
            interaction.editReply({embeds: [sm2], ephemeral: true})
        }, 1000)
        setTimeout(() => {
            interaction.editReply({embeds: [sm3], ephemeral: true})
        }, 2000)
        setTimeout(() => {
            var win = new EmbedBuilder()
                .setColor(Colors.Green)
                .setTitle("WIN")
            var prize = Math.floor(interaction.options.getNumber("einsatz") * 2)
            if(slots[result1] === slots[result2] && slots[result1] === slots[result3]) {
                sm.addFields([{
                    name: "WIN",
                    value: `Du bekommst ${prize} ${client.emojis.cache.find(emoji => emoji.name === "coins")}`,
                    inline: false
                }])

                user.coinAmmount += prize;
                user.save();

                interaction.editReply({embeds: [win], ephemeral: true })
                interaction.followUp({ embeds: [sm] , ephemeral: false })
            } else if(slots[result1] === slots[result2] || slots[result1] === slots[result3] || slots[result2] === slots[result3]) {
                sm.addFields([{
                    name: "NOTHING HAPPENS",
                    value: `Du bekommst ${interaction.options.getNumber("einsatz")} ${client.emojis.cache.find(emoji => emoji.name === "coins")} wieder!`,
                    inline: false
                }])

                user.coinAmmount += interaction.options.getNumber("einsatz");
                user.save();

                interaction.editReply({embeds: [win], ephemeral: true })
                interaction.followUp({ embeds: [sm] , ephemeral: false })
            } else {
                sm.addFields([{
                    name: "LOSE",
                    value: "Du verlierst nur deine Spielkosten",
                    inline: false
                }])
                interaction.editReply({embeds: [sm], ephemeral: true})
            }
        }, 3000)
    }
}