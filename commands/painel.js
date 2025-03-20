const {
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
} = require("discord.js");

module.exports = {
    name: "criarpainel",
    async execute(message) {
        const embed = new EmbedBuilder()
            .setColor("Blue")
            .setTitle("💠 Central de Atendimento SkyPlugins")
            .setDescription(
                `
                🔹 **Precisa de ajuda?** Selecione uma categoria abaixo para falar com nossa equipe.

                📌 **Categorias:**
                💬 • Dúvidas
                🐞 • Bugs
                🛒 • Compras
                🎖️ • Cargos
                📌 • Outros

                ⚠ **Mau uso pode resultar em punição!**
            `,
            )
            .setTimestamp();

        const row = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId("ticket_menu")
                .setPlaceholder("🎫 Escolha o tipo de suporte")
                .addOptions([
                    {
                        label: "💬 Dúvidas",
                        description: "Dúvidas e problemas",
                        value: "duvidas",
                    },
                    {
                        label: "🐞 Bugs",
                        description: "Reporte de bugs",
                        value: "bugs",
                    },
                    {
                        label: "🛒 Compras",
                        description: "Problemas com compras",
                        value: "compras",
                    },
                    {
                        label: "🎖️ Cargos",
                        description: "Solicitação de cargo Cliente",
                        value: "cargos",
                    },
                    {
                        label: "📌 Outros",
                        description: "Outros casos",
                        value: "outros",
                    },
                ]),
        );

        await message.channel.send({ embeds: [embed], components: [row] });
    },
};
