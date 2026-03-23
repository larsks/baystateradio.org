import { eventToVevent, VTIMEZONE } from "../../src/ical.js";

const TZID = "America/New_York";

export const data = {
	permalink: "/events.ics",
	eleventyExcludeFromCollections: true,
	layout: false,
};

export default function render(data) {
	const dtstamp = new Date()
		.toISOString()
		.replace(/[-:]/g, "")
		.replace(/\.\d+/, "");
	const vevents = data.collections.event
		.filter((event) => event.data.schedule)
		.map((event) => eventToVevent(event, TZID, dtstamp));
	return [
		"BEGIN:VCALENDAR",
		"VERSION:2.0",
		"PRODID:-//BayStateRadio//Events//EN",
		"CALSCALE:GREGORIAN",
		"X-WR-CALNAME:Bay State Radio Events",
		`X-WR-TIMEZONE:${TZID}`,
		VTIMEZONE,
		...vevents,
		"END:VCALENDAR",
	].join("\r\n");
}
