require("dotenv").config();
const {
  Client,
  Collection,
  GatewayIntentBits,
  InteractionType,
  EmbedBuilder,
  ActivityType,
  Colors,
  PermissionsBitField
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

const mongoose = require("mongoose");

const fs = require("fs");

//EmbedColor
const ecolor = require("./util/embedColors.json")

// import functions
const messages = require("./economy/message");
const levelBuilder = require("./util/levelBuilder");
const voiceState = require("./economy/voice");
const createNewUser = require('./util/createNewUser');
const { create } = require("domain");

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

client.on("messageCreate", async (msg) => await messages(msg, client));

client.on("voiceStateUpdate", (oldMember, newMember) =>
  voiceState(oldMember, newMember, client)
);

client.on("guildCreate", (guild) => {
  let channelToSendTo;

  guild.channels.cache.forEach(channel => {
      if (channel.type !== 0) { return; }
      if (channelToSendTo) { return; }
      if (!channel.permissionsFor(guild.members.me).has([PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.AttachFiles, PermissionsBitField.Flags.EmbedLinks])) { return; }
      channelToSendTo = channel;
  });

  if(!channelToSendTo) return;

  let newGuildEmbed = new EmbedBuilder()
      .setColor(ecolor.TEXT)
      .setThumbnail("https://cdn.discordapp.com/attachments/661359204572987393/1112450026875146321/Thankyou.png")
      .setTitle(`Danke..`)
      .setDescription(`
      *Krass, vielen Dank fürs hinzufügen unseres Bots auf den Discord! Das echt nett, dass du diesen Bot testet!
      Euer Vertrauen und Support bedeuten uns mega viel. Unser Bot ist hier, um euer Discord-Game aufzumischen und euch mit seinen Skills zu helfen. Wir hoffen, er rockt eure Socken und bringt Schwung in die Bude.* (Wir sind unter 40)
      
      ***Falls ihr Fragen, Ideen oder Probleme habt, lasst es uns wissen. Wir sind immer am Start, um den Bot zu pimpen und eure Wünsche umzusetzen.***

      *Nochmal dickes Danke für die Einladung und das Vertrauen. Wir sind hyped, Teil eures Servers zu sein und freuen uns wenn ihr all den geilen Stuff ausprobiert!*
      `)
      .setFields([
        { name: '\u200B', value: '\u200B' },
        {
          name:"Bot Creators",
          value:`
          **Niklas** aka 
          **Lenox#9196**
          **David** aka 
          **EinfachDavide#5883**
          `,
          inline: true
        },
        {
          name:"GitHub Page",
          value:`[PLACEHOLDER]`,
          inline: true
        },
        {
          name:"How to Start",
          value:`Nun kannst du mit \`/help\` dir alle Commands ansehen oder direkt mit \`/bal\` durchstarten..`,
          inline: false
        },
      ])
      .setTimestamp()
  channelToSendTo.send({embeds: [newGuildEmbed]})
})

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
    .setColor(Colors.Red)
    .setTitle("\`ERROR: Something going wrong..\`")
    .setThumbnail("https://cdn.discordapp.com/attachments/661359204572987393/1112457266000580658/Design_ohne_Titel.gif")
    .setDescription(`Melde dich bitte umgehend bei den **Bot Creators**! (Siehe \`/info\`)`)

  if (command) {
    try {

      const User = mongoose.models.User;
      const user = await User.findOne({_id: interaction.member.id}, 'multiplier');

        if (!user) {
          await createNewUser(interaction.member.id, client);
        }

        if (Date.now() - user.multiplier.last > 4 * 60* 60 * 1000) {
          await User.updateOne({_id: interaction.member.id}, {$set: {
            "multiplier.value": 1,
            "multiplier.last": 0,
          }})
        }
  
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
    await mongoose.connect(process.env.MONGO_DB_URI, {dbName: 'freddie-test'});
    console.log("Connected to MongoDB");
    mongoose.set("strictQuery", false);
  } catch (error) {
    console.error(error);
  }
  // Database scheme for user with name, id and ammount of collected coins
  const userScheme = new mongoose.Schema({
    _id: String,
    name: String,
    coinAmmount: Number,
    bananaAmmount: Number,
    streak: Number,
    lastLogin: String,
    dailyLastTriggered: Number,
    gears: Object,
    lastMessage: Number,
    joinedVC: Number,
    leftVC: Number,
    items: Array,
    multiplier: Object,
    XP: Number,
    lvl: Number,
    lastMonkeys: Number,
    inventory: Object,
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
    let newExchange = Math.floor(Math.random() * (20 - 2) + 2 + 1);

    exchange.value = newExchange;
    console.log(newExchange);
    exchange.save();
  }, untilNextExchange);
})();
