import { Message } from "discord.js";
import { ReactionCommand } from "../../extensions/Discord.js";
import { messageContainsAll } from "../../utils/Strings.js";
import UserConfig from "../../utils/UserConfig.js";

/**
 * Whenever Logan tries to buy a thing, complain.
 */
const reactionCommand: ReactionCommand = {
    name: "LoganBuy",
    description: "Complains at Logan whenever he wants to buy a thing.",
    checker: async (message: Message) => {
        const isHim = message.author.id === UserConfig.Logan.id;
        const isBuy = messageContainsAll(message.content, [
            "can|could|should I buy|get|purchase",
            "I can|could|should buy|get|purchase",
            "can|could|should buy|get|purchase",
        ]);
        return isHim && isBuy;
    },
    executable: async (message: Message) => {
        interface LoganBuyProbability {
            value: number;
            emoji: string | string[];
            msg: string;
        }
        const probabilities: { [key: string]: LoganBuyProbability } = {
            "Multiple Yes": {
                value: 0.02,
                emoji: ["💸", "a:husa:913575552999362571"],
                msg: "Not only should you buy that thing, you should get several.",
            },
            "Absolute Yes": {
                value: 0.04,
                emoji: "💯",
                msg: "Yes, you should definitely buy that thing. In fact, do it right now.",
            },
            Yes: {
                value: 0.14,
                emoji: "a:log:1295165873903894589",
                msg: "Yes, you should buy that thing.",
            },
            "Well Yes, But Actually No": {
                value: 0.2,
                emoji: "a:wellyesbutactuallyno:760342961769938964",
                msg: "You probably shouldn't buy that thing... But do it anyways.",
            },
            No: {
                value: 0.4,
                emoji: "🚫",
                msg: "No, you should not buy that thing.",
            },
            "Absolute No": {
                value: 0.15,
                emoji: [
                    "a:bruhv:740278121718218906",
                    "a:zamn:1010963288273723455",
                ],
                msg: "No. Of course not. Why would you even consider that?",
            },
            "The FINAL No": {
                value: 0.05,
                emoji: "a:hm:755886625833091132",
                msg: "You should kill yourself, NOW!",
            },
        };
        const randomRoll = Math.random();
        let probabilitySum = 0;

        // Iterate through the keys and react with the emoji, and reply the msg
        for (const key in probabilities) {
            probabilitySum += probabilities[key].value;
            if (randomRoll <= probabilitySum) {
                const { emoji, msg } = probabilities[key];
                if (Array.isArray(emoji)) {
                    for (const e of emoji) {
                        await message.react(e);
                    }
                } else await message.react(emoji);
                await message.reply(msg);
                break;
            }
        }
    },
};

export default reactionCommand;
