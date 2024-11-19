const { SlashCommandBuilder, ApplicationIntegrationType, InteractionContextType, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('edit')
		.setDescription('Edits the previously sent message which has been selected via context menu before')
		.setIntegrationTypes(ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall)
		.setContexts(InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addStringOption(option =>
			option.setName('content')
				.setDescription('The content of the new message')
				.setRequired(true)),
	async execute(interaction) {
		await interaction.client.editcache[interaction.user.id].edit({ content: interaction.options.getString('content')});
		await interaction.reply({ content: 'The previously selected message has been edited', ephemeral: true });
	}
};
