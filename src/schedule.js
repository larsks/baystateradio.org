const DAY_NAMES = {
  Mon: "Monday",
  Tue: "Tuesday",
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
  // Every day wildcard
  if (day === "*") return "Every day";

  // ISO date format: "2026-06-12"
  if (/^\d{4}-\d{2}-\d{2}$/.test(day)) {
    const [year, month, dayNum] = day.split("-").map(Number);
    const date = new Date(year, month - 1, dayNum);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  // Monthly ordinal: "1Mon", "2Tue", "-1Fri"
  if (/^-?\d/.test(day)) {
    const m = day.match(/^(-?\d+)(\w+)$/);
    const n = parseInt(m[1]);
    const abbr = m[2];
    const name = DAY_NAMES[abbr] ?? abbr;
    const ordinals = { 1: "First", 2: "Second", 3: "Third", 4: "Fourth", 5: "Fifth", [-1]: "Last" };
    const ordWord = ordinals[n] ?? `${n}th`;
    return `${ordWord} ${name} of every month`;
  }

  // N-weekly interval: "Tue/2", "Wed/3"
  if (/\/\d+$/.test(day)) {
    const m = day.match(/^(\w+)\/(\d+)$/);
    const abbr = m[1];
    const interval = parseInt(m[2]);
    const name = DAY_NAMES[abbr] ?? abbr;
    const intervalWords = { 2: "other", 3: "third", 4: "fourth", 5: "fifth" };
    const intWord = intervalWords[interval] ?? `every ${interval}th`;
    return `Every ${intWord} ${name}`;
  }

  // Comma-separated weekdays: "Mon", "Mon,Wed,Fri"
  const abbrs = day.split(",");
  const names = abbrs.map((a) => DAY_NAMES[a] ?? a);
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
}

export function formatEventDate(schedule) {
  if (!schedule) return "";
  const datePart = schedule.trim().split(" ")[0];
  const match = datePart.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return "";
  const [, year, month, day] = match;
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  const monthName = date.toLocaleString("en-US", { month: "long" });
  const weekday = date.toLocaleString("en-US", { weekday: "long" });
  return `${monthName} ${parseInt(day)} (${weekday})`;
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
