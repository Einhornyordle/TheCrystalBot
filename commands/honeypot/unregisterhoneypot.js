const { SlashCommandBuilder, ApplicationIntegrationType, InteractionContextType, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unregisterhoneypot')
		.setDescription('Removes honeypot status from a channel')
		.setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
		.setContexts(InteractionContextType.Guild)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction) {
		const result = await interaction.client.Honeypods.findAll({
			where: {
				channel_id: interaction.channelId
			}
		});
		if (result.length) {
			result.pop.destroy();
			await interaction.reply({ content: 'Success, this channel is no longer a honeypot!', ephemeral: true });
			return;
		}
		await interaction.reply({ content: 'This channel is not a honeypot!', ephemeral: true });
	}
};
