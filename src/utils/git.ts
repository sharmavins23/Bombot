import { execSync } from "child_process";

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
