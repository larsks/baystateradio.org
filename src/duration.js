export function parseDuration(duration) {
  if (duration.endsWith("m")) {
    return parseInt(duration, 10);
  }
  if (duration.endsWith("h")) {
    return Math.round(parseFloat(duration) * 60);
  }
  throw new Error(`Unknown duration format: ${duration}`);
}
