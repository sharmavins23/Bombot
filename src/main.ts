import { dirname, importx } from "@discordx/importer";
import type { Message } from "discord.js";
import { IntentsBitField } from "discord.js";
import { Client } from "discordx";
import "dotenv/config";

// ===== Configuration =========================================================

// Check if running in development environment or not
const args = process.argv.slice(2);
const isDev = args.includes("dev");

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
    silent: !isDev, // Enable debug logs when testing in development
    simpleCommand: {
        prefix: [`<@${process.env.BOT_CLIENT_ID}>`, "bombot,", "!"],
    },
});

// ===== OnEvent handlers ======================================================

// Ready handler
bot.once("ready", () => {
    // Synchronize any application commands with Discord API
    bot.initApplicationCommands();

    console.log("Bombot started!");
});

// Message handler
bot.on("messageCreate", (message: Message) => {
    bot.executeCommand(message);
});

// ===== Executables ===========================================================

// Run!
async function run() {
    await importx(`${dirname(import.meta.url)}/{events,commands}/**/*.ts`);

    // Handle the bot separately depending on dev vs prod
    // Start the bot
    if (!process.env.BOT_TOKEN) {
        throw Error("Could not find bot token in your environment!");
    }

    await bot.login(process.env.BOT_TOKEN);
}

run();
