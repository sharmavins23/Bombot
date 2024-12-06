import type { SimpleCommandMessage } from "discordx";
import { Discord, SimpleCommand } from "discordx";
import { logOnFunctionCall } from "../../utils/logging.ts";

@Discord()
export class HelloWorld {
    @SimpleCommand({ aliases: ["hi"] })
    async helloWorld(command: SimpleCommandMessage): Promise<void> {
        logOnFunctionCall("helloWorld()", command);

        const member = command.message.member;
        if (member) {
            await command.message.reply(`👋 ${member.toString()}`);
        } else {
            await command.message.reply(`👋, internet stranger!`);
        }
    }
}
