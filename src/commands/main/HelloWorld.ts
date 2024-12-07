import { Message } from "discord.js";
import { MessageCommand } from "../../extensions/Discord.js";
import { LogX } from "../../utils/Logging.js";

/**
 * A simple command that says hello.
 */
const messageCommand: MessageCommand = {
    name: "HelloWorld",
    description: "Says hello!",
    aliases: ["hello", "hi", "hey"],

    executable: async (message: Message) => {
        const member = message.member;
        if (member) await message.reply(`👋 ${member.toString()}!`);
        else {
            LogX.logW(`Could not find member in message ${message.id}.`);
            await message.reply("👋, random stranger!");
        }
    },
};

export default messageCommand;
