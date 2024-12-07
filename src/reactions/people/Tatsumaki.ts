import { Message } from "discord.js";
import { ReactionCommand } from "../../extensions/Discord.js";
import UserConfig from "../../utils/UserConfig.js";

/**
 * Whenever Tatsumaki sends a message, complain.
 */
const reactionCommand: ReactionCommand = {
    name: "Tatsumaki",
    description: "Complains at Tatsumaki whenever she sends a message.",
    message: "Please stop abusing your girlfriend!",
    checker: async (message: Message) => {
        return message.author.id === UserConfig.Tatsumaki.id;
    },
    executable: async (message: Message) => {},
};

export default reactionCommand;
