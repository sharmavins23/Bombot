import chalk from "chalk";
import type { SimpleCommandMessage } from "discordx";

/**
 * Emits a log to the console upon each and every individual function call.
 *
 * @param functionName The name of the calling function.
 * @param command The command, used to isolate metadata.
 */
export function logOnFunctionCall(
    functionName: string,
    command: SimpleCommandMessage,
) {
    const member = command.message.member;
    if (member) {
        console.log(
            `User ${chalk.cyan(member.user.username)} executed command ${chalk.magenta(functionName)}`,
        );
    } else {
        console.log(
            chalk.red("WARNING!"),
            `An unknown user executed command ${chalk.magenta(functionName)}`,
        );
    }
}
