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

/**
 * Method which lightens a Hex color by a given percentage. The percentage should be a number between 0 and 100.
 *
 * @param hex A Hex color String, e.g. '#FF0000'
 * @param percent A Numerical percentage value, e.g. 10
 * @returns A Hex color string that is lightened by the percentage value
 */
export function lightenHexColor(hex: string, percent: number): string {
  // Remove the '#' character if it exists
  hex = hex.replace(/^\s*#|\s*$/g, "");

  // Convert to RGB
  let r = parseInt(hex.substr(0, 2), 16);
  let g = parseInt(hex.substr(2, 2), 16);
  let b = parseInt(hex.substr(4, 2), 16);

  // Lighten
  r = Math.round(Math.min(255, Math.max(0, r + (255 - r) * (percent / 100))));
  g = Math.round(Math.min(255, Math.max(0, g + (255 - g) * (percent / 100))));
  b = Math.round(Math.min(255, Math.max(0, b + (255 - b) * (percent / 100))));

  // Convert back to hex
  return (
    "#" +
    ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
  );
}
