const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
    name: "close",
    async handleInteraction(interaction) {
        if (!interaction.isButton()) return;

        const channel = interaction.channel;

        if (interaction.customId === "close_ticket") {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setTitle("🔒 Ticket Fechado")
                        .setDescription("Fechando em **5 segundos**...")
                        .setTimestamp(),
                ],
            });
            setTimeout(() => channel.delete().catch(console.error), 5000);
        }

        if (interaction.customId === "close_and_save") {
            const messages = await channel.messages.fetch({ limit: 100 });
            let transcript = `📜 **Transcript do Ticket ${channel.name}**\n\n`;

            messages.reverse().forEach((msg) => {
                transcript += `[${msg.createdAt.toLocaleString()}] ${msg.author.tag}: ${msg.content}\n`;
            });

            const fileName = `transcript-${channel.name}.txt`;
            fs.writeFileSync(fileName, transcript);

            const attachment = new AttachmentBuilder(fileName);
            const logChannel = interaction.guild.channels.cache.get(
                "1048266826561355786",
            );

            if (logChannel) {
                await logChannel.send({
                    content: `📜 **Transcript do ticket ${channel.name}**`,
                    files: [attachment],
                });
            }

            fs.unlinkSync(fileName);
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Blue")
                        .setTitle("📜 Ticket Fechado e Salvo")
                        .setDescription("Transcript enviado!")
                        .setTimestamp(),
                ],
            });
            setTimeout(() => channel.delete().catch(console.error), 5000);
        }
    },
};
