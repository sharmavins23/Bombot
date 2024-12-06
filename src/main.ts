import { dirname, importx } from "@discordx/importer";
import chalk from "chalk";
import type { Message } from "discord.js";
import { IntentsBitField } from "discord.js";
import { Client } from "discordx";
import "dotenv/config";
import { getGitCommitHash } from "./utils/git.js";

// ===== Configuration =========================================================

// Check if running in development environment or not
const isDev = process.env.RUNTIME_ENV == "beta";

// Create a new bot
export const bot = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMessageReactions,
        IntentsBitField.Flags.GuildVoiceStates,
        IntentsBitField.Flags.MessageContent,
    ],
    silent: false, // Enable debug logs always
    simpleCommand: {
        prefix: [
            // Tag @bot
            `<@${process.env.BOT_CLIENT_ID}>`,
            // Different commands for beta or prod
            isDev ? "testbot," : "bombot,",
            // Simplified non-comma for lazy users
            isDev ? "testbot" : "bombot",
        ],
    },
});

// ===== OnEvent handlers ======================================================

// Ready handler
bot.once("ready", () => {
    // Synchronize any application commands with Discord API
    bot.initApplicationCommands();

    // Print out latest version
    console.log(chalk.green("Bombot started!"));
    console.log(`Latest deployment: ${chalk.cyan(getGitCommitHash())}`);
});

// Message handler
bot.on("messageCreate", (message: Message) => {
    // Handle any simple commands
    bot.executeCommand(message);
});

// ===== Executables ===========================================================

// Run!
async function run() {
    // Import all events and commands
    await importx(`${dirname(import.meta.url)}/{events,commands}/**/*.{ts,js}`);

    // Handle the bot separately depending on dev vs prod
    // Start the bot
    if (!process.env.BOT_TOKEN) {
        throw Error("Could not find bot token in your environment!");
    }

    await bot.login(process.env.BOT_TOKEN);
}

run();
