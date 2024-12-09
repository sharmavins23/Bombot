/**
 * Picks a random thing from a list of things.
 *
 * @param things Things to pick from.
 * @returns A singular picked thing, picked randomly.
 */
export function pickRandom<Type>(things: Type[]): Type {
    return things[Math.floor(Math.random() * things.length)];
}

/**
 * Picks a random thing (or n random things) from a list of things.
 * Will (guaranteed) never pick the same thing twice.
 * If n > things.length, the entire list (shuffled) will be returned.
 *
 * @param things Things to pick from.
 * @param n The number of things to pick (default 1).
 * @returns A list of picked things, picked in a random order.
 */
export function pickNRandom<Type>(things: Type[], n: number = 1): Type[] {
    // Shortcut - if n is 1, just return a single random thing
    if (n === 1) return [pickRandom(things)];

    // Otherwise, we can randomly shuffle the list, then pick the first n
    const shuffled = things.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, n);
}
