/**
 * Utility to strip markdown bold asterisks (**) and bullet asterisks (*) from text
 * ensuring customer replies are clean, natural text suitable for direct copy-pasting to Facebook/Messenger.
 */
export function removeMarkdownAsterisks(text: string | undefined | null): string {
  if (!text) return '';
  return text
    // Replace bold markdown **text** or ***text*** with just text
    .replace(/\*{2,3}([^*]+)\*{2,3}/g, '$1')
    // Remove standalone ** or *
    .replace(/\*{1,3}/g, '')
    // Clean up any double spaces introduced
    .replace(/ {2,}/g, ' ')
    .trim();
}
