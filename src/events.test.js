import { eventsByMonth } from "./events.js";
import { describe, it, expect } from "vitest";

function makeEvent(schedule, title = "Test Event") {
	return { data: { schedule, title }, url: "/event/test/" };
}

// "now" anchored to 2026-03-19 for deterministic tests
const NOW = new Date(2026, 2, 19); // March 19 2026

describe("eventsByMonth", () => {
	it("returns 14 month objects", () => {
		const result = eventsByMonth([], NOW);
		expect(result).toHaveLength(14);
	});

	it("starts from the previous month", () => {
		const result = eventsByMonth([], NOW);
		expect(result[0].name).toBe("February");
		expect(result[0].year).toBe(2026);
	});

	it("ends 12 months ahead", () => {
		const result = eventsByMonth([], NOW);
		expect(result[13].name).toBe("March");
		expect(result[13].year).toBe(2027);
	});

	it("groups events into correct months", () => {
		const events = [
			makeEvent("2026-04-20", "Boston Marathon"),
			makeEvent("2026-09-19", "Ride to Defeat ALS"),
		];
		const result = eventsByMonth(events, NOW);
		const april = result.find((m) => m.name === "April" && m.year === 2026);
		const sept = result.find(
			(m) => m.name === "September" && m.year === 2026,
		);
		expect(april.events).toHaveLength(1);
		expect(april.events[0].event.data.title).toBe("Boston Marathon");
		expect(sept.events).toHaveLength(1);
		expect(sept.events[0].event.data.title).toBe("Ride to Defeat ALS");
	});

	it("leaves empty months with an empty events array", () => {
		const result = eventsByMonth([], NOW);
		for (const month of result) {
			expect(month.events).toHaveLength(0);
		}
	});

	it("sorts events by date within a month", () => {
		const events = [
			makeEvent("2026-04-25", "Late April"),
			makeEvent("2026-04-05", "Early April"),
			makeEvent("2026-04-15", "Mid April"),
		];
		const result = eventsByMonth(events, NOW);
		const april = result.find((m) => m.name === "April" && m.year === 2026);
		expect(april.events[0].event.data.title).toBe("Early April");
		expect(april.events[1].event.data.title).toBe("Mid April");
		expect(april.events[2].event.data.title).toBe("Late April");
	});

	it("marks past events with isPast=true", () => {
		const events = [
			makeEvent("2026-02-14", "Past Event"),
			makeEvent("2026-03-18", "Yesterday"),
		];
		const result = eventsByMonth(events, NOW);
		const feb = result.find((m) => m.name === "February" && m.year === 2026);
		const march = result.find(
			(m) => m.name === "March" && m.year === 2026,
		);
		expect(feb.events[0].isPast).toBe(true);
		expect(march.events[0].isPast).toBe(true);
	});

	it("marks today and future events with isPast=false", () => {
		const events = [
			makeEvent("2026-03-19", "Today"),
			makeEvent("2026-04-01", "Future"),
		];
		const result = eventsByMonth(events, NOW);
		const march = result.find(
			(m) => m.name === "March" && m.year === 2026,
		);
		const april = result.find((m) => m.name === "April" && m.year === 2026);
		expect(march.events[0].isPast).toBe(false);
		expect(april.events[0].isPast).toBe(false);
	});

	it("excludes events outside the 14-month window", () => {
		const events = [
			makeEvent("2026-01-01", "Too early"),
			makeEvent("2027-04-01", "Too late"),
			makeEvent("2026-04-20", "In window"),
		];
		const result = eventsByMonth(events, NOW);
		const total = result.reduce((sum, m) => sum + m.events.length, 0);
		expect(total).toBe(1);
	});

	it("skips events with non-ISO date patterns", () => {
		const events = [
			makeEvent("Mon 19:00 UTC", "Weekly Net"),
			makeEvent("* * * * *", "Cron Event"),
			makeEvent("2026-04-20", "Real Event"),
		];
		const result = eventsByMonth(events, NOW);
		const total = result.reduce((sum, m) => sum + m.events.length, 0);
		expect(total).toBe(1);
	});

	it("skips events with no schedule", () => {
		const events = [
			{ data: { title: "No Schedule" }, url: "/event/none/" },
			makeEvent("2026-04-20", "Has Schedule"),
		];
		const result = eventsByMonth(events, NOW);
		const total = result.reduce((sum, m) => sum + m.events.length, 0);
		expect(total).toBe(1);
	});

	it("uses current date when now is not provided", () => {
		const currentYear = new Date().getFullYear();
		const currentMonth = new Date().getMonth() + 1;
		const schedule = `${currentYear}-${String(currentMonth).padStart(2, "0")}-15`;
		const result = eventsByMonth([makeEvent(schedule)]);
		const total = result.reduce((sum, m) => sum + m.events.length, 0);
		expect(total).toBe(1);
	});
});
