import { Message } from "discord.js";
import { ReactionCommand } from "../../extensions/Discord.js";
import { messageContainsAll } from "../../utils/Strings.js";
import UserConfig from "../../utils/UserConfig.js";

/**
 * Whenever Andy sends something a little raunchy, respond in kind.
 */
const reactionCommand: ReactionCommand = {
    name: "AndyRainbow",
    description: "Reacts with 🏳️‍🌈 whenever Andy gets a little quirky.",
    emoji: ["🏳️‍🌈", ":a:notvanilla:1216448770657615873"],
    checker: async (message: Message) => {
        const isHim = message.author.id === UserConfig.Andy.id;
        const raunchyWords = "anal|ass|balls|cock|dick|penis|schlong|shaft";
        const isRaunchy = messageContainsAll(message.content, [
            raunchyWords,
            "suck|sucking " + raunchyWords,
            "i'm|im gay",
            "i am gay",
        ]);
        return isHim && isRaunchy;
    },
    executable: async () => {},
};

export default reactionCommand;
