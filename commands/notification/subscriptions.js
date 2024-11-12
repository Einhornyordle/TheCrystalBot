const { SlashCommandBuilder, ApplicationIntegrationType, InteractionContextType, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('subscriptions')
		.setDescription('Lists all users you are subscribed to')
		.setIntegrationTypes(ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall)
		.setContexts(InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction) {
		const subscriptions = await interaction.client.Subscription.findAll({
			where: {
				subscriber: interaction.user.id
			}
		});
		await interaction.reply({ content: `**Subscriptions:**${subscriptions.reduce((prev, curr) => prev + `\n<@${curr.target}>`, '')}`, ephemeral: true });
	},
};
