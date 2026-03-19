const DAYS = {
  Mon: { byday: "MO", dayOfWeek: 1 },
  Tue: { byday: "TU", dayOfWeek: 2 },
  Tues: { byday: "TU", dayOfWeek: 2 },
  Wed: { byday: "WE", dayOfWeek: 3 },
  Thu: { byday: "TH", dayOfWeek: 4 },
  Fri: { byday: "FR", dayOfWeek: 5 },
  Sat: { byday: "SA", dayOfWeek: 6 },
  Sun: { byday: "SU", dayOfWeek: 0 },
};

// Fixed anchor date for stable DTSTART across builds (2026-01-01 is a Thursday)
const ANCHOR = new Date(2026, 0, 1);

export function parseDuration(duration) {
  if (duration.endsWith("m")) {
    return parseInt(duration, 10);
  }
  if (duration.endsWith("h")) {
    return Math.round(parseFloat(duration) * 60);
  }
  throw new Error(`Unknown duration format: ${duration}`);
}

export function foldLine(line) {
  if (line.length <= 75) return line;
  let result = line.slice(0, 75);
  let remaining = line.slice(75);
  while (remaining.length > 0) {
    result += "\r\n " + remaining.slice(0, 74);
    remaining = remaining.slice(74);
  }
  return result;
}

export function formatIcalDateTime(year, month, day, hour, minute) {
  return (
    String(year).padStart(4, "0") +
    String(month).padStart(2, "0") +
    String(day).padStart(2, "0") +
    "T" +
    String(hour).padStart(2, "0") +
    String(minute).padStart(2, "0") +
    "00"
  );
}

export function formatDuration(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0 && m > 0) return `PT${h}H${m}M`;
  if (h > 0) return `PT${h}H`;
  return `PT${m}M`;
}

function findFirstOccurrence(days) {
  const anchorDow = ANCHOR.getDay();
  let minOffset = 7;
  for (const day of days) {
    const target = DAYS[day].dayOfWeek;
    const offset = (target - anchorDow + 7) % 7;
    if (offset < minOffset) minOffset = offset;
  }
  const date = new Date(ANCHOR);
  date.setDate(date.getDate() + minOffset);
  return date;
}

function findMonthlyOrdinalStart(n, dayAbbr) {
  const target = DAYS[dayAbbr].dayOfWeek;
  const year = ANCHOR.getFullYear();
  const month = ANCHOR.getMonth();
  if (n > 0) {
    const dow = new Date(year, month, 1).getDay();
    const offset = (target - dow + 7) % 7;
    return new Date(year, month, 1 + offset + (n - 1) * 7);
  } else {
    const last = new Date(year, month + 1, 0);
    const offset = (last.getDay() - target + 7) % 7;
    return new Date(year, month, last.getDate() - offset + (n + 1) * 7);
  }
}

export function netToVevent(net, tzid, dtstamp) {
  const { title, schedule, frequency, url } = net.data;
  const [dayPart, time, durationStr] = schedule.trim().split(" ");
  const [hStr, mStr] = time.split(":");
  const hour = parseInt(hStr, 10);
  const minute = parseInt(mStr, 10);
  const durationMins = parseDuration(durationStr);

  let dtstart;
  let rrule = null;

  if (/^\d{4}-\d{2}-\d{2}$/.test(dayPart)) {
    const [year, month, day] = dayPart.split("-").map(Number);
    dtstart = formatIcalDateTime(year, month, day, hour, minute);
  } else if (dayPart === "*") {
    const d = ANCHOR;
    dtstart = formatIcalDateTime(
      d.getFullYear(),
      d.getMonth() + 1,
      d.getDate(),
      hour,
      minute,
    );
    rrule = "RRULE:FREQ=DAILY";
  } else if (/^-?\d/.test(dayPart)) {
    // Monthly ordinal: "1Mon", "2Tue", "-1Fri"
    const m = dayPart.match(/^(-?\d+)(\w+)$/);
    const n = parseInt(m[1]);
    const abbr = m[2];
    const startDate = findMonthlyOrdinalStart(n, abbr);
    dtstart = formatIcalDateTime(startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate(), hour, minute);
    rrule = `RRULE:FREQ=MONTHLY;BYDAY=${n}${DAYS[abbr].byday}`;
  } else if (/\/\d+$/.test(dayPart)) {
    // N-weekly interval: "Tue/2", "Wed/3"
    const m = dayPart.match(/^(\w+)\/(\d+)$/);
    const abbr = m[1];
    const interval = parseInt(m[2]);
    const firstDate = findFirstOccurrence([abbr]);
    dtstart = formatIcalDateTime(firstDate.getFullYear(), firstDate.getMonth() + 1, firstDate.getDate(), hour, minute);
    rrule = `RRULE:FREQ=WEEKLY;INTERVAL=${interval};BYDAY=${DAYS[abbr].byday}`;
  } else {
    const days = dayPart.split(",");
    const firstDate = findFirstOccurrence(days);
    dtstart = formatIcalDateTime(
      firstDate.getFullYear(),
      firstDate.getMonth() + 1,
      firstDate.getDate(),
      hour,
      minute,
    );
    const byday = days.map((d) => DAYS[d].byday).join(",");
    rrule = `RRULE:FREQ=WEEKLY;BYDAY=${byday}`;
  }

  const lines = [
    "BEGIN:VEVENT",
    `UID:${net.fileSlug}@baystateradio.org`,
    `DTSTAMP:${dtstamp}`,
    `SUMMARY:${title}`,
    `DTSTART;TZID=${tzid}:${dtstart}`,
    `DURATION:${formatDuration(durationMins)}`,
  ];
  if (rrule) lines.push(rrule);
  if (frequency) lines.push(`DESCRIPTION:${frequency}`);
  if (url) lines.push(`URL:${url}`);
  lines.push("END:VEVENT");

  return lines.map(foldLine).join("\r\n");
}
