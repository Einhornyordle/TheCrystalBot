const { SlashCommandBuilder, ApplicationIntegrationType, InteractionContextType, PermissionFlagsBits, MessageFlags } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('registerhoneypot')
		.setDescription('Adds honeypot status to a channel')
		.setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
		.setContexts(InteractionContextType.Guild)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction) {
		const result = await interaction.client.Honeypods.findAll({
			where: {
				channel_id: interaction.channelId
			}
		});
		if (!result.length) {
			interaction.client.Honeypods.create({ channel_id: interaction.channelId });
			await interaction.reply({ content: 'Success, this channel is now a honeypot!', flags: MessageFlags.Ephemeral });
			return;
		}
		await interaction.reply({ content: 'This channel is already a honeypot!', flags: MessageFlags.Ephemeral });
	}
};
