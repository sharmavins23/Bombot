import chalk from "chalk";
import BombotConstants, { Environments } from "../Constants.js";
import { logI } from "../utils/Logging.js";

export async function GammaHandler() {
    if (BombotConstants.RUNTIME_ENV === Environments.gamma) {
        logI(
            `${BombotConstants.BOT_NAME} is successfully running in ${chalk.yellow(
                BombotConstants.RUNTIME_ENV,
            )} environment. Stopping here.`,
        );
        process.exit(0);
    }
}
