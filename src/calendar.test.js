import { describe, it, expect } from "vitest";
import { netToVevent } from "./ical.js";
import { parseIcs, getNetsForMonth } from "./calendar.js";

const TZID = "America/New_York";
const FIXED_DTSTAMP = "20260101T000000Z";

const VTIMEZONE = `BEGIN:VTIMEZONE
TZID:America/New_York
BEGIN:DAYLIGHT
TZOFFSETFROM:-0500
TZOFFSETTO:-0400
TZNAME:EDT
DTSTART:19700308T020000
RRULE:FREQ=YEARLY;BYDAY=2SU;BYMONTH=3
END:DAYLIGHT
BEGIN:STANDARD
TZOFFSETFROM:-0400
TZOFFSETTO:-0500
TZNAME:EST
DTSTART:19701101T020000
RRULE:FREQ=YEARLY;BYDAY=1SU;BYMONTH=11
END:STANDARD
END:VTIMEZONE`;

function makeNet(overrides = {}) {
  return {
    fileSlug: overrides.fileSlug ?? "testnet",
    data: {
      title: "Test Net",
      schedule: "Thu 19:30 60m",
      frequency: "146.520 FM",
      url: "/nets/test/",
      ...overrides,
    },
  };
}

function buildIcs(nets) {
  const vevents = nets.map((net) => netToVevent(net, TZID, FIXED_DTSTAMP));
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//BayStateRadio//Net Schedule//EN",
    "CALSCALE:GREGORIAN",
    "X-WR-CALNAME:Bay State Radio Nets",
    `X-WR-TIMEZONE:${TZID}`,
    VTIMEZONE,
    ...vevents,
    "END:VCALENDAR",
  ].join("\r\n");
}

describe("parseIcs", () => {
  it("returns ICAL.Event objects for each VEVENT", () => {
    const ics = buildIcs([makeNet(), makeNet({ fileSlug: "net2", title: "Net Two", schedule: "Mon 20:00 30m" })]);
    const events = parseIcs(ics);
    expect(events).toHaveLength(2);
    expect(events.map((e) => e.summary)).toContain("Test Net");
    expect(events.map((e) => e.summary)).toContain("Net Two");
  });
});

describe("getNetsForMonth", () => {
  it("weekly event (Thu) appears on all Thursdays in a month", () => {
    // March 2026: Thursdays are 5, 12, 19, 26
    const events = parseIcs(buildIcs([makeNet({ schedule: "Thu 19:30 60m" })]));
    const dayMap = getNetsForMonth(events, 2026, 2); // March = month index 2
    expect(dayMap[5]).toHaveLength(1);
    expect(dayMap[12]).toHaveLength(1);
    expect(dayMap[19]).toHaveLength(1);
    expect(dayMap[26]).toHaveLength(1);
    // Non-Thursday should be empty
    expect(dayMap[1]).toHaveLength(0); // Sunday
    expect(dayMap[4]).toHaveLength(0); // Wednesday
  });

  it("weekly event carries correct title, time, url, frequency", () => {
    const events = parseIcs(buildIcs([makeNet({ schedule: "Thu 19:30 60m" })]));
    const dayMap = getNetsForMonth(events, 2026, 2);
    const evt = dayMap[5][0];
    expect(evt.title).toBe("Test Net");
    expect(evt.time).toBe("19:30");
    expect(evt.url).toBe("/net/testnet/");
    expect(evt.frequency).toBe("146.520 FM");
  });

  it("multi-day weekly event (Mon,Wed,Fri) appears on correct days", () => {
    const events = parseIcs(buildIcs([makeNet({ schedule: "Mon,Wed,Fri 18:00 60m" })]));
    // March 2026: Mon 2,9,16,23,30 / Wed 4,11,18,25 / Fri 6,13,20,27
    const dayMap = getNetsForMonth(events, 2026, 2);
    expect(dayMap[2]).toHaveLength(1);  // Monday
    expect(dayMap[4]).toHaveLength(1);  // Wednesday
    expect(dayMap[6]).toHaveLength(1);  // Friday
    expect(dayMap[3]).toHaveLength(0);  // Tuesday
    expect(dayMap[5]).toHaveLength(0);  // Thursday
  });

  it("daily event appears on every day of the month", () => {
    const events = parseIcs(buildIcs([makeNet({ schedule: "* 08:00 30m" })]));
    const dayMap = getNetsForMonth(events, 2026, 2);
    for (let d = 1; d <= 31; d++) {
      expect(dayMap[d]).toHaveLength(1);
    }
  });

  it("one-time event appears only on its date", () => {
    const events = parseIcs(buildIcs([makeNet({ schedule: "2026-03-15 12:00 30m" })]));
    const dayMap = getNetsForMonth(events, 2026, 2);
    expect(dayMap[15]).toHaveLength(1);
    for (let d = 1; d <= 31; d++) {
      if (d !== 15) expect(dayMap[d]).toHaveLength(0);
    }
  });

  it("one-time event in another month does not appear", () => {
    const events = parseIcs(buildIcs([makeNet({ schedule: "2026-06-12 12:00 30m" })]));
    const dayMap = getNetsForMonth(events, 2026, 2); // March
    for (let d = 1; d <= 31; d++) {
      expect(dayMap[d]).toHaveLength(0);
    }
  });

  it("events within a day are sorted by start time", () => {
    const nets = [
      makeNet({ fileSlug: "late", title: "Late Net", schedule: "Thu 21:00 30m" }),
      makeNet({ fileSlug: "early", title: "Early Net", schedule: "Thu 18:00 30m" }),
    ];
    const events = parseIcs(buildIcs(nets));
    const dayMap = getNetsForMonth(events, 2026, 2);
    const thu = dayMap[5];
    expect(thu).toHaveLength(2);
    expect(thu[0].time).toBe("18:00");
    expect(thu[1].time).toBe("21:00");
  });
});
