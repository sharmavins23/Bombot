import chalk from "chalk";
import { Message } from "discord.js";
import type { ArgsOf } from "discordx";
import { Discord, On } from "discordx";
import { messageContainsAll } from "../utils/strings.js";
import userConfig from "../utils/userconfig.js";

@Discord()
export class AndyEvents {
    /**
     * Determines whether the message author is not this person.
     *
     * @param message The passed in message.
     * @returns Whether the message author is not this person.
     */
    notThem(message: Message) {
        return message.author.id === userConfig.Andy.id;
    }

    /**
     * Reacts with a rainbow flag emoji to a message containing any of the words listed below.
     * This function is a bit raunchy. Sorry.
     *
     * @param message The passed in message.
     */
    @On({ event: "messageCreate" })
    async reactRainbow([message]: ArgsOf<"messageCreate">): Promise<void> {
        if (this.notThem(message)) return;

        // TODO: match whole-word as opposed to substring, i.e. not reaction to "canal"
        if (messageContainsAll(message.content, ["anal|ass|balls|cock|dick|gay|penis"])) {
            console.log(
                chalk.yellow("AndyEvents.reactRainbow"),
                "reaction emitted!",
            );
            await message.react(":a:notvanilla:1216448770657615873")
            await message.react("🏳️‍🌈");
        }
    }
}
