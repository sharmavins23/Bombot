// ===== Type definitions ======================================================

// Possible runtime environments for the bot
export enum Environments {
    beta = "beta", // Development
    gamma = "gamma", // Testing (CI/CD)
    prod = "prod", // Production environment
}

// ===== Constants =============================================================

// Current runtime environment
const currentRuntimeEnvironment: Environments =
    (process.env.RUNTIME_ENV as Environments) ?? Environments.beta;

// Name of the bot - Used for logging and identification
let botName: string = "";
switch (currentRuntimeEnvironment) {
    case Environments.beta:
        botName = "Betabot";
        break;
    case Environments.gamma:
        botName = "Gammabot";
        break;
    case Environments.prod:
        botName = "Bombot";
        break;
}

// Prefixes the bot may use for commands
const prefixes: string[] = [botName, `${botName},`];

// ===== Exports ===============================================================

// Formulate and return all constants
const BombotConstants = {
    RUNTIME_ENV: currentRuntimeEnvironment,
    BOT_NAME: botName,
    PREFIXES: prefixes,
};

export default BombotConstants;
