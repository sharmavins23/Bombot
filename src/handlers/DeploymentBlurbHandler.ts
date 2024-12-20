import { Client, EmbedBuilder, TextChannel } from "discord.js";
import BombotConstants from "../Constants.js";
import ChannelConfig from "../utils/ChannelConfig.js";
import { getGitCommitMetadata } from "../utils/GitTools.js";
import { logE } from "../utils/Logging.js";

/**
 * Creates a deployment blurb and sends it to the bot testing channel.
 *
 * @param client The Discord client
 */
export async function CreateDeploymentBlurb(client: Client) {
    // Only send in the proper channel
    const channel = client.channels.cache.get(
        ChannelConfig.brobotics.id,
    ) as TextChannel;
    if (!channel)
        logE(`Could not find channel with ID ${ChannelConfig.brobotics.id}.`);

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
}
