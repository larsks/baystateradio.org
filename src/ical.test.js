import { describe, it, expect } from "vitest";
import ICAL from "ical.js";
import { netToVevent, formatDuration, foldLine, formatIcalDateTime } from "./ical.js";

const FIXED_DTSTAMP = "20260101T000000Z";
const TZID = "America/New_York";

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
    fileSlug: "testnet",
    data: {
      title: "Test Net",
      schedule: "Thu 19:30 60m",
      frequency: "146.520 FM",
      ...overrides,
    },
  };
}

function buildFullCalendar(nets) {
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

describe("formatIcalDateTime", () => {
  it("formats a date/time correctly", () => {
    expect(formatIcalDateTime(2026, 1, 1, 19, 30)).toBe("20260101T193000");
  });
  it("pads single-digit values", () => {
    expect(formatIcalDateTime(2026, 6, 5, 8, 5)).toBe("20260605T080500");
  });
});

describe("formatDuration", () => {
  it("formats whole hours", () => {
    expect(formatDuration(60)).toBe("PT1H");
  });
  it("formats minutes only", () => {
    expect(formatDuration(30)).toBe("PT30M");
  });
  it("formats hours and minutes", () => {
    expect(formatDuration(90)).toBe("PT1H30M");
  });
});

describe("foldLine", () => {
  it("leaves short lines unchanged", () => {
    const short = "SUMMARY:Test";
    expect(foldLine(short)).toBe(short);
  });
  it("folds lines longer than 75 chars", () => {
    const long = "X-LONGPROP:" + "A".repeat(70);
    const folded = foldLine(long);
    const parts = folded.split("\r\n ");
    expect(parts[0].length).toBe(75);
    expect(parts[1].length).toBeLessThanOrEqual(74);
  });
});

describe("netToVevent", () => {
  it("single weekday (Thu) → correct DTSTART and RRULE", () => {
    const net = makeNet({ schedule: "Thu 19:30 60m" });
    const vevent = netToVevent(net, TZID, FIXED_DTSTAMP);
    // 2026-01-01 is a Thursday, so DTSTART should be 20260101
    expect(vevent).toContain("DTSTART;TZID=America/New_York:20260101T193000");
    expect(vevent).toContain("RRULE:FREQ=WEEKLY;BYDAY=TH");
    expect(vevent).toContain("DURATION:PT1H");
  });

  it("multiple weekdays (Mon,Wed,Fri) → correct RRULE and earliest DTSTART", () => {
    const net = makeNet({ schedule: "Mon,Wed,Fri 18:00 60m" });
    const vevent = netToVevent(net, TZID, FIXED_DTSTAMP);
    // Anchor is 2026-01-01 (Thu). Next of Mon/Wed/Fri is Fri Jan 2.
    expect(vevent).toContain("DTSTART;TZID=America/New_York:20260102T180000");
    expect(vevent).toContain("RRULE:FREQ=WEEKLY;BYDAY=MO,WE,FR");
  });

  it("daily (*) → RRULE:FREQ=DAILY", () => {
    const net = makeNet({ schedule: "* 20:00 60m" });
    const vevent = netToVevent(net, TZID, FIXED_DTSTAMP);
    expect(vevent).toContain("DTSTART;TZID=America/New_York:20260101T200000");
    expect(vevent).toContain("RRULE:FREQ=DAILY");
  });

  it("ISO date → no RRULE, correct DTSTART", () => {
    const net = makeNet({ schedule: "2026-06-12 12:00 30m" });
    const vevent = netToVevent(net, TZID, FIXED_DTSTAMP);
    expect(vevent).toContain("DTSTART;TZID=America/New_York:20260612T120000");
    expect(vevent).toContain("DURATION:PT30M");
    expect(vevent).not.toContain("RRULE");
  });

  it("URL field present → URL line included", () => {
    const net = makeNet({ url: "https://example.com/net" });
    const vevent = netToVevent(net, TZID, FIXED_DTSTAMP);
    expect(vevent).toContain("URL:https://example.com/net");
  });

  it("no URL field → no URL line", () => {
    const net = makeNet();
    const vevent = netToVevent(net, TZID, FIXED_DTSTAMP);
    expect(vevent).not.toContain("URL:");
  });

  it("contains UID, SUMMARY, BEGIN:VEVENT, END:VEVENT", () => {
    const net = makeNet();
    const vevent = netToVevent(net, TZID, FIXED_DTSTAMP);
    expect(vevent).toContain("BEGIN:VEVENT");
    expect(vevent).toContain("END:VEVENT");
    expect(vevent).toContain("UID:testnet@baystateradio.org");
    expect(vevent).toContain("SUMMARY:Test Net");
  });

  it("DTSTAMP property is present in output", () => {
    const net = makeNet();
    const vevent = netToVevent(net, TZID, FIXED_DTSTAMP);
    expect(vevent).toContain(`DTSTAMP:${FIXED_DTSTAMP}`);
  });

  it("Tue abbreviation → correct DTSTART and BYDAY=TU", () => {
    const net = makeNet({ schedule: "Tue 20:00 60m" });
    const vevent = netToVevent(net, TZID, FIXED_DTSTAMP);
    // 2026-01-01 is Thu, next Tue is Jan 6
    expect(vevent).toContain("DTSTART;TZID=America/New_York:20260106T200000");
    expect(vevent).toContain("RRULE:FREQ=WEEKLY;BYDAY=TU");
  });
});

describe("RFC 5545 validation", () => {
  it("generates valid RFC 5545 output", () => {
    const fixtures = [
      makeNet({ schedule: "Thu 19:30 60m" }),
      makeNet({ fileSlug: "tuenet", schedule: "Tue 20:00 30m", title: "Tue Net" }),
      makeNet({ fileSlug: "dailynet", schedule: "* 08:00 15m", title: "Daily Net" }),
      makeNet({ fileSlug: "oncenet", schedule: "2026-06-12 12:00 60m", title: "Once Net" }),
    ];
    const icsString = buildFullCalendar(fixtures);
    const parsed = ICAL.parse(icsString);
    const comp = new ICAL.Component(parsed);
    const vevents = comp.getAllSubcomponents("vevent");
    expect(vevents.length).toBe(fixtures.length);
    for (const vevent of vevents) {
      expect(vevent.getFirstProperty("dtstamp")).not.toBeNull();
      expect(vevent.getFirstProperty("uid")).not.toBeNull();
      expect(vevent.getFirstProperty("dtstart")).not.toBeNull();
    }
  });
});
