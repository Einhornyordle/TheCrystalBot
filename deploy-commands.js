const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];
const commandFoldersPath = path.join(__dirname, 'commands');
const contextFoldersPath = path.join(__dirname, 'contextmenus');
const commandFolders = fs.readdirSync(commandFoldersPath);
const contextmenuFolders = fs.readdirSync(contextFoldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(commandFoldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

for (const folder of contextmenuFolders) {
	const contextmenusPath = path.join(contextFoldersPath, folder);
	const contextmenuFiles = fs.readdirSync(contextmenusPath).filter(file => file.endsWith('.js'));
	for (const file of contextmenuFiles) {
		const filePath = path.join(contextmenusPath, file);
		const contextmenu = require(filePath);
		if ('data' in contextmenu && 'execute' in contextmenu) {
			commands.push(contextmenu.data.toJSON());
		} else {
			console.log(`[WARNING] The contextmenu at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const rest = new REST().setToken(process.env["DISCORD_TOKEN"]);

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application commands.`);

		const data = await rest.put(
			Routes.applicationCommands(process.env["CLIENT_ID"]),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application commands.`);
	} catch (error) {
		console.error(error);
	}
})();
