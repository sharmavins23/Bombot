import { Message } from "discord.js";
import { ReactionCommand } from "../../extensions/Discord.js";

/**
 * Whenever a message contains "pog", reply with WillPOG.
 */
const reactionCommand: ReactionCommand = {
    name: "WillPog",
    description: "Reacts with WillPOG whenever a message contains 'pog'.",
    emoji: "a:WillPOG:918323637398941716",
    checker: async (message: Message) => {
        return message.content.toLowerCase().includes("pog");
    },
    executable: async () => {},
};

export default reactionCommand;
