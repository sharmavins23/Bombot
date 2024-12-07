import chalk from "chalk";

// Enhanced logging client.
export class LogX {
    /**
     * Wrapper for the log function.
     *
     * @param args Any arguments to log.
     */
    static log(...args: any[]) {
        console.log(...args);
    }

    /**
     * Logs a message with the DEBUG level.
     * DEBUG level logs are usually used for development purposes, and should
     * print out things like statistics, debug information, etc.
     *
     * @param args Any arguments to log.
     */
    static logD(...args: any[]) {
        console.log(chalk.gray("[DBG]"), ...args);
    }

    /**
     * Logs a message with the INFO level.
     * INFO level logs are used to notify the user of functionality.
     *
     * @param args Any arguments to log.
     */
    static logI(...args: any[]) {
        console.log(chalk.blueBright("[INF]"), ...args);
    }

    /**
     * Logs a message with the WARN level.
     * WARN level logs should be used to notify the user of potential issues.
     *
     * @param args Any arguments to log.
     */
    static logW(...args: any[]) {
        console.warn(chalk.yellowBright("[WRN]"), ...args);
    }

    /**
     * Logs a message with the ERROR level.
     *
     * @param args Any arguments to log.
     */
    static logE(...args: any[]) {
        console.error(chalk.redBright("[ERR]"), ...args);
    }

    /**
     * Computes an assertion.
     *
     * @param condition The condition to check.
     * @param message The error message to print if the condition fails.
     */
    static assert(condition: boolean, message: string): asserts condition {
        if (!condition) {
            // Quit the program entirely
            this.logE(message);
            process.exit(1);
        }
    }
}
