import { Message } from "discord.js";
import { ReactionCommand } from "../../extensions/Discord.js";
import { Stringy } from "../../utils/Strings.js";
import UserConfig from "../../utils/UserConfig.js";

/**
 * Whenever Andy sends something a little raunchy, respond in kind.
 */
const reactionCommand: ReactionCommand = {
    name: "AndyRainbow",
    description: "Reacts with 🏳️‍🌈 whenever Andy gets a little quirky.",
    emoji: ["🏳️‍🌈", ":a:notvanilla:1216448770657615873"],
    checker: async (message: Message) => {
        let isHim = message.author.id === UserConfig.Andy.id;
        let isRaunchy = Stringy.messageContainsAll(message.content, [
            "anal|ass|cock|dick|penis",
        ]);
        return isHim && isRaunchy;
    },
    executable: async (message: Message) => {},
};

export default reactionCommand;
