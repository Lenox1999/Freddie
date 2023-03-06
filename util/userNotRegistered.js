const {EmbedBuilder} = require('discord.js');

module.exports = (client) => {
  let errorEmbed = new EmbedBuilder()
    .setColor(Colors.Red)
    .setTitle("`ERROR: Account is missing..`")
    .setThumbnail(interaction.member.displayAvatarURL())
    .setDescription(
      `Du besitzt noch keinen Account.. Schreibe eine Nachricht um Coins zu erhalten!`
    );
  client.channels.cache.get('1074265742482100275').send({ embeds: [errorEmbed] });
};
