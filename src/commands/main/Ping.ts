import { Message } from "discord.js";
import { MessageCommand } from "../../extensions/Discord.js";

/**
 * A simple command that says hello.
 */
const messageCommand: MessageCommand = {
    name: "Ping",
    description: "Pings the server, yielding a response.",
    aliases: ["p"],

    executable: async (message: Message) => {
        // Calculate the round-trip time
        let start = Date.now();
        let pong = await message.reply("🏓 Pong!");
        let end = Date.now();
        let roundTripTime = end - start;

        // Edit the message to include the round-trip time
        await pong.edit(`🏓 Pong! Round-trip time: ${roundTripTime}ms`);
    },
};

export default messageCommand;
