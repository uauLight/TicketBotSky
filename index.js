require("dotenv").config();
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");
const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.send("Bot está rodando!");
});

app.listen(3000, () => {
    console.log("Servidor rodando para manter o Replit online.");
});
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
    ],
});

client.commands = new Collection();

// 🔹 Carregar todos os comandos automaticamente
const commandFiles = fs
    .readdirSync("./commands")
    .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// 🔹 Eventos de Interação e Mensagem
client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return;
        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
        }
    } else if (interaction.isStringSelectMenu() || interaction.isButton()) {
        client.commands.forEach(async (command) => {
            if (command.handleInteraction) {
                await command.handleInteraction(interaction);
            }
        });
    }
});

client.on("messageCreate", async (message) => {
    if (!message.content.startsWith("!")) return;
    const args = message.content.slice(1).split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);
    if (!command) return;
    try {
        await command.execute(message, args);
    } catch (error) {
        console.error(error);
    }
});

// 🔹 Evento de "ready" - Aviso de Bot Online
client.once("ready", () => {
    console.log(`Bot está online como ${client.user.tag}`);
    console.log("🔹 Bot está pronto e funcionando!");
});

// 🔑 Login do bot
client.login(process.env.DISCORD_TOKEN);
