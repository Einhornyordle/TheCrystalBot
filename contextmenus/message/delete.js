const { ContextMenuCommandBuilder, ApplicationCommandType, ApplicationIntegrationType, InteractionContextType, PermissionFlagsBits, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType } = require('discord.js');

module.exports = {
	data: new ContextMenuCommandBuilder()
		.setName('Delete')
		.setType(ApplicationCommandType.Message)
		.setIntegrationTypes(ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall)
		.setContexts(InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel),
	async execute(interaction) {
		if (interaction.options.data[0].message.author.id !== interaction.client.user.id) {
			await interaction.reply({ content: "The selected message wasn't sent by me!", ephemeral: true });
			return;
		}
		if (interaction.options.data[0].message.interactionMetadata.user.id !== interaction.user.id) {
			await interaction.reply({ content: "You can only delete messages I've sent on your own request!", ephemeral: true });
			return;
		}
		await interaction.options.data[0].message.delete();
		await interaction.reply({ content: 'The message has been deleted', ephemeral: true });
	}
};
