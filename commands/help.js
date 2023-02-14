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
    .setDescription("Credits und Commands"),

  async execute(interaction, client) {
    var startembed = new EmbedBuilder()
      .setAuthor({
        name: interaction.member.displayName,
        iconURL: interaction.member.displayAvatarURL(),
      })
      .setTitle("HELP")
      .setDescription(`
        *So kann man unseren Bot beschreiben: Ein globales System um Items zu sammeln, reich zu werden, Freunde ausrauben oder halt Glückspiel zu betreiben und noch vieles mehr.*


        **Das Ziel ist es den vorhandenen Server attraktiv zu machen und User zu Unterhalten.**

        __Inklusive Features:__
        › Geld- und Levelsystem
        › Wechselkurse
        › Shopsystem
        › Top 10 Listen
        › und noch vieles mehr...

        Wir sind ein Team aus 2 Mitgliedern, die nach und nach an diesen Bot arbeiten. Es sind viele Ideen und Features geplant. Dazu haben wir eine Reihe an Features schon bereit gestellt. Wir würden uns sehr über dein Feedback freuen und bei Fehlern und sonstigen Bugs gerne von euch hören!

        Discord-Server: https://discord.gg/26xxXbcxfr
        Team-Discord-Tags: Lenox#9196 und EinfachDavide#5883
    `);

    var firstCommands = new EmbedBuilder()
      .setAuthor({
        name: interaction.member.displayName,
        iconURL: interaction.member.displayAvatarURL(),
      })
      .setTitle("Erste 10 Commands")
      .setTitle("Commandliste")
      .setDescription(`
      **/help** ▸ *Da bist du gerade*
      **/bal** ▸ *Infos über Burger, Streak, aktive Multiplier, Fähigkeiten*
      **/daily** ▸ *Infos über Daily Reward*
      **/level** ▸ *Infos über Level*
      **/top10 (bal/lvl)** ▸ *Zum einen: XP-Top10 und Geld Top10*
      **/sell** ▸ *Alle Burger verkaufen um Geld bekommen*
      **/spin** ▸ *Spin starten*
      **/slots** ▸ *Slots starten*
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
