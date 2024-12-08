import chalk from "chalk";
import { Client, Collection, GatewayIntentBits, Message } from "discord.js";
import "dotenv/config";
import BombotConstants, { Environments } from "./Constants.js";
import "./extensions/Discord.js";
import { CreateDeploymentBlurb } from "./handlers/DeploymentBlurbHandler.js";
import { GammaHandler } from "./handlers/GammaHandler.js";
import {
    HandleMessageCommands,
    RegisterMessageCommands,
} from "./handlers/HandleMessageCommands.js";
import {
    HandleReactionCommands,
    RegisterReactionCommands,
} from "./handlers/HandleReactionCommands.js";
import ChannelConfig from "./utils/ChannelConfig.js";
import { getGitCommitHash } from "./utils/GitTools.js";
import { LogX } from "./utils/Logging.js";

// ===== Configuration =========================================================

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
    await RegisterMessageCommands(client);
    await RegisterReactionCommands(client);

    // Send a message in the #brobotics channel once online
    CreateDeploymentBlurb(client);

    // For Gamma testing, we can stop here
    GammaHandler();
});

// Message handler
client.on("messageCreate", async (message: Message) => {
    // If not in prod, limit responses to the #brobotics channel only
    if (
        BombotConstants.RUNTIME_ENV !== Environments.prod &&
        message.channel.id !== ChannelConfig.brobotics.id
    ) {
        return;
    }

    // Handle message commands
    HandleMessageCommands(client, message);
    HandleReactionCommands(client, message);
});

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

    LogX.log(
        `${BombotConstants.BOT_NAME} is now succesfully`,
        chalk.green("logged in") + "!",
    );
    LogX.logD(`Latest deployment: ${chalk.cyan(getGitCommitHash())}`);
}

run();
