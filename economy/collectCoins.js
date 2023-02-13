// import { EmbedBuilder } from "@discordjs/builders";

module.exports = (msg, client) => {
  if (msg.member.id === client.user.id) {
    return;
  }
  if (msg.member.bot) {
    return;
  }
  msg.reply("Command registered");
};
