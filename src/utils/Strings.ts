// Valuable string formatting functions.
export class Stringy {
    /**
     * Check if a message contains any of the strings in a list.
     * Strings may be passed in either by themselves, or as options separated by a
     * pipe character.
     * E.g. "should I buy|get" will match if the message contains "should+I+buy" or
     * "should+I+get".
     * Order is not considered in this comparison.
     *
     * @param message Message content (string) passed in from Discord.
     * @param list A list of strings to check if the message contains all of them.
     * @returns True if the message contains all strings in the list, false
     * otherwise.
     */
    static messageContainsAll(message: string, list: string[]): boolean {
        return list.every((item) => {
            if (item.includes("|")) {
                const options = item.split("|");
                return options.some((option) =>
                    message.toLowerCase().includes(option.toLowerCase()),
                );
            } else {
                return message.toLowerCase().includes(item.toLowerCase());
            }
        });
    }

    /**
     * Gets a random flavortext from the list of flavortexts provided.
     * This function takes in a passed-in list of strings and simply randomly
     * selects one of them to return. As such, it can be used for a variety of
     * other purposes.
     *
     * @param texts A list of flavortexts.
     * @returns The (randomly) chosen flavortext.
     */
    static flavorIt(texts: string[]): string {
        return texts[Math.floor(Math.random() * texts.length)];
    }
}
