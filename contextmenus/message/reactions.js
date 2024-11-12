const { ContextMenuCommandBuilder, ApplicationCommandType, ApplicationIntegrationType, InteractionContextType, PermissionFlagsBits, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType } = require('discord.js');

module.exports = {
	data: new ContextMenuCommandBuilder()
		.setName('Reactions')
		.setType(ApplicationCommandType.Message)
		.setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
		.setContexts(InteractionContextType.Guild, InteractionContextType.BotDM)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction) {
		await interaction.client.channels.fetch(interaction.channelId);
		const message = await interaction.targetMessage.fetch();
		const userReactions = message.reactions.cache.filter(reaction => reaction.users.cache.has(interaction.client.user.id));
		const emojis = await interaction.client.application.emojis.fetch();
		const options = emojis.map(emoji => new StringSelectMenuOptionBuilder({
			label: emoji.name,
			value: emoji.id,
			emoji: emoji.id,
			default: userReactions.has(emoji.id)
		}));
		const select = new StringSelectMenuBuilder()
			.setCustomId('emoji')
			.setPlaceholder('Reactions')
			.setMinValues(0)
			.setMaxValues(options.length)
			.addOptions(options);
		const row = new ActionRowBuilder()
			.addComponents(select);
		const response = await interaction.reply({ content: `Select the emojis to react with:`, components: [row], ephemeral: true });
		response.createMessageComponentCollector({ componentType: ComponentType.StringSelect }).on('collect', async selection => {
			const message = await interaction.targetMessage.fetch();
			const userReactions = message.reactions.cache.filter(reaction => reaction.users.cache.has(selection.client.user.id) && !selection.values.includes(reaction.emoji.id));
			await Promise.all([...selection.values.map(value => interaction.targetMessage.react(value)), ...userReactions.values().map(reaction => reaction.users.remove(interaction.client.user.id))]);
			options.map(option => option.data.default = selection.values.includes(option.data.value));
			selection.update({ components: [row] });
		});
	}
};
