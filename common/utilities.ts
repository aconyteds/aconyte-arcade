
/**
 * 
 * Method to shuffle an array, does not mutate the original array.
 * 
 * @param array An array of any type
 * @returns a shallow copy of the array with the elements shuffled
 */
export function shuffle<T>(array: T[]): T[] {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }

    return copy;
};