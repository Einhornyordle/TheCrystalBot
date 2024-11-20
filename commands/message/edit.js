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
		if (!interaction.client.selectedMessages[interaction.user.id]) {
			await interaction.reply({ content: "You have to select a message to edit via the contextmenu first!", ephemeral: true });
		}
		else if (interaction.client.selectedMessages[interaction.user.id].author.id !== interaction.client.user.id) {
			await interaction.reply({ content: "I can only edit my own messages!", ephemeral: true });
		}
		else if (interaction.client.selectedMessages[interaction.user.id].interactionMetadata.user.id !== interaction.user.id) {
			await interaction.reply({ content: "You can only edit messages I've sent on your own request!", ephemeral: true });
		}
		else {
			await interaction.client.selectedMessages[interaction.user.id].edit({ content: interaction.options.getString('content') });
			await interaction.reply({ content: 'The previously selected message has been edited', ephemeral: true });
		}
	}
};
