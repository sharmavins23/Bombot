import chalk from "chalk";
import { Client, Collection, Message } from "discord.js";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import BombotConstants from "../Constants.js";
import FlavorText from "../utils/FlavorText.js";
import { assert, log, logD, logE, logI } from "../utils/Logging.js";
import { pickRandom } from "../utils/Random.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== Command registry ======================================================

export async function RegisterMessageCommands(client: Client) {
    log("Registering simple commands...");

    client.commands.message = new Collection();
    // Message commands are registered in ./{src,build}/commands/**/*.ts
    const commandsPath = path.join(__dirname, "../commands");
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
            assert(
                command && command.name,
                `Failed to register command from file ${filePath}. Command: ${command.name}`,
            );
            // No group should be set by default
            assert(
                !command.group,
                `Group should not be set by default. Command: ${command.name}`,
            );
            // Error if any name or alias is not alphanumeric
            assert(
                /^[a-zA-Z0-9]+$/.test(command.name),
                `Command name ${command.name} should be alphanumeric.`,
            );
            // Ensure all aliases are alphanumeric
            if (command.aliases) {
                for (const alias of command.aliases) {
                    assert(
                        /^[a-zA-Z0-9]+$/.test(alias),
                        `Alias ${alias} should be alphanumeric. Command: ${command.name}`,
                    );
                }
            }
            // Warn on aliases that aren't lowercase
            if (command.aliases) {
                for (const alias of command.aliases) {
                    assert(
                        alias === alias.toLowerCase(),
                        `Alias ${alias} should be lowercase. Command: ${command.name}`,
                    );
                }
            }

            command.group = folder;
            // Register the command
            client.commands.message.set(command.name.toLowerCase(), command);
            logD(
                `Registered ${chalk.green("Message")}Command ${chalk.magenta(command.group)}.${chalk.cyan(command.name)}.`,
            );
        }
    }
}

// ===== Command handler =======================================================

export async function HandleMessageCommands(client: Client, message: Message) {
    // Don't handle message commands from bots
    if (message.author.bot) return;
    // Don't handle commands without any text
    if (!message.content) return;

    // Split message up on spaces
    let args: string[] = message.content.split(" ");
    // Remove any empty strings
    args = args.filter((arg) => arg !== "");

    // Return if args[0] is not a prefix
    if (
        !BombotConstants.PREFIXES.some((p) =>
            args[0].toLowerCase().startsWith(p.toLowerCase()),
        )
    )
        return;

    // Shortcut - If the message is just the prefix, call Help
    if (args.length === 1) {
        args.push("help");
    }

    // Check if args[1] is a command
    if (args.length < 2) return;
    let command = client.commands.message.get(args[1].toLowerCase());

    // If the command is not found, check aliases (case insensitive!)
    if (!command) {
        command = client.commands.message.find((cmd) => {
            if (!cmd.aliases) return false;
            return cmd.aliases.some(
                (alias) => alias.toLowerCase() === args[1].toLowerCase(),
            );
        });

        // If we still don't have a command, chastise the user
        if (!command) {
            // We could call Help here directly, but this is funnier
            await message.react(pickRandom(FlavorText.UnknownCommand.emoji));
            await message.reply(
                pickRandom(
                    FlavorText.UnknownCommand.strings(
                        message.author.tag,
                        args[1],
                    ),
                ),
            );
            return;
        }
    }

    // Join args[2:] into a single string, and replace the message.content with it
    message.content = args.slice(2).join(" ");

    // Execute the command
    try {
        logI(
            `${chalk.green("Message")}Command ${chalk.magenta(command.group)}.${chalk.cyan(command.name)} executed by ${chalk.blue(message.author.tag)}.`,
        );
        command.executable(message);
    } catch (error) {
        logE(`Error executing command ${command.name}: ${error}`);
    }
}
