module.exports = (interaction, client) => {
  let errorEmbed = new EmbedBuilder()
    .setColor(Colors.Red)
    .setTitle("`Fehler`")
    .setThumbnail(oldState.member.displayAvatarURL())
    .setDescription(
      `
      Du bist noch nicht registriert!
      Schreibe eine Nachricht um dich zu registrieren.
      Danach kannst du deinen Command ausführen!
      `
    );
  interaction.reply({ embeds: [errorEmbed] });
};
