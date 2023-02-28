module.exports = (interaction, client) => {
  let errorEmbed = new EmbedBuilder()
    .setColor(Colors.Red)
    .setTitle("\`ERROR: Account is missing..\`")
    .setThumbnail(interaction.member.displayAvatarURL())
    .setDescription(`Du besitzt noch keine Coins oder Fische.. Schreibe eine Nachricht um Coins zu erhalten!`)
  interaction.reply({ embeds: [errorEmbed] });
};
