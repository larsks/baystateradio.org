import { eventToVevent, VTIMEZONE } from "../../src/ical.js";

const TZID = "America/New_York";

export const data = {
	pagination: {
		data: "collections.event",
		size: 1,
		alias: "event",
		before: (data) => data.filter((e) => e.data.schedule),
	},
	permalink: (data) => `event/${data.event.fileSlug}.ics`,
	layout: false,
	eleventyExcludeFromCollections: true,
};

export default function render({ event }) {
	const dtstamp = new Date()
		.toISOString()
		.replace(/[-:]/g, "")
		.replace(/\.\d+/, "");
	const vevent = eventToVevent(event, TZID, dtstamp);
	return [
		"BEGIN:VCALENDAR",
		"VERSION:2.0",
		"PRODID:-//BayStateRadio//Events//EN",
		"CALSCALE:GREGORIAN",
		`X-WR-CALNAME:${event.data.title}`,
		`X-WR-TIMEZONE:${TZID}`,
		VTIMEZONE,
		vevent,
		"END:VCALENDAR",
	].join("\r\n");
}
