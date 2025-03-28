require("dotenv").config();
const { Client, GatewayIntentBits, Collection } = require("discord.js");  // Add Collection import
const fs = require("fs");
const express = require("express");
const app = express();

// Rota para manter o servidor online
app.get("/", (req, res) => {
    res.send("Bot está rodando!");
});

app.listen(3000, () => {
    console.log("Servidor rodando para manter o Replit online.");
});

// Criação do cliente do Discord
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
    ],
});

// Carregar todos os comandos automaticamente (se necessário)
client.commands = new Collection();
const commandFiles = fs
    .readdirSync("./commands")
    .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// Carregar o arquivo de atribuição de cargo automaticamente
require('./commands/welcomerole')(client);  // Executa a lógica de atribuição do cargo

// Evento de "ready" - Aviso de Bot Online
client.once("ready", () => {
    console.log(`Bot está online como ${client.user.tag}`);
    console.log("🔹 Bot está pronto e funcionando!");
});

// 🔑 Login do bot
client.login(process.env.DISCORD_TOKEN);
