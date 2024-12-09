import chalk from "chalk";

/**
 * Wrapper for the log function.
 *
 * @param args Any arguments to log.
 */
export function log(...args: unknown[]) {
    console.log(...args);
}

/**
 * Logs a message with the DEBUG level.
 * DEBUG level logs are usually used for development purposes, and should
 * print out things like statistics, debug information, etc.
 *
 * @param args Any arguments to log.
 */
export function logD(...args: unknown[]) {
    console.log(chalk.gray("[DBG]"), ...args);
}

/**
 * Logs a message with the INFO level.
 * INFO level logs are used to notify the user of functionality.
 *
 * @param args Any arguments to log.
 */
export function logI(...args: unknown[]) {
    console.log(chalk.blueBright("[INF]"), ...args);
}

/**
 * Logs a message with the WARN level.
 * WARN level logs should be used to notify the user of potential issues.
 *
 * @param args Any arguments to log.
 */
export function logW(...args: unknown[]) {
    console.warn(chalk.yellowBright("[WRN]"), ...args);
}

/**
 * Logs a message with the ERROR level.
 *
 * @param args Any arguments to log.
 */
export function logE(...args: unknown[]) {
    console.error(chalk.redBright("[ERR]"), ...args);
}

/**
 * Computes an assertion.
 *
 * @param condition The condition to check.
 * @param message The error message to print if the condition fails.
 */
export function assert(condition: boolean, message: string): asserts condition {
    if (!condition) {
        // Quit the program entirely
        logE(message);
        process.exit(1);
    }
}
