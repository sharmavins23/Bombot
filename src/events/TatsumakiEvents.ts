import chalk from "chalk";
import { Message } from "discord.js";
import type { ArgsOf } from "discordx";
import { Discord, On } from "discordx";
import userConfig from "../utils/userconfig.js";

@Discord()
export class TatsumakiEvents {
    notThem(message: Message) {
        return message.author.id != userConfig.Tatsumaki.id;
    }

    @On({ event: "messageCreate" })
    async anyMessage([message]: ArgsOf<"messageCreate">): Promise<void> {
        if (this.notThem(message)) return;

        console.log(chalk.yellow("Tatsumaki.anyMessage"), "reaction emitted!");
        message.reply("Please stop abusing your girlfriend!");
    }
}
