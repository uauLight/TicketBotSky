require("dotenv").config();  // Carregar variáveis de ambiente
const { Client, GatewayIntentBits, Collection } = require("discord.js");  // Importando os módulos do Discord
const fs = require("fs");
const express = require("express");
const app = express();

// Rota para manter o servidor online na Railway
app.get("/", (req, res) => {
    res.send("Bot está rodando!");
});

app.listen(3000, () => {
    console.log("Servidor rodando para manter o bot online na Railway.");
});

// Criação do cliente do Discord
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,  // Intenção para eventos de guildas
        GatewayIntentBits.GuildMessages,  // Intenção para eventos de mensagens em guildas
        GatewayIntentBits.GuildMembers,  // Intenção para eventos de membros em guildas
        GatewayIntentBits.MessageContent,  // Intenção para conteúdo das mensagens
    ],
});

// Carregar todos os comandos automaticamente da pasta "commands"
client.commands = new Collection();
const commandFiles = fs
    .readdirSync("./commands")
    .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
    console.log(`Comando carregado: ${command.name}`);
}

// Carregar o arquivo de atribuição de cargo automaticamente
require('./commands/welcomerole')(client);  // Executa a lógica de atribuição do cargo

// Evento de "ready" - Aviso de Bot Online
client.once("ready", () => {
    console.log(`Bot está online como ${client.user.tag}`);
    console.log("🔹 Bot está pronto e funcionando!");
});

// Evento para processar os comandos enviados nas mensagens
client.on('messageCreate', async (message) => {
    // Ignora mensagens de bots
    if (message.author.bot) return;

    // Defina o prefixo para os comandos
    const prefix = '!';  // Pode ser alterado conforme sua preferência

    // Verifica se a mensagem começa com o prefixo
    if (!message.content.startsWith(prefix)) return;

    // Extrai o nome do comando e os argumentos
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();  // O primeiro argumento será o nome do comando

    // Verifica se o comando existe
    const command = client.commands.get(commandName);

    if (!command) {
        return message.reply("Comando não encontrado!");
    }

    // Tenta executar o comando
    try {
        await command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('Houve um erro ao tentar executar esse comando!');
    }
});

// 🔑 Login do bot com o token da variável de ambiente
client.login(process.env.DISCORD_TOKEN);
