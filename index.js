const fs = require('node:fs');
const path = require('node:path');
const { Sequelize, DataTypes } = require('sequelize');
const { Client, Collection, GatewayIntentBits } = require('discord.js');

const sequelize = new Sequelize({
	dialect: 'mariadb',
	host: 'db',
	database: 'thecrystalbot',
	username: 'thecrystalbot',
	password: process.env['PASSWORD']
});
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.DirectMessageReactions
	]
});

client.editcache = new Collection();

await sequelize.authenticate();
console.log('Connection has been established successfully.');

client.Subscription = sequelize.define(
	'subscription',
	{
		subscriber: {
			type: DataTypes.BIGINT.UNSIGNED,
			allowNull: false
		},
		target: {
			type: DataTypes.BIGINT.UNSIGNED,
			allowNull: false
		},
	},
	{
		freezeTableName: true
	}
)

await sequelize.sync();
console.log('All models were synchronized successfully.');

client.commands = new Collection();
const commandsFoldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(commandsFoldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(commandsFoldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			if ('cooldown' in command) {
				command.cooldowns = new Collection();
			}
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.contextmenus = new Collection();
const contextmenusFoldersPath = path.join(__dirname, 'contextmenus');
const contextmenuFolders = fs.readdirSync(contextmenusFoldersPath);

for (const folder of contextmenuFolders) {
	const contextmenusPath = path.join(contextmenusFoldersPath, folder);
	const contextmenuFiles = fs.readdirSync(contextmenusPath).filter(file => file.endsWith('.js'));
	for (const file of contextmenuFiles) {
		const filePath = path.join(contextmenusPath, file);
		const contextmenu = require(filePath);
		if ('data' in contextmenu && 'execute' in contextmenu) {
			if ('cooldown' in contextmenu) {
				contextmenu.cooldowns = new Collection();
			}
			client.contextmenus.set(contextmenu.data.name, contextmenu);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(process.env["DISCORD_TOKEN"]);
