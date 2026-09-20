const { Events } = require('discord.js');

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
		if (message.author.id === message.client.user.id) {
			return;
		}

		const result = await message.client.Honeypods.findAll({
			where: {
				channel_id: message.channelId
			}
		});
		if (result.length) {
			try {
				await message.guild.members.ban(message.author, { deleteMessageSeconds: 86400, reason: "Honeypot" });
			} catch (error) {
				if (error.message === "Missing Permissions") {
					console.warn("Could not ban user due to insufficient permissions, trying to delete the message instead...");
					try {
						await message.delete();
					} catch (error) {
						if (error.message === "Missing Permissions") {
							console.warn("Could not delete the message either, giving up.");
						}
					}
				}
				else
					throw error;
			}
		}
	},
};
