const { SlashCommandBuilder, ApplicationIntegrationType, InteractionContextType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('subscribers')
        .setDescription('Lists all users that subscribed to you')
		.setIntegrationTypes(ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall)
		.setContexts(InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const subscriptions = await interaction.client.Subscription.findAll({
            where: {
                target: interaction.user.id
            }
        });
        await interaction.reply({ content: `**Subscribers:**${subscriptions.reduce((prev, curr) => prev + `\n<@${curr.subscriber}>`, '')}`, ephemeral: true });
    },
};
