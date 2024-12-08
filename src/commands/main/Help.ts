import chalk from "chalk";
import { EmbedBuilder, Message } from "discord.js";
import { Command, MessageCommand } from "../../extensions/Discord.js";
import { LogX } from "../../utils/Logging.js";
import { Stringy } from "../../utils/Strings.js";

// Enum for command types
enum CommandType {
    MESSAGE = "💬",
    REACTION = "🔁",
}

// Extends Command to show types
interface HelpCommand extends Command {
    type: CommandType;
}

// Some random flavortext for the help command
const flavortext = {
    titles: [
        "Some commands, and what they do",
        "Here's what I can do",
        "I'm here to help!",
        "Need a hand?",
        "The Bombers Secret Society of Justice forever!",
        "My functionality is vast",
    ],
    calltoactions: [
        "here's some tips...",
        "here's some commands...",
        "you asked for help?",
        "you need some help?",
        "let me do it for you",
        "I'm here to help",
        "shouldn't you know these commands already?",
    ],
    commandspecific: [
        "Here's how you use",
        "Help for",
        "Here's a refresher on",
        "This is how you use",
        "Here's the syntax for",
    ],
};

function generateBaseHelpEmbed(message: Message): EmbedBuilder {
    return new EmbedBuilder()
        .setColor(message.member?.displayHexColor || "#FFFFFF")
        .setAuthor({
            name: `${message.author.displayName}, ${Stringy.flavorIt(flavortext.calltoactions)}`,
            iconURL: message.author.avatarURL() ?? undefined,
        })
        .setTimestamp()
        .setFooter({
            text: "Type `bombot help <command>` for more info",
        });
}

/**
 * Generates a help embed (or page of help embeds) for the user.
 *
 * @param message The message that triggered the help command.
 * @param commandsList The (cut-down) list of commands to display.
 * @param pageNumber The page number. Defaults to 1.
 * @param pageCount The total page count. Defaults to 1.
 * @returns
 */
function generateHelpEmbed(
    message: Message,
    commandsList: HelpCommand[],
    pageNumber: number = 1,
    pageCount: number = 1,
): EmbedBuilder {
    const helpEmbed = generateBaseHelpEmbed(message);
    helpEmbed.setTitle(Stringy.flavorIt(flavortext.titles));

    if (pageNumber > 1) {
        helpEmbed.setDescription(`Showing page ${pageNumber} of ${pageCount}`);
    }

    // For each command, create a field in the embed
    for (const command of commandsList) {
        if (command.type === CommandType.MESSAGE) {
            helpEmbed.addFields({
                name: `${command.type} bombot ${command.name} (in \`${command.group}\`)`,
                value: command.description,
            });
        } else if (command.type === CommandType.REACTION) {
            helpEmbed.addFields({
                name: `${command.type} ${command.name} (in \`${command.group}\`)`,
                value: command.description,
            });
        }
    }

    return helpEmbed;
}

/**
 * Generates a help embed for a specific command.
 *
 * @param message The message that triggered the help command
 * @param command The command to generate help for
 * @returns The help embed for the command
 */
function generateCommandHelpEmbed(
    message: Message,
    command: HelpCommand,
): EmbedBuilder {
    const helpEmbed = generateBaseHelpEmbed(message);
    helpEmbed.setTitle(`Help for ${command.name} ${command.type}`);

    // Generates different embeds for different command types
    if (command.type === CommandType.MESSAGE) {
        // Get the MessageCommand by searching through the Collection
        const messageCommand: MessageCommand =
            message.client.commands.message.find(
                (messageCommand: MessageCommand) => {
                    return messageCommand.name === command.name;
                },
            ) as MessageCommand;
        if (!messageCommand) {
            LogX.logW(`Could not find message command ${command.name}`);
            helpEmbed.addFields({
                name: `An error has occurred internally.`,
                value: `Please try again later, or contact one of the developers.`,
            });
            return helpEmbed;
        }

        helpEmbed.setDescription(
            `This is a ${CommandType.MESSAGE} Message command, so you need to call it yourself.`,
        );

        const usages: string[] = messageCommand.usage.map(
            (usage) => `• bombot \`${usage}\``,
        );

        helpEmbed.addFields(
            {
                name: `Bombot, ${messageCommand.name}`,
                value: messageCommand.description,
            },
            {
                name: "Usage",
                value: usages.join("\n"),
            },
        );

        if (messageCommand.detailed) {
            helpEmbed.addFields({
                name: "More details",
                value: messageCommand.detailed,
            });
        }
    } else if (command.type === CommandType.REACTION) {
        helpEmbed.setDescription(
            `This is a ${CommandType.REACTION} Reaction command, so it will automatically do things when it feels like it.`,
        );
        helpEmbed.addFields({
            name: `On ${command.name}:`,
            value: command.description,
        });
    } else {
        LogX.logW(`Unknown command type for command ${command.name}`);
    }

    return helpEmbed;
}

/**
 * The help command, in all its glory.
 */
const messageCommand: MessageCommand = {
    name: "Help",
    description: "Help me!",
    aliases: ["whst"],
    usage: ["help", "help <command>", "help <page>"],
    detailed:
        "Helpception! But did you really think I would expand on this command?",

    executable: async (message: Message) => {
        // Iterate through the commands and add them to the embed
        let commandsList: HelpCommand[] = [];
        for (const [, command] of message.client.commands.message) {
            commandsList.push({
                ...(command as Command),
                type: CommandType.MESSAGE,
            });
        }
        for (const [, command] of message.client.commands.reaction) {
            commandsList.push({
                ...(command as Command),
                type: CommandType.REACTION,
            });
        }

        // Page if >10 commands
        const areWeGoingToPage: boolean = commandsList.length > 10;
        const pageCount = Math.ceil(commandsList.length / 10);

        // Check what the user passed in as the message content
        const switcher: string = message.content.split(" ")[0];

        let helpEmbed;

        // If they passed in a command, show the help for that command
        if (
            commandsList.some(
                (command) =>
                    command.name.toLowerCase() === switcher.toLowerCase(),
            )
        ) {
            const searchedCommand = switcher;
            LogX.logD(`Help called for command ${chalk.cyan(searchedCommand)}`);

            helpEmbed = generateCommandHelpEmbed(
                message,
                commandsList.find(
                    (command) =>
                        command.name.toLowerCase() ===
                        searchedCommand.toLowerCase(),
                ) as HelpCommand,
            );
        }
        // If it's a number and we're going to page...
        else if (areWeGoingToPage && !isNaN(parseInt(switcher))) {
            const pageNumber = parseInt(switcher);
            LogX.logD(`Help called for page ${chalk.green(pageNumber)}`);

            // Slice commands to show the correct page
            commandsList = commandsList.slice(
                (pageNumber - 1) * 10,
                pageNumber * 10,
            );

            helpEmbed = generateHelpEmbed(
                message,
                commandsList,
                pageNumber,
                pageCount,
            );
        }
        // Otherwise, basic functionality
        else {
            if (areWeGoingToPage) {
                // Show the first 10 commands
                commandsList = commandsList.slice(0, 10);
            }

            helpEmbed = generateHelpEmbed(message, commandsList, 1, pageCount);
        }

        await message.reply({ embeds: [helpEmbed] });
    },
};

export default messageCommand;
