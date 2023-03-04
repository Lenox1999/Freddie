module.exports = (interaction, client) => {
  let errorEmbed = new EmbedBuilder()
    .setColor(Colors.Red)
    .setTitle("\`ERROR: Account is missing..\`")
    .setThumbnail(interaction.member.displayAvatarURL())
    .setDescription(`Du besitzt noch keinen Account.. Schreibe eine Nachricht um Coins zu erhalten!`)
  interaction.reply({ embeds: [errorEmbed], ephemeral: true });
};
