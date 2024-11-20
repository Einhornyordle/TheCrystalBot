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
				.setDescription('The content of the message'))
		.addAttachmentOption(option =>
			option.setName('attachment')
				.setDescription('A optional attachment to send with the message')),
	async execute(interaction) {
		const options = {send: false};
		if (interaction.options.getString('content')) {
			options.content = interaction.options.getString('content');
			options.send = true;
		}
		if (interaction.options.getAttachment('attachment')) {
			options.files = [interaction.options.getAttachment('attachment')];
			options.send = true;
		}
		if (options.send) {
			await interaction.reply(options);
		} else {
			await interaction.reply({ content: 'At least one of the optional parameters is required!', ephemeral: true });
		}
	}
};
