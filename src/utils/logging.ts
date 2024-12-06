import chalk from "chalk";
import { SimpleCommandMessage } from "discordx";

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
