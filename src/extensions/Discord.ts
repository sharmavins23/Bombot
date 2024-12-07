import { Collection, Message } from "discord.js";

/**
 * Represents a command that can be executed by the bot.
 */
export interface Command {
    name: string; // Name of the command
    description: string; // Short description of the command
    group?: string; // Automatically calculated - DO NOT SET
    executable: (message: Message) => void; // Function to execute the command
}

/**
 * Represents a message command that can be executed by the bot.
 */
export interface MessageCommand extends Command {
    aliases?: string[]; // Other names the command can be called by
}

/**
 * Represents a reaction command that can be executed by the bot.
 */
export interface ReactionCommand extends Command {
    emoji?: string | string[]; // Any emoji(s) the command will react with
    message?: string; // The message the command will respond with
}

/**
 * Overrides the default Discord.js Client to include command collections.
 */
declare module "discord.js" {
    interface Client {
        commands: {
            message: Collection<string, MessageCommand>;
            reaction: Collection<string, ReactionCommand>;
        };
    }
}
