const { ContextMenuCommandBuilder, ApplicationCommandType, ApplicationIntegrationType, InteractionContextType, PermissionFlagsBits, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType } = require('discord.js');

module.exports = {
	data: new ContextMenuCommandBuilder()
		.setName('Edit')
		.setType(ApplicationCommandType.Message)
		.setIntegrationTypes(ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall)
		.setContexts(InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel),
	async execute(interaction) {
		if (interaction.options.data[0].message.author.id !== interaction.client.user.id) {
			await interaction.reply({ content: "The selected message wasn't sent by me!", ephemeral: true });
			return;
		}
		if (interaction.options.data[0].message.interactionMetadata.user.id !== interaction.user.id) {
			await interaction.reply({ content: "You can only edit messages I've sent on your own request!", ephemeral: true });
			return;
		}
		interaction.client.editcache[interaction.user.id] = interaction.options.data[0].message;
		await interaction.reply({ content: 'The message is now ready to be edited!', ephemeral: true });
	}
};
