import chalk from "chalk";
import type { ArgsOf } from "discordx";
import { Discord, On } from "discordx";

@Discord()
export class GenericEvents {
    @On({ event: "messageCreate" })
    async willPOG([message]: ArgsOf<"messageCreate">): Promise<void> {
        if (message.content.toLowerCase().includes("pog")) {
            console.log(
                chalk.yellow("GenericEvents.willPOG"),
                "reaction emitted!",
            );
            message.react("a:WillPOG:918323637398941716");
        }
    }
}
