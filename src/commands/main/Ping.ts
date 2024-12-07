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
        let serverTripTime = end - start;
        let clientTripTime = pong.createdTimestamp - message.createdTimestamp;

        // Edit the message to include the round-trip time
        await pong.edit(
            `🏓 Pong! Connection times: 🌐 ${serverTripTime}ms, 👤 ${clientTripTime}ms`,
        );
    },
};

export default messageCommand;
