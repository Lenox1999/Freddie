const { SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js")
const mongoose = require("mongoose");

module.exports = {
    data: new SlashCommandBuilder()
      .setName("spin")
      .setDescription("🠞 Lottery: Play Spin to double your Coins")
      .addNumberOption(option =>
        option.setName("einsatz")
            .setDescription("10-500?")
            .setRequired(true)
            .setMaxValue(500)
            .setMinValue(10)
        )
        .addStringOption(option => 
            option.setName("wähle")
            .setDescription("Welche Frucht wählst du?")
            .addChoices(
                { name: "🍐", value: "🍐" },
                { name: "🍊", value: "🍊" },
                { name: "🍋", value: "🍋" },
                { name: "🍌", value: "🍌" },
                { name: "🍇", value: "🍇" },
                { name: "🍓", value: "🍓" },
                { name: "🍍", value: "🍍" },
                { name: "🍒", value: "🍒" }
            )
            .setRequired(true)
        ),
    async execute(interaction, client) {
        const User = mongoose.models.User;

        const user = await User.findOne(
            { _id: interaction.member.id },
            "coinAmmount"
          );
            // Is User in DB?
            if (!user) {
                var no = new EmbedBuilder()
                .setColor(Colors.Red)
                .setTitle("\`ERROR: Account is missing..\`")
                .setThumbnail(interaction.member.displayAvatarURL())
                .setDescription(`Du besitzt noch keine Coins oder Fische.. Schreibe eine Nachricht um Coins zu erhalten!`)
                interaction.reply({ embeds: [no], ephemeral: true });
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

        let slots = ["🍐","🍊","🍋","🍌","🍇","🍓","🍍","🍒"];
        let result1 = Math.floor(Math.random() * slots.length);

        var sm1 = new EmbedBuilder()
            .setColor(Colors.DarkOrange)
            .setTitle("🎰 SPINNNNER 🎰")
            .setDescription("🍐")
        var sm2 = new EmbedBuilder()
            .setColor(Colors.DarkOrange)
            .setTitle("🎰 SPINNNNER 🎰")
            .setDescription("🍌")
        var sm3 = new EmbedBuilder()
            .setColor(Colors.DarkOrange)
            .setTitle("🎰 SPINNNNER 🎰")
            .setDescription("🥝")
        var sm = new EmbedBuilder()
            .setColor(Colors.Gold)
            .setTitle("🎰 SPINNNNER 🎰")
            .setAuthor({ name: interaction.member.displayName })
            .setDescription(`${slots[result1]}`)

        interaction.reply({ embeds: [sm1], ephemeral:true })

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
            var prize = Math.floor(interaction.options.getNumber("einsatz") / 2) + interaction.options.getNumber("einsatz")
            if(slots[result1] === interaction.options.getString("wähle")) {
                sm.addFields([{
                    name: "WIN",
                    value: `Du bekommst ${prize} ${client.emojis.cache.find(emoji => emoji.name === "coins")}`,
                    inline: false
                }])
                
                user.coinAmmount += prize;
                user.save();

                interaction.editReply({ embeds: [win]})
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