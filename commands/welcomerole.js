module.exports = (client) => {
    // ID do cargo que será atribuído aos novos membros
    const roleId = '1048266700312821812'; // Substitua pelo ID do cargo desejado

    // Evento de novo membro entrando no servidor
    client.on('guildMemberAdd', async (member) => {
        try {
            // Busca o cargo pelo ID
            const role = await member.guild.roles.fetch(roleId);

            if (role) {
                // Verifica se o bot tem permissões para atribuir o cargo
                if (member.guild.me.permissions.has('MANAGE_ROLES')) {
                    // Adiciona o cargo ao novo membro
                    await member.roles.add(role);
                    console.log(`Cargo ${role.name} atribuído a ${member.user.tag}`);
                } else {
                    console.log("O bot não tem permissão para gerenciar cargos!");
                }
            } else {
                console.log("Cargo não encontrado!");
            }
        } catch (error) {
            console.error("Erro ao atribuir cargo:", error);
        }
    });
};
