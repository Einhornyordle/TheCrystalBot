const { ContextMenuCommandBuilder, ApplicationCommandType, ApplicationIntegrationType, InteractionContextType, PermissionFlagsBits, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType } = require('discord.js');

module.exports = {
	data: new ContextMenuCommandBuilder()
		.setName('Select')
		.setType(ApplicationCommandType.Message)
		.setIntegrationTypes(ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall)
		.setContexts(InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel),
	async execute(interaction) {
		interaction.client.selectedMessages[interaction.user.id] = interaction.options.data[0].message;
		await interaction.reply({ content: 'The message has been selected', ephemeral: true });
	}
};
