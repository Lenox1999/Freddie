const {
  SlashCommandBuilder,
  EmbedBuilder,
  Colors,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ComponentType,
} = require("discord.js");

const ecolor = require("../util/embedColors.json")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("🠞 Freddie: Credits + Commands + Coming Soon"),

  async execute(interaction, client) {
    var startembed = new EmbedBuilder()
      .setColor(ecolor.TEXT)
      .setAuthor({
        name: interaction.member.displayName,
        iconURL: interaction.member.displayAvatarURL(),
      })
      .setTitle("HELP")
      .setDescription(`
        *So kann man unseren Bot beschreiben: Ein globales Economy System um Items zu sammeln, reich zu werden, Freunde ausrauben oder halt Glückspiel zu betreiben und noch vieles mehr.*


        **Das Ziel ist es den vorhandenen Server attraktiv zu machen und User zu Unterhalten.**

        __Inklusive Features:__
        › Coin- und Levelsystem
        › Wechselkurse
        › Shopsystem
        › Top 10 Listen
        › Items sammeln
        › und noch vieles mehr...

        Wir sind ein Team aus 2 Mitgliedern, die nach und nach an diesen Bot arbeiten. Es sind viele Ideen und Features geplant. Dazu haben wir eine Reihe an Features schon bereit gestellt. Wir würden uns sehr über dein Feedback freuen und bei Fehlern und sonstigen Bugs gerne von euch hören!

        Bot Creators: Lenox#9196 und EinfachDavide#5883
        GitHub: [PLACEHOLDER]
        Discord-Server: https://discord.gg/26xxXbcxfr
      `)
      .setFields([
        {
          name: `Moderation`,
          value: `
          \`help\`
          `,
          inline: false
        },
        {
          name: `Economy`,
          value: `
          \`bal\`, \`daily\`, \`rank\`, \`top10\`, \`sell\`, \`spin\`, \`slots\`, \`gears\`, \`monkeys\`, \`exch\`, \`shop\`, \`inv\`, \`use\`, \`open\`
          `,
          inline: false
        },
        {
          name: `Coming Soon`,
          value: `
          \`rob\`, \`event\`, \`stocks\`, \`(Moderation Commands!)\`
          `,
          inline: false
        }
      ])

    var firstCommands = new EmbedBuilder()
      .setColor(ecolor.TEXT)
      .setAuthor({
        name: interaction.member.displayName,
        iconURL: interaction.member.displayAvatarURL(),
      })
      .setTitle("\`Commandliste #1\`")
      .setDescription(`
      **/help** ▸ *Da bist du gerade*
      **/bal** ▸ *Infos über Burger, Streak, aktive Multiplier, Fähigkeiten*
      **/daily** ▸ *Infos über Daily Reward*
      **/rank** ▸ *Infos über Level*
      **/top10 (bal/lvl)** ▸ *Zum einen: XP-Top10 und Geld Top10*
      **/sell** ▸ *Alle Bananen verkaufen um Coins bekommen*
      **/spin** ▸ *Spin starten*
      **/slots** ▸ *Slots starten*
      **/gears** ▸ *Zeigt das Level und Effektivität der Ausrüstung*
      `);

    var secondCommands = new EmbedBuilder()
      .setColor(ecolor.TEXT)
      .setAuthor({
        name: interaction.member.displayName,
        iconURL: interaction.member.displayAvatarURL(),
      })
      .setTitle("\`Commandliste #2\`")
      .setDescription(`
      **/monkeys** ▸ *Jede 4h sind deine Affen für mit Bananen wieder da*
      **/exch** ▸ *Sehe den aktuellen Wechselkurs*
      **/shop** ▸ *Kaufe Gearupgrades, Multiplier oder Lootboxen*
      **/inv** ▸ *Sehe deine Items*
      **/use** ▸ *Benutze ein Item*
      **/open** ▸ *Öffne deine Lootbox*
      `);

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("startseite")
        .setLabel("Startseite")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("com1")
        .setLabel("Commands #1")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("com2")
        .setLabel("Commands #2")
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

      if (id === "com2") {
        BI.deferUpdate();
        interaction.editReply({ embeds: [secondCommands] });
      }
    });

    collector.on("end", async () => {
      var helptimeout = new EmbedBuilder()
        .setColor(ecolor.DENY)
        .setAuthor({ name: `${interaction.member.displayName}`, iconURL: interaction.member.displayAvatarURL() })
        .setThumbnail("https://cdn.discordapp.com/attachments/661359204572987393/1112473801054236842/fail.png")
        .setTitle("\`ERROR: Helping closed..\`")
        .setTimestamp();

      interaction.editReply({ components: [], embeds: [helptimeout] });
      return;
    });
  },
};
