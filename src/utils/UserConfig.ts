import { Snowflake } from "discord.js";

// Type definition for a configured user
interface UserConfiguration {
    authorized: boolean;
    id: Snowflake;
    isBot: boolean;
    name: string;
    nick: string;
}

/**
 * Consolidates all user configurations into a single object.
 */
const UserConfig: { [key: string]: UserConfiguration } = {
    Andy: {
        authorized: false,
        id: "230889641073573889",
        isBot: false,
        name: "totalpwnage15",
        nick: "Andy",
    },
    Curtis: {
        authorized: true,
        id: "271732817740693505",
        isBot: false,
        name: "viral089",
        nick: "Curtis",
    },
    Ed: {
        authorized: true,
        id: "212318224342056961",
        isBot: false,
        name: "blackisdevin",
        nick: "Ed",
    },
    Logan: {
        authorized: false,
        id: "328330822962905088",
        isBot: false,
        name: "the_outlanderl",
        nick: "Logan",
    },
    Tatsumaki: {
        authorized: false,
        id: "172002275412279296",
        isBot: true,
        name: "Tatsu#8792",
        nick: "Tatsumaki",
    },
    Vins: {
        authorized: true,
        id: "236964881213947914",
        isBot: false,
        name: "vins",
        nick: "Vins",
    },
};

export default UserConfig;
