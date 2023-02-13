require("dotenv").config()
const { Client, Collection, GatewayIntentBits, InteractionType, EmbedBuilder, ActivityType } = require("discord.js")
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildVoiceStates] })
const fs = require("fs");

client.commands = new Collection()

const commandFiles = fs.readdirSync("./commands/").filter(file => file.endsWith(".js"))

commandFiles.forEach(commandFile => {
    const command = require(`./commands/${commandFile}`)
    client.commands.set(command.data.name, command)
})

client.once("ready", () => {
    console.log(`Online! Bot: ${client.user.tag}!`)
    client.user.setActivity({ name: "in Arbeit..", type: ActivityType.Playing })
})

client.on("interactionCreate", async (interaction) => {
    if(interaction.user.id === client.user.id) { return }
    if(interaction.user.bot) { return }
    if(interaction.type !== InteractionType.ApplicationCommand) { return }
    
    const command = client.commands.get(interaction.commandName)

    var fail = new EmbedBuilder()
        .setColor(0x85C1E9)
        .setTitle("\`ERROR\`")
        .setAuthor({ name: interaction.member.displayName, iconURL: interaction.member.displayAvatarURL() })
        .setDescription("*Melde dich bei **David und Niklas**, da etwas nicht funktioniert... Danke!*")

    if(command) {
        try {
            await command.execute(interaction, client, dev)
        } catch(error) {
            console.error(error)

            if(interaction.deferred || interaction.replied) {
                interaction.editReply({ embeds: [fail], ephemeral: true })
            } else {
                interaction.reply({ embeds: [fail], ephemeral: true })
            }
        }
    }
})

client.login(process.env.DISCORD_BOT_TOKEN)
//IUCh bin cool