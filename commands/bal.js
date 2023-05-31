const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const mongoose = require("mongoose");
const ecolor = require("../util/embedColors.json")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bal")
    .setDescription("🠞 Account-Info: Coins, Banana, Multiplier und Streaks"),

  async execute(interaction, client) {
    const User = mongoose.models.User;
    const Exchanges = mongoose.models.Exchanges;
    const exchange = await Exchanges.findOne({ _id: "Exchange" }, "value");

    User.findOne({ _id: interaction.member.id })
      .select("coinAmmount bananaAmmount streak multiplier")
      .exec((err, user) => {
        if (err) {
          console.log(err);
          return;
        }

        let coins = user.coinAmmount.toString();
        let bananas = user.bananaAmmount.toString();
        let multiplier = user.multiplier.value.toString();
        let streak = user.streak.toString();

        var whenselling = ``;
        const gainedCoins = Math.round(exchange.value * user.bananaAmmount * user.multiplier.value);
        const allinall = Math.floor(gainedCoins + user.coinAmmount)

        if(user.bananaAmmount > 0) {
          whenselling = `
          ⠀→ *+${gainedCoins}* ${client.emojis.cache.find(emoji => emoji.name === "coins")}
          ⠀(*${allinall}* ${client.emojis.cache.find(emoji => emoji.name === "coins")})`
        }

        let np = [
          "Um dir weiter Coins zu holen kannst du \`/daily\` jede 24h machen.",
          "Du musst aktiv im Talk sein um 🍌 zu bekommen..",
          "Du stinkst! ~Distel",
          "Tipps könnten dir sehr hilfreich sein, aber naja manchmal sind sie unnötig lang und haben keine hilfreichen Konsens. Du guckst jetzt was Konsens heißt.. Ich kann dir das auch nicht sagen-",
          "Achso, wenn du dich aktiv mit anderen in Textchannels unterhälst wirst du mit 🍌 und XP belohnt.",
          "Wir sitzen schon sooooo lange an diesen Projekt, aber es macht Spaß! ~Creators",
          "ICH BIN DOCH SO DUMM, ICH KÖNNTE MICH GERADE UMBRINGEN! ~Lenox",
          "Wenn du willst geh mal in die Lotterie.. Wir haften nicht für eine Sucht dort!",
          "ACHTUNG, ACHTUNG! DIE LOTTERIE KANN BLEIBENDE SCHÄDEN VERURSACHEN!",
          "Manchmal fühle ich mich sinnlos. ~David"
        ]

        var balembed = new EmbedBuilder()
          .setColor(ecolor.TEXT)
          .setAuthor({ name: `${interaction.member.displayName}`, iconURL: interaction.member.displayAvatarURL() })
          .setTitle(`Tipps`)
          .setThumbnail(interaction.member.displayAvatarURL())
          .setDescription(`*${np[Math.floor(Math.random() * np.length)]}*`)
          .setFields([
            {
              name: `Accountdetails`,
              value: `
              ∘ Banananas \`${bananas}\` 🍌${whenselling}
              ∘ Coins \`${coins}\` ${client.emojis.cache.find(emoji => emoji.name === "coins")} | *Verkaufe deine Bananen um Coins zu erhalten*
              ∘ Multiplier \`${multiplier}\`x | *Allgemein bekommst du mehr Coins*
              ∘ Daily Streak \`${streak}\` ${client.emojis.cache.find(emoji => emoji.name === "daily")} | *Jeden Tag tägliche Belohnung abholen*
              `,
              inline: false
            }
          ])
          .setTimestamp();

        interaction.reply({ embeds: [balembed]});
      });
  },
};
