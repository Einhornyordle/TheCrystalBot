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
			message.guild.members.ban(message.author, { deleteMessageSeconds: 86400, reason: "Honeypot" });
		}
	},
};
