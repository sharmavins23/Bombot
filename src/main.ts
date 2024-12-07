import chalk from "chalk";
import { Client, Collection, GatewayIntentBits, Message } from "discord.js";
import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import "./extensions/Discord.js";
import { getGitCommitHash } from "./utils/GitTools.js";
import { LogX } from "./utils/Logging.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== Configuration =========================================================

// Possible runtime environments for the bot
export enum Environments {
    beta = "beta", // Development
    gamma = "gamma", // Testing (CI/CD)
    prod = "prod", // Production environment
}

// Handle runtime environment
export const currentRuntimeEnvironment: Environments =
    (process.env.RUNTIME_ENV as Environments) ?? Environments.beta;
export const botName =
    currentRuntimeEnvironment == Environments.prod ? "Bombot" : "Testbot";

// List of prefixes that the bot will respond to
const prefixes = [botName, `${botName},`];

// Create a new bot
export const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageContent,
    ],
});

// ===== Command handlers ======================================================

/**
 * Handle message commands.
 *
 * @param message The message to handle.
 */
async function handleMessageCommands(message: Message) {
    // Don't handle message commands from bots
    if (message.author.bot) return;

    // Split message up on spaces
    let args = message.content.split(" ");
    // Remove any empty strings
    args = args.filter((arg) => arg !== "");

    // Return if args[0] is not a prefix
    if (
        !prefixes.some((p) => args[0].toLowerCase().startsWith(p.toLowerCase()))
    )
        return;

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

        if (!command) return;
    }

    // Join args[2:] into a single string, and replace the message.content with it
    message.content = args.slice(2).join(" ");

    // Execute the command
    try {
        LogX.logI(
            `${chalk.green("Message")}Command ${chalk.magenta(command.group)}.${chalk.cyan(command.name)} executed by ${chalk.blue(message.author.tag)}.`,
        );
        command.executable(message);
    } catch (error) {
        LogX.logE(`Error executing command ${command.name}: ${error}`);
    }
}

/**
 * Handle reaction commands.
 *
 * @param message The message to handle.
 */
async function handleReactionCommands(message: Message) {
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

// ===== OnEvent handlers ======================================================

// Ready handler
client.once("ready", async () => {
    // Register all commands
    if (!client.commands) {
        client.commands = {
            message: new Collection(),
            reaction: new Collection(),
        };
    }
    await registerMessageCommands();
    await registerReactionCommands();

    // For Gamma testing, we can stop here
    if (currentRuntimeEnvironment === Environments.gamma) {
        LogX.logI(
            `${botName} is successfully running in ${chalk.yellow(
                currentRuntimeEnvironment,
            )} environment. Stopping here.`,
        );
        process.exit(0);
    }
});

// Message handler
client.on("messageCreate", async (message: Message) => {
    // Handle message commands
    handleMessageCommands(message);
    handleReactionCommands(message);
});

// ===== Command registration ==================================================

/**
 * Register all message commands.
 * Message commands are the default command style, where the bot waits for a
 * particular prefix before executing a command.
 */
async function registerMessageCommands() {
    LogX.log("Registering simple commands...");

    client.commands.message = new Collection();
    // Message commands are registered in ./commands/**/*.ts
    const commandsPath = path.join(__dirname, "commands");
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
            // Error if any name or alias is not alphanumeric
            LogX.assert(
                /^[a-zA-Z0-9]+$/.test(command.name),
                `Command name ${command.name} should be alphanumeric.`,
            );
            if (command.aliases) {
                for (const alias of command.aliases) {
                    LogX.assert(
                        /^[a-zA-Z0-9]+$/.test(alias),
                        `Alias ${alias} should be alphanumeric. Command: ${command.name}`,
                    );
                }
            }
            // Warn on aliases that aren't lowercase
            if (command.aliases) {
                for (const alias of command.aliases) {
                    LogX.assert(
                        alias === alias.toLowerCase(),
                        `Alias ${alias} should be lowercase. Command: ${command.name}`,
                    );
                }
            }

            command.group = folder;
            // Register the command
            client.commands.message.set(command.name.toLowerCase(), command);
            LogX.logD(
                `Registered ${chalk.green("Message")}Command ${chalk.magenta(command.group)}.${chalk.cyan(command.name)}.`,
            );
        }
    }
}

/**
 * Register all reaction commands.
 * Message commands are the default command style, where the bot waits for a
 * particular prefix before executing a command.
 */
async function registerReactionCommands() {
    LogX.log("Registering reaction commands...");

    client.commands.reaction = new Collection();
    // Message commands are registered in ./commands/**/*.ts
    const commandsPath = path.join(__dirname, "reactions");
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

// ===== Executables ===========================================================

// Run!
async function run() {
    LogX.assert(
        typeof process.env.BOT_TOKEN !== "undefined",
        "Could not find bot token in your environment!",
    );

    const loginOutput: string = await client.login(process.env.BOT_TOKEN);
    LogX.assert(
        loginOutput === process.env.BOT_TOKEN,
        "Failed to login to Discord!",
    );

    LogX.log(`${botName} is now succesfully`, chalk.green("logged in") + "!");
    LogX.logD(`Latest deployment: ${chalk.cyan(getGitCommitHash())}`);
}

run();
