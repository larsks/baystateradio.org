const DAY_NAMES = {
  Mon: "Monday",
  Tues: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
  Sun: "Sunday",
};

function format12h(h, m) {
  const mm = String(m).padStart(2, "0");
  if (h === 0) return `12:${mm}am`;
  if (h < 12) return `${h}:${mm}am`;
  if (h === 12) return `12:${mm}pm`;
  return `${h - 12}:${mm}pm`;
}

function parseDuration(duration) {
  if (duration.endsWith("m")) {
    return parseInt(duration, 10);
  }
  if (duration.endsWith("h")) {
    return Math.round(parseFloat(duration) * 60);
  }
  throw new Error(`Unknown duration format: ${duration}`);
}

function addMinutes(h, m, minutes) {
  const total = h * 60 + m + minutes;
  return [Math.floor(total / 60) % 24, total % 60];
}

function formatDayPart(day) {
  if (day === "*") {
    return "Every day";
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(day)) {
    const [year, month, dayNum] = day.split("-").map(Number);
    const date = new Date(year, month - 1, dayNum);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }
  const abbrs = day.split(",");
  const names = abbrs.map((a) => DAY_NAMES[a] ?? a);
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
}

export function formatSchedule(input) {
  const [day, time, duration] = input.trim().split(" ");
  const [hStr, mStr] = time.split(":");
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  const minutes = parseDuration(duration);
  const [endH, endM] = addMinutes(h, m, minutes);
  const startStr = format12h(h, m);
  const endStr = format12h(endH, endM);
  const dayPart = formatDayPart(day);
  return `${dayPart} from ${startStr} to ${endStr}`;
}
