import { Client, EmbedBuilder, TextChannel } from "discord.js";
import BombotConstants from "../Constants.js";
import ChannelConfig from "../utils/ChannelConfig.js";
import { getGitCommitMetadata } from "../utils/GitTools.js";
import { LogX } from "../utils/Logging.js";

export async function CreateDeploymentBlurb(client: Client) {
    const channel = client.channels.cache.get(
        ChannelConfig.brobotics.id,
    ) as TextChannel;
    if (channel) {
        const latestCommitMetadata = getGitCommitMetadata();
        const blurb = new EmbedBuilder()
            .setTitle(
                `${BombotConstants.BOT_NAME} successfully deployed and started up!`,
            )
            .setColor(latestCommitMetadata.color)
            .setURL("https://github.com/sharmavins23/Bombot")
            .setAuthor({
                name: latestCommitMetadata.author,
                iconURL: `https://github.com/${latestCommitMetadata.author}.png`,
            })
            .setTimestamp(latestCommitMetadata.date)
            .setDescription(
                `Deployed in \`${BombotConstants.RUNTIME_ENV}\` environment.`,
            )
            .addFields({
                name: `\`HEAD\` -> \`${latestCommitMetadata.head}\``,
                value: `[\`${latestCommitMetadata.hash}\`](https://github.com/sharmavins23/Bombot/commit/${latestCommitMetadata.commit}) ${latestCommitMetadata.message} ([tree](https://github.com/sharmavins23/Bombot/tree/${latestCommitMetadata.head}))`,
            })
            .setFooter({
                text: "Last commit at:",
                iconURL:
                    "https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png",
            });

        await channel.send({
            embeds: [blurb],
        });
    } else {
        LogX.logE(
            `Could not find channel with ID ${ChannelConfig.brobotics.id}.`,
        );
    }
}
