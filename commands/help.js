const {
  SlashCommandBuilder,
  EmbedBuilder,
  Colors,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ComponentType,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Grundlegende Infos und alle Commands"),

  async execute(interaction, client) {
    var startembed = new EmbedBuilder()
      .setAuthor({name: interaction.member.displayName, iconURL: interaction.member.displayAvatarURL()})
      .setTitle("HELP").setDescription(`
        **Eco Bot** von David und Niklas *für Hilfe bitte DM*!
        › Erstellt am 13.02.2023
        › Geld- und Levelsystem
        › Dient zur Unterhaltung
    `);

    var firstCommands = new EmbedBuilder()
      .setAuthor({name: interaction.member.displayName, iconURL: interaction.member.displayAvatarURL()})
      .setTitle("Erste 10 Commands")
      .setTitle("Commandliste").setDescription(`
      **/help** ▸ *Du bist gerade hier*
      **/bal** ▸ *Infos über Burger, Streak, aktive Multiplier, Fähigkeiten*
      **/daily** ▸ *Infos über Daily Reward*
      **/level** ▸ *Infos über Level*
      **/top10 (bal/lvl)** ▸ *zum einen: XP-Top10 und Geld Top10*
      **/sell** ▸ *alle Burger verkaufen und Geld bekommen*
      **/spin** ▸ *spin lotterie starten*
      **/slots** ▸ *slots lotterie starten*
      `);

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("startseite")
        .setLabel("Startseite")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("com1")
        .setLabel("Commands #1")
        .setStyle(ButtonStyle.Primary)
    );

    const msg = await interaction.reply({
      embeds: [startembed],
      components: [buttons],
      fetchReply: true,
      ephemeral: true,
    });

    var collector = msg.createMessageComponentCollector({
      ComponentType: ComponentType.Button,
      time: 300000,
    });

    collector.on("collect", async (BI) => {
      const id = BI.customId;

      if (id === "startseite") {
        BI.deferUpdate();
        interaction.editReply({ embeds: [startembed] });
      }

      if (id === "com1") {
        BI.deferUpdate();
        interaction.editReply({ embeds: [firstCommands] });
      }
    });

    collector.on("end", async () => {
      var helptimeout = new EmbedBuilder()
        .setColor(Colors.Red)
        .setTitle("Diese Hilfeanzeige ist geschlossen.")
        .setTimestamp();

      interaction.editReply({ components: [], embeds: [helptimeout] });
      return;
    });
  },
};
