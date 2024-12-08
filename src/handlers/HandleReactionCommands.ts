import chalk from "chalk";
import { Client, Collection, Message } from "discord.js";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { LogX } from "../utils/Logging.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== Command registry ======================================================

export async function RegisterReactionCommands(client: Client) {
    LogX.log("Registering reaction commands...");

    client.commands.reaction = new Collection();
    // Message commands are registered in ./commands/**/*.ts
    // TODO: Change this path to absolute from project root
    const commandsPath = path.join(__dirname, "../reactions");
    const commandsFolders = fs.readdirSync(commandsPath);

    // Iterate through all folders and find all files
    for (const folder of commandsFolders) {
        const commandFilesPath = path.join(commandsPath, folder);
        const commandFiles = fs
            .readdirSync(commandFilesPath)
            .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));
        for (const file of commandFiles) {
            const filePath = path.join(commandFilesPath, file);
            const commandModule = await import(pathToFileURL(filePath).href);
            const command = commandModule.default;

            // The command should have imported successfully
            LogX.assert(
                command && command.name,
                `Failed to register command from file ${filePath}. Command: ${command.name}`,
            );
            // No group should be set by default
            LogX.assert(
                !command.group,
                `Group should not be set by default. Command: ${command.name}`,
            );
            // Error if name is not alphanumeric
            LogX.assert(
                /^[a-zA-Z0-9]+$/.test(command.name),
                `Command name ${command.name} should be alphanumeric.`,
            );

            command.group = folder;
            // Register the command
            client.commands.reaction.set(command.name.toLowerCase(), command);
            LogX.logD(
                `Registered ${chalk.green("Reaction")}Command ${chalk.magenta(command.group)}.${chalk.cyan(command.name)}.`,
            );
        }
    }
}

// ===== Command handler =======================================================

export async function HandleReactionCommands(client: Client, message: Message) {
    // For each reaction command, pass it in and check if it should be executed
    client.commands.reaction.each(async (command) => {
        if (await command.checker(message)) {
            // If the command should be executed, execute it
            try {
                LogX.logI(
                    `${chalk.green("Reaction")}Command ${chalk.magenta(command.group)}.${chalk.cyan(command.name)} executed by ${chalk.blue(message.author.tag)}.`,
                );
                command.executable(message);
            } catch (error) {
                LogX.logE(`Error executing command ${command.name}: ${error}`);
            }
            // Also, try to react with the emoji or send the message
            if (command.emoji) {
                if (Array.isArray(command.emoji)) {
                    for (const emoji of command.emoji) {
                        await message.react(emoji);
                    }
                } else {
                    await message.react(command.emoji);
                }
            }
            if (command.message) {
                await message.reply(command.message);
            }
        }
    });
}
