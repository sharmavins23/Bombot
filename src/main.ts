import chalk from "chalk";
import { Client, GatewayIntentBits } from "discord.js";
import "dotenv/config";
import { getGitCommitHash } from "./utils/Git.js";
import { LogX } from "./utils/Logging.js";

// ===== Configuration =========================================================

export enum Environments {
    beta = "beta",
    gamma = "gamma",
    prod = "prod",
}

// Handle runtime environment
export const currentRuntimeEnvironment: Environments =
    (process.env.RUNTIME_ENV as Environments) ?? Environments.beta;
export const botName =
    currentRuntimeEnvironment == Environments.prod ? "Bombot" : "Testbot";

// Create a new bot
const client = new Client({
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
client.once("ready", () => {});

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

    // For Gamma testing, we can stop here
    if (currentRuntimeEnvironment === Environments.gamma) {
        LogX.log(
            `${botName} is running in ${chalk.yellow(
                currentRuntimeEnvironment,
            )} environment. Stopping here.`,
        );
        process.exit(0);
    }
}

run();
