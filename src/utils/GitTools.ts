import { execSync } from "child_process";
import { HexColorString } from "discord.js";
import { LogX } from "./Logging.js";

// ===== Interfaces ============================================================

// Git commit metadata
export interface GitCommitMetadata {
    author: string;
    color: HexColorString;
    commit: string;
    date: Date;
    email: string;
    hash: string;
    head: string;
    message: string;
}

// ===== Functions =============================================================

/**
 * Gets the latest Git commit hash of the repository.
 * Note that this only grabs the latest commit ID of your locally cloned
 * repository, and not of mainline.
 *
 * @param short Whether the commit hash should be short (truncated) or long.
 * @returns The Git commit hash of the repository.
 */
export function getGitCommitHash(short: boolean = true): string {
    try {
        const command = short
            ? "git rev-parse --short HEAD"
            : "git rev-parse HEAD";
        const commitHash = execSync(command).toString().trim();
        return commitHash;
    } catch (error) {
        LogX.logW("Failed to get Git commit hash:", error);
        return "";
    }
}

/**
 * Gets the latest Git commit hash of the repository as a hex color.
 *
 * @returns The Git commit hash of the repository as a hex color.
 */
export function getGitCommitHashColor(latestCommit?: string): HexColorString {
    const commitHash = latestCommit ?? getGitCommitHash();
    if (commitHash.length === 0) {
        return "#000000";
    }

    // Cut the hash down to the first 6 characters
    const shortHash = commitHash.slice(0, 6);
    // Prepend a hash symbol to the hex color
    const color: HexColorString = `#${shortHash}`;
    return color;
}

/**
 * Gets the latest Git commit message and author of the repository.
 */
export function getGitCommitMetadata(): GitCommitMetadata {
    try {
        return {
            author: execSync("git log -1 --pretty=%an").toString().trim(),
            color: getGitCommitHashColor(getGitCommitHash()),
            commit: getGitCommitHash(false),
            date: new Date(
                execSync("git log -1 --pretty=%aI").toString().trim(),
            ),
            email: execSync("git log -1 --pretty=%ae").toString().trim(),
            hash: getGitCommitHash(),
            head: execSync("git rev-parse --abbrev-ref HEAD").toString().trim(),
            message: execSync("git log -1 --pretty=%B").toString().trim(),
        };
    } catch (error) {
        LogX.logW("Failed to get Git commit metadata:", error);
        return {
            author: "Unknown",
            color: "#000000",
            commit: "000000",
            date: new Date(),
            email: "unknown@email.com",
            hash: "0000000",
            head: "Unknown",
            message: "Couldn't fetch commit message",
        };
    }
}
