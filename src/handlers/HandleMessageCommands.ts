import chalk from "chalk";
import { Client, Collection, Message } from "discord.js";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import BombotConstants from "../Constants.js";
import { LogX } from "../utils/Logging.js";
import { Stringy } from "../utils/Strings.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== Command registry ======================================================

export async function RegisterMessageCommands(client: Client) {
    LogX.log("Registering simple commands...");

    client.commands.message = new Collection();
    // Message commands are registered in src/commands/**/*.ts
    // TODO: Change this path to absolute from project root
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
            const flavortext = {
                strings: [
                    `I'm sorry, ${message.author.displayName}. I'm afraid I can't do that.`,
                    `Get a load of this guy, trying to use \`${args[1]}\` as a command.`,
                    `I'm sorry, I don't know the command \`${args[1]}\`. Why don't you ask for help?`,
                    `\`${args[1]}\`? Is this some sick kind of joke?`,
                    `What are you even saying`,
                    `I don't recognize \`${args[1]}\`. Maybe try something else?`,
                    `Command \`${args[1]}\` not found. Please check your spelling.`,
                    `Oops! \`${args[1]}\` isn't a valid command.`,
                    `Looks like \`${args[1]}\` isn't something I can do.`,
                    `Sorry, but \`${args[1]}\` doesn't seem to be a command I know.`,
                    `Hmm, \`${args[1]}\` doesn't ring a bell.`,
                    `Your free trial of WinRAR has expired. Please purchase a license to continue using \`${args[1]}\`.`,
                    `\`${args[1]}\` ain't no command I ever heard of. They speak English in \`${args[1]}\`?`,
                    `\`${args[1]}\`? I hardly knew her!`,
                ],
                emojis: [
                    "🤖",
                    "🤔",
                    "🤨",
                    "😒",
                    "a:joey:768835939493478400",
                    "a:deadass:1007451877476159578",
                    "a:deepthought:747542528135266345",
                    "a:asianoof:747545253896257585",
                    "a:bruhv:740278121718218906",
                    "a:cat:755949336877072425",
                    "a:coolstorybro:1010958995986587678",
                    "a:zamn:1010963288273723455",
                    "a:thefuq:741823376867197009",
                ],
            };
            await message.react(Stringy.flavorIt(flavortext.emojis));
            await message.reply(Stringy.flavorIt(flavortext.strings));
            return;
        }
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
