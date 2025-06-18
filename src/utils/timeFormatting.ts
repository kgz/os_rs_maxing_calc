
/**
 * Formats time in hours to a human-readable format
 * @param hours Total hours
 * @returns Formatted time string (e.g., "2d 5h" or "30m")
 */
export function formatTime(hours: number): string {
  if (hours === 0) return '0h';
  
  const days = Math.floor(hours / 24);
  const remainingHours = Math.floor(hours % 24);
  const minutes = Math.floor((hours * 60) % 60);
  
  if (days > 0) {
    return `${days}d ${remainingHours}h`;
  } else if (remainingHours > 0) {
    return minutes > 0 ? `${remainingHours}h ${minutes}m` : `${remainingHours}h`;
  } else {
    return `${minutes}m`;
  }
}
