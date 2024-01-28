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
}

/**
 * Method to format time in a human readable format. Accepts a number of seconds and returns a formatted string.
 *
 * @param seconds - number - Number of seconds to format
 * @returns `timeString` - string - Formatted Number string: mm:ss. If the Minutes are greater than 60, the string should be formatted as hh:mm.
 * */
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const minutesString = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const secondsString =
    remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;

  if (minutes > 60) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    const hoursString = hours < 10 ? `0${hours}` : `${hours}`;
    const remainingMinutesString =
      remainingMinutes < 10 ? `0${remainingMinutes}` : `${remainingMinutes}`;
    return `${hoursString}:${remainingMinutesString}`;
  }

  return `${minutesString}:${secondsString}`;
}

// Format a number to include commas
export function formatNumber(value: number): string {
  const userLocale = navigator.language;
  return new Intl.NumberFormat(userLocale).format(value);
}
