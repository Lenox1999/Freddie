require("dotenv").config();
const {
  Client,
  Collection,
  GatewayIntentBits,
  InteractionType,
  EmbedBuilder,
  ActivityType,
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

const mongoose = require("mongoose");

const fs = require("fs");

// import functions
const collectCoins = require("./economy/collect");
const levelBuilder = require("./util/levelBuilder");
const voiceState = require('./economy/voice');

client.commands = new Collection();

const commandFiles = fs
  .readdirSync("./commands/")
  .filter((file) => file.endsWith(".js"));

commandFiles.forEach((commandFile) => {
  const command = require(`./commands/${commandFile}`);
  client.commands.set(command.data.name, command);
});

client.once("ready", () => {
  console.log(`Online! Bot: ${client.user.tag}!`);
  client.user.setActivity({ name: "in Arbeit..", type: ActivityType.Playing });
});

client.on("messageCreate", async (msg) => await collectCoins(msg, client));

client.on('voiceStateUpdate', (oldMember, newMember) => voiceState(oldMember, newMember, client));

client.on("interactionCreate", async (interaction) => {
  if (interaction.user.id === client.user.id) {
    return;
  }
  if (interaction.user.bot) {
    return;
  }
  if (interaction.type !== InteractionType.ApplicationCommand) {
    return;
  }

  const command = client.commands.get(interaction.commandName);

  var fail = new EmbedBuilder()
    .setColor(0x85c1e9)
    .setTitle("`ERROR`")
    .setAuthor({
      name: interaction.member.displayName,
      iconURL: interaction.member.displayAvatarURL(),
    })
    .setDescription(
      "*Melde dich bei **David und Niklas**, da etwas nicht funktioniert... Danke!*"
    );

  if (command) {
    try {
      await command.execute(interaction, client);
    } catch (error) {
      console.error(error);

      if (interaction.deferred || interaction.replied) {
        interaction.editReply({ embeds: [fail], ephemeral: true });
      } else {
        interaction.reply({ embeds: [fail], ephemeral: true });
      }
    }
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);

// connect MongoDB Databse - URI has to be set in .env file (without it wont work)
(async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI, {dbName: 'freddie'});
    console.log("MONGO CONNECTED");
  } catch (error) {
    console.error(error);
  }
  // Database scheme for user with name, id and ammount of collected coins
  const userScheme = new mongoose.Schema({
    _id: String,
    name: String,
    coinAmmount: Number,
    fishAmmount: Number,
    streak: Number,
    lastLogin: String,
    dailyLastTriggered: Number,
    gears: Array,
    lastMessage: Number,
    joinedVC: Number,
    leftVC: Number, 
    items: Array,
    multiplier: Number,
    XP: Number,
    lvl: Number,
  });
  mongoose.model("User", userScheme);

  const Level = new mongoose.Schema({
    _id: String,
    levelObj: Object,
  });

  // model the Schema -> means we save it in the DB as an element to hold further lists
  mongoose.model("levels", Level);

  const Exchange = new mongoose.Schema({
    _id: String,
    value: Number,
  });

  const exchangeModel = mongoose.model("Exchanges", Exchange);

  // const exchange = new exchangeModel({
  //   _id: "Exchange",
  //   value: 0,
  // });

  // exchange.save();

  const exchange = await exchangeModel.findOne({ _id: "Exchange" }, "value");

  // levelBuilder();

  // Fisch-Wechselkurs generieren
  const untilNextExchange = 43200000;
  setInterval(() => {
    let newExchange = Math.random() * (4 - 0) + 0;

    exchange.value = newExchange;
    console.log(newExchange);
    exchange.save();
  }, untilNextExchange);
})();
