const { SlashCommandBuilder, ApplicationIntegrationType, InteractionContextType, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('send')
		.setDescription('Sends the specified message')
		.setIntegrationTypes(ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall)
		.setContexts(InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addStringOption(option =>
			option.setName('content')
				.setDescription('The content of the message')
				.setRequired(true))
		.addAttachmentOption(option =>
			option.setName('attachment')
				.setDescription('A optional attachment to send with the message')
				.setRequired(false)),
	async execute(interaction) {
		if (interaction.options.getAttachment('attachment')) {
			await interaction.reply({ content: interaction.options.getString('content'), files: [interaction.options.getAttachment('attachment')] });
		} else {
			await interaction.reply({ content: interaction.options.getString('content') });
		}
	}
};
