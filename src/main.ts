import { dirname, importx } from "@discordx/importer";
import type { Message } from "discord.js";
import { IntentsBitField } from "discord.js";
import { Client } from "discordx";
import "dotenv/config";

// ===== Configuration =========================================================

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
    silent: false, // Enable debug logs
    simpleCommand: {
        prefix: [
            `<@${process.env.BETA_BOT_CLIENT_ID}>`, // Beta testing bot prefix
            "bombot,",
            "!",
        ],
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
    await importx(`${dirname(import.meta.url)}/{events,commands}/**/*.{ts,js}`);

    // Start the bot
    if (!process.env.BETA_BOT_TOKEN) {
        throw Error("Could not find bot token in your environment!");
    }

    await bot.login(process.env.BETA_BOT_TOKEN);
}

run();
