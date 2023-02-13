require("dotenv").config()
const fs = require("fs")
const { REST } = require("./node_modules/@discordjs/rest")
const { Routes } = require("discord.js")
const commands = []

const commandFiles = fs.readdirSync("./commands/").filter(file => file.endsWith(".js"))

commandFiles.forEach(commandFile => {
    const command = require(`./commands/${commandFile}`)
    commands.push(command.data.toJSON())
})

const restClient = new REST({ version: "9" }).setToken(process.env.DISCORD_BOT_TOKEN)

restClient.put(Routes.applicationGuildCommands(process.env.DISCORD_APPLICATION_ID, process.env.DISCORD_GUILD_ID),
{body: commands})
.then(() => console.log("Successfully registered Commands!"))
.catch(console.error)