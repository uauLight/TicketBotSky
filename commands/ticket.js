const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionsBitField,
    ChannelType,
    StringSelectMenuBuilder,
} = require("discord.js");

module.exports = {
    name: "ticket",
    async handleInteraction(interaction) {
        if (
            !interaction.isStringSelectMenu() ||
            interaction.customId !== "ticket_menu"
        )
            return;

        const supportType = interaction.values[0];
        const ticketChannelName = `${supportType}-${interaction.user.username}`;

        try {
            // Criando canal do ticket
            const channel = await interaction.guild.channels.create({
                name: ticketChannelName,
                type: ChannelType.GuildText,
                parent: "1048266749583306762", // ID da categoria dos tickets
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: [PermissionsBitField.Flags.ViewChannel],
                    },
                    {
                        id: interaction.user.id,
                        allow: [
                            PermissionsBitField.Flags.ViewChannel,
                            PermissionsBitField.Flags.SendMessages,
                        ],
                    },
                    {
                        id: "1048266690082897990",
                        allow: [
                            PermissionsBitField.Flags.ViewChannel,
                            PermissionsBitField.Flags.SendMessages,
                        ],
                    }, // Role Suporte
                ],
            });

            // Enviando embed dentro do ticket
            const embed = new EmbedBuilder()
                .setColor("Green")
                .setTitle("🎟️ Ticket Criado!")
                .setDescription(
                    `Olá <@${interaction.user.id}>, seu ticket foi aberto!\n\n🔹 **Tipo de Suporte:** ${supportType}\n\n🔔 A equipe de suporte foi notificada e responderá em breve.\n\n⚠ **Mau uso pode resultar em punição.**`,
                )
                .setTimestamp();

            const buttons = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId("close_ticket")
                    .setLabel("🔒 Fechar Ticket")
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId("close_and_save")
                    .setLabel("📜 Fechar e Salvar")
                    .setStyle(ButtonStyle.Primary),
            );

            await channel.send({ embeds: [embed], components: [buttons] });

            // **Resetando apenas o dropdown, mantendo a mesma embed**
            await interaction.update({
                components: [
                    new ActionRowBuilder().addComponents(
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
                                    description: "Suporte geral",
                                    value: "outros",
                                },
                            ]),
                    ),
                ],
            });

            // Responder ao usuário com o ticket criado
            await interaction.followUp({
                content: `✅ Seu ticket foi criado com sucesso! Acesse em <#${channel.id}>.`,
                ephemeral: true,
            });
        } catch (error) {
            console.error("Erro ao criar ticket:", error);
        }
    },
};
