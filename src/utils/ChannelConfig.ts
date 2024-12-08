import { ChannelType, Snowflake } from "discord.js";

interface ChannelConfiguration {
    id: Snowflake;
    type: ChannelType;
}

/**
 * Consolidates all channel configurations into a single object.
 * Ordered according to Discord server.
 */
const ChannelConfig: { [key: string]: ChannelConfiguration } = {
    brobotics: {
        id: "883740406469234718",
        type: ChannelType.GuildText,
    },
};

export default ChannelConfig;
