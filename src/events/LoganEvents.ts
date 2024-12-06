import chalk from "chalk";
import { Message } from "discord.js";
import type { ArgsOf } from "discordx";
import { Discord, On } from "discordx";
import { messageContainsAll } from "../utils/strings.js";
import userConfig from "../utils/userconfig.js";

@Discord()
export class LoganEvents {
    /**
     * Determines whether the message author is not this person.
     *
     * @param message The passed in message.
     * @returns Whether the message author is not this person.
     */
    notThem(message: Message) {
        return message.author.id != userConfig.Logan.id;
    }

    /**
     * Discourages Logan from buying something when he considers it openly.
     *
     * @param message The passed in message.
     */
    @On({ event: "messageCreate" })
    async replyDontBuy([message]: ArgsOf<"messageCreate">): Promise<void> {
        if (this.notThem(message)) return;

        if (messageContainsAll(message.content, ["should", "I", "buy|get"])) {
            console.log(
                chalk.yellow("LoganEvents.replyDontBuy"),
                "reaction emitted!",
            );
            message.reply("No, you should not buy that thing.");
        }
    }
}
