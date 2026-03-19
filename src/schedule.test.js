import { formatSchedule, formatEventDate } from "./schedule.js";
import { describe, it, expect } from "vitest";

describe("formatEventDate", () => {
  it("ISO date schedule", () => {
    expect(formatEventDate("2026-03-28 08:00 4h")).toBe("March 28 (Saturday)");
  });
  it("empty input", () => {
    expect(formatEventDate("")).toBe("");
  });
  it("null input", () => {
    expect(formatEventDate(null)).toBe("");
  });
  it("non-ISO schedule (weekday)", () => {
    expect(formatEventDate("Mon 18:00 60m")).toBe("");
  });
});

describe("formatSchedule", () => {
  it("single weekday", () => {
    expect(formatSchedule("Mon 18:00 60m")).toBe(
      "Monday from 6:00pm to 7:00pm",
    );
  });
  it("multiple weekdays", () => {
    expect(formatSchedule("Mon,Wed,Fri 18:00 60m")).toBe(
      "Monday, Wednesday, and Friday from 6:00pm to 7:00pm",
    );
  });
  it("ISO date", () => {
    expect(formatSchedule("2026-06-12 12:00 30m")).toBe(
      "June 12, 2026 from 12:00pm to 12:30pm",
    );
  });
  it("every day", () => {
    expect(formatSchedule("* 20:00 60m")).toBe(
      "Every day from 8:00pm to 9:00pm",
    );
  });
  it("monthly ordinal first", () => {
    expect(formatSchedule("1Mon 08:00 1h")).toBe(
      "First Monday of every month from 8:00am to 9:00am",
    );
  });
  it("monthly ordinal second", () => {
    expect(formatSchedule("2Tue 08:00 1h")).toBe(
      "Second Tuesday of every month from 8:00am to 9:00am",
    );
  });
  it("monthly ordinal last", () => {
    expect(formatSchedule("-1Fri 09:00 1h")).toBe(
      "Last Friday of every month from 9:00am to 10:00am",
    );
  });
  it("bi-weekly interval", () => {
    expect(formatSchedule("Tue/2 18:00 2h")).toBe(
      "Every other Tuesday from 6:00pm to 8:00pm",
    );
  });
  it("tri-weekly interval", () => {
    expect(formatSchedule("Wed/3 18:00 2h")).toBe(
      "Every third Wednesday from 6:00pm to 8:00pm",
    );
  });
});
