import { logE } from "./Logging.js";

/**
 * Checks if a message matches a particular expression.
 *
 * Expressions are case-insensitive, and may contain spaces or pipe characters.
 *
 * Items in the string, separated by spaces, will be checked as "AND" statements
 * (i.e. all items must be present in the message) in that order.
 * E.g. "should I buy" will match if the message contains "should I buy", in
 * that order. Other items may be present in-between the strings.
 *
 * Items in the string, separated by pipe characters, will be checked as "OR"
 * statements (i.e. any item may be present in the message).
 * E.g. "should I buy|get" will match if the message contains "should I buy" or
 * "should I get".
 * E.g. "should I buy|get a thing" will match if the message contains "should I
 * buy" or "should I get", and "a thing".
 *
 * NOTE: It will also work with extensions. E.g.: "SHOULD I BUY" will work, but
 * "SHOULD I consider BUYing" will also work.
 *
 * @param message The message to check.
 * @param expr The expression to evaluate.
 */
export function messageContainsString(message: string, expr: string): boolean {
    // Lowercase both strings for case-insensitive comparison
    message = message.toLowerCase();
    expr = expr.toLowerCase();
    // Ensure that the expression only has alphanumeric + |
    if (/[^a-z0-9 |'"]/.test(expr))
        logE("Invalid expression passed into messageContainsString():", expr);

    // Split the message into words into a list
    const messageWords = message.split(/\s+/);

    // Split the expression into AND groups, separated by spaces and newlines
    const andGroups = expr.split(" ");

    // Each AND group MUST be present in the message, in order
    let currentIndex = 0;
    for (const andGroup of andGroups) {
        // Split the AND group into OR groups, separated by |
        const orGroups = andGroup.split("|");
        // Find the first OR group that is present in the message after the current index
        let found = false;
        for (const orGroup of orGroups) {
            const index = messageWords.indexOf(orGroup, currentIndex);
            if (index !== -1) {
                currentIndex = index + 1;
                found = true;
                break;
            }
        }
        // If no OR group is found, return false
        if (!found) return false;
    }

    return true;
}

/**
 * Check if a message contains any of the strings in a list.
 * Strings may be passed in either by themselves, or as a series of
 * expressions in the list.
 *
 * Items in the list will be checked as "OR" statements:
 * E.g. ["should I buy", "should I get"] will match if the message contains
 * either "should I buy" or "should I get" (or both).
 *
 * Items in the expressions will be checked as "AND" statements:
 * E.g. "should I buy" will match if the message contains "should+I+buy",
 * in that specific order.
 *
 * Expressions also support options separated by a pipe character:
 * E.g. "should I buy|get" will match if the message contains "should+I+buy"
 * or "should+I+get".
 * E.g. ["should I buy|get", "a thing"] will match if the message contains
 * "should+I+buy" or "should+I+get", and "a+thing". It can also match
 * sentences where "a thing" comes before "should I buy" or "should I get".
 *
 * @param message Message content (string) passed in from Discord.
 * @param list A list of strings to check if the message contains all of them.
 * @returns True if the message contains all strings in the list, false
 * otherwise.
 */
export function messageContainsAll(message: string, list: string[]): boolean {
    return list.some((expr) => messageContainsString(message, expr));
}
