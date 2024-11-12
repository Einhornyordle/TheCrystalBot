const { Events } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (interaction.isContextMenuCommand()) {

			const contextmenu = interaction.client.contextmenus.get(interaction.commandName);

			if (!contextmenu) {
				console.error(`No contextmenu matching ${interaction.commandName} was found.`);
				return;
			}

			try {
				await contextmenu.execute(interaction);
			} catch (error) {
				console.error(error);
				if (interaction.replied || interaction.deferred) {
					await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
				} else {
					await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
				}
			}
		}

		if (interaction.isChatInputCommand()) {

			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}

			try {
				await command.execute(interaction);
			} catch (error) {
				console.error(error);
				if (interaction.replied || interaction.deferred) {
					await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
				} else {
					await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
				}
			}
		}
	}
};

// if ('cooldown' in command) {
// 	const now = Date.now();
// 	const cooldownAmount = command.cooldown * 1_000;
// 	if (command.cooldowns.has(interaction.user.id)) {
// 		const expirationTime = command.cooldowns.get(interaction.user.id) + cooldownAmount;

// 		if (now < expirationTime) {
// 			const expiredTimestamp = Math.round(expirationTime / 1_000);
// 			return interaction.reply({ content: `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`, ephemeral: true });
// 		}
// 	}

// 	command.cooldowns.set(interaction.user.id, now);
// 	setTimeout(() => command.cooldowns.delete(interaction.user.id), cooldownAmount);
// }
