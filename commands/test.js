const { SlashCommandBuilder, Colors, EmbedBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("top10")
        .setDescription("Top10 von Gold, insgesamten Nachrichten oder Medaillien-Pokal-Punkte 🏁")
        .addStringOption(option =>
            option.setName("art")
            .setDescription("Gold, insgesamte Nachrichten oder Medaillien-Pokal-Punkte?")
            .addChoices(
                { name: "Gold", value: "vgold" },
                { name: "Insgesamte Nachrichten", value: "vin" },
                { name: "Medaillien-Pokal-Punkte", value: "vmpp" }
            )
            .setRequired(true)),

    async execute(interaction, client) {
        var embed = new EmbedBuilder()
            .setColor(Colors.Fuchsia)
            .setTitle("\`Test\`")
            .setTimestamp()
            .setAuthor({ name: interaction.member.displayName, iconURL: interaction.member.displayAvatarURL() })
            .setDescription("Bitte klappe..")

        interaction.reply({ embeds: [embed], ephemeral: true })
    }
}