const {EmbedBuilder, Colors} = require('discord.js');

module.exports = (client) => {
  let errorEmbed = new EmbedBuilder()
    .setColor(Colors.Red)
    .setTitle("`ERROR: Account is missing..`")
    .setThumbnail("https://cdn.discordapp.com/attachments/661359204572987393/1112317048899518555/Design_ohne_Titel.gif")
    .setDescription(
      `Du besitzt noch keinen Account.. Schreibe eine Nachricht um Coins zu erhalten!`
    );
  client.channels.cache.get('1074265742482100275').send({ embeds: [errorEmbed] });
};
