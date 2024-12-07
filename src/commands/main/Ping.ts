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
        const start = Date.now();
        const pong = await message.reply("🏓 Pong!");
        const end = Date.now();
        const serverTripTime = end - start;
        const clientTripTime = pong.createdTimestamp - message.createdTimestamp;

        // Edit the message to include the round-trip time
        await pong.edit(
            `🏓 Pong! Connection times: 🌐 ${serverTripTime}ms, 👤 ${clientTripTime}ms`,
        );
    },
};

export default messageCommand;
