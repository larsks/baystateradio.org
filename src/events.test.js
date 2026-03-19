import { eventsByMonth } from "./events.js";
import { describe, it, expect } from "vitest";

function makeEvent(schedule, title = "Test Event") {
	return { data: { schedule, title }, url: "/event/test/" };
}

describe("eventsByMonth", () => {
	it("returns 12 month objects", () => {
		const result = eventsByMonth([], 2026);
		expect(result).toHaveLength(12);
		expect(result[0].name).toBe("January");
		expect(result[11].name).toBe("December");
	});

	it("groups events into correct months", () => {
		const events = [
			makeEvent("2026-04-20", "Boston Marathon"),
			makeEvent("2026-09-19", "Ride to Defeat ALS"),
		];
		const result = eventsByMonth(events, 2026);
		expect(result[3].events).toHaveLength(1);
		expect(result[3].events[0].data.title).toBe("Boston Marathon");
		expect(result[8].events).toHaveLength(1);
		expect(result[8].events[0].data.title).toBe("Ride to Defeat ALS");
	});

	it("leaves empty months with an empty events array", () => {
		const events = [makeEvent("2026-04-20")];
		const result = eventsByMonth(events, 2026);
		expect(result[0].events).toHaveLength(0);
		expect(result[1].events).toHaveLength(0);
	});

	it("sorts events by date within a month", () => {
		const events = [
			makeEvent("2026-04-25", "Late April"),
			makeEvent("2026-04-05", "Early April"),
			makeEvent("2026-04-15", "Mid April"),
		];
		const result = eventsByMonth(events, 2026);
		const april = result[3].events;
		expect(april[0].data.title).toBe("Early April");
		expect(april[1].data.title).toBe("Mid April");
		expect(april[2].data.title).toBe("Late April");
	});

	it("skips events with non-ISO date patterns", () => {
		const events = [
			makeEvent("Mon 19:00 UTC", "Weekly Net"),
			makeEvent("* * * * *", "Cron Event"),
			makeEvent("2026-04-20", "Real Event"),
		];
		const result = eventsByMonth(events, 2026);
		const total = result.reduce((sum, m) => sum + m.events.length, 0);
		expect(total).toBe(1);
	});

	it("skips events in a different year", () => {
		const events = [
			makeEvent("2025-04-20", "Last Year"),
			makeEvent("2027-04-20", "Next Year"),
			makeEvent("2026-04-20", "This Year"),
		];
		const result = eventsByMonth(events, 2026);
		const total = result.reduce((sum, m) => sum + m.events.length, 0);
		expect(total).toBe(1);
	});

	it("skips events with no schedule", () => {
		const events = [
			{ data: { title: "No Schedule" }, url: "/event/none/" },
			makeEvent("2026-04-20", "Has Schedule"),
		];
		const result = eventsByMonth(events, 2026);
		const total = result.reduce((sum, m) => sum + m.events.length, 0);
		expect(total).toBe(1);
	});

	it("uses current year when year is not provided", () => {
		const currentYear = new Date().getFullYear();
		const events = [makeEvent(`${currentYear}-06-15`)];
		const result = eventsByMonth(events);
		expect(result[5].events).toHaveLength(1);
	});
});
