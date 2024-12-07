import { execSync } from "child_process";

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
        console.error("Error getting Git commit hash:", error);
        return "";
    }
}
