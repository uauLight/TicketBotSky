module.exports = (client) => {
    // ID do cargo que será atribuído aos novos membros
    const roleId = '1048266700312821812'; // Substitua pelo ID do cargo desejado

    // Evento de novo membro entrando no servidor
    client.on('guildMemberAdd', async (member) => {
        try {
            // Busca o cargo pelo ID
            const role = member.guild.roles.cache.get(roleId);

            if (role) {
                // Adiciona o cargo ao novo membro
                await member.roles.add(role);
                console.log(`Cargo ${role.name} atribuído a ${member.user.tag}`);
            } else {
                console.log("Cargo não encontrado!");
            }
        } catch (error) {
            console.error("Erro ao atribuir cargo:", error);
        }
    });
};
