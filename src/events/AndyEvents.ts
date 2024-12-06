import chalk from "chalk";
import { Message } from "discord.js";
import type { ArgsOf } from "discordx";
import { Discord, On } from "discordx";
import { messageContainsAll } from "../utils/strings.js";
import userConfig from "../utils/userconfig.js";

@Discord()
export class AndyEvents {
    notThem(message: Message) {
        return message.author.id != userConfig.Ed.id;
    }

    @On({ event: "messageCreate" })
    async reactRainbow([message]: ArgsOf<"messageCreate">): Promise<void> {
        if (this.notThem(message)) return;

        if (messageContainsAll(message.content, ["anal|ass|cock|dick|penis"])) {
            console.log(
                chalk.yellow("AndyEvents.reactRainbow"),
                "reaction emitted!",
            );
            await message.react("🏳️‍🌈");
        }
    }
}
