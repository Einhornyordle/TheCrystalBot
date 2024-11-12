const { SlashCommandBuilder, ApplicationIntegrationType, InteractionContextType, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unsubscribe')
		.setDescription('Unsubscribe from voice channel notifications')
		.setIntegrationTypes(ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall)
		.setContexts(InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addSubcommand(subcommand =>
			subcommand
				.setName('user')
				.setDescription('Unsubscribe from the specified user')
				.addUserOption(option => option.setName('user')
					.setDescription('The user to unsubscribe from')
					.setRequired(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('all')
				.setDescription('Unsubscribe from all users.')),
	async execute(interaction) {
		if (interaction.options.getSubcommand() === 'user') {
			const target = interaction.options.getMember('user');
			const subscriptions = await interaction.client.Subscription.findAll({
				where: {
					subscriber: interaction.user.id,
					target: target.id
				}
			});
			if (subscriptions.length === 1) {
				subscriptions.pop().destroy();
				await interaction.reply({ content: `You successfully unsubscribed from ${target}'s voice channel notifications`, ephemeral: true });
			} else if (subscriptions.length === 0) {
				await interaction.reply({ content: `You are not subscribed to ${target}'s voice channel notifications!`, ephemeral: true });
			} else {
				throw new Error("Mismatched subscription data!");
			}
		} else if (interaction.options.getSubcommand() === 'all') {
			const subscriptions = await interaction.client.Subscription.findAll({
				where: {
					subscriber: interaction.user.id
				}
			});
			if (subscriptions.length > 0) {
				subscriptions.forEach(sub => sub.destroy());
				await interaction.reply({ content: `You successfully unsubscribed from all voice channel notifications`, ephemeral: true });
			} else if (subscriptions.length === 0) {
				await interaction.reply({ content: `You are not subscribed to any voice channel notifications!`, ephemeral: true });
			} else {
				throw new Error("Mismatched subscription data!");
			}
		}
	}
};
