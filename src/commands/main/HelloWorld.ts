import type { SimpleCommandMessage } from "discordx";
import { Discord, SimpleCommand } from "discordx";

@Discord()
export class HelloWorld {
    @SimpleCommand({ aliases: ["hi"] })
    async helloWorld(command: SimpleCommandMessage): Promise<void> {
        const member = command.message.member;
        if (member) {
            await command.message.reply(`👋 ${member.toString()}`);
        } else {
            await command.message.reply(`👋, internet stranger!`);
        }
    }
}
