const { Events } = require('discord.js');

module.exports = {
    name: Events.VoiceStateUpdate,
    async execute(oldState, newState) {
        if (!oldState.channelId && newState.channelId) {
            const subscriptions = await newState.client.Subscription.findAll({
                where: {
                    target: newState.id
                }
            });
            subscriptions.forEach(sub => newState.client.users.send(sub.subscriber, `${newState.member} just entered ${newState.channel}`));
        }
    }
};
