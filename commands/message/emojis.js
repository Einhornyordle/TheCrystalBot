const { SlashCommandBuilder, ApplicationIntegrationType, InteractionContextType, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('emojis')
		.setDescription('List all emojis and their markdown')
		.setIntegrationTypes(ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall)
		.setContexts(InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction) {
		const emojis = await interaction.client.application.emojis.fetch();
		await interaction.reply({
			content: emojis.reduce(
				(result, emoji) => result + `\n${emoji} \`${emoji}\``,
				'**Emojis:**',
			), ephemeral: true
		});
	}
};
