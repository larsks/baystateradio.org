import { netToVevent } from "../src/ical.js";

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

export const data = {
	pagination: {
		data: "collections.net",
		size: 1,
		alias: "net",
	},
	permalink: (data) => `net/${data.net.fileSlug}.ics`,
	layout: false,
	eleventyExcludeFromCollections: true,
};

export default function render({ net }) {
	const dtstamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");
	const vevent = netToVevent(net, TZID, dtstamp);
	return [
		"BEGIN:VCALENDAR",
		"VERSION:2.0",
		"PRODID:-//BayStateRadio//Net Schedule//EN",
		"CALSCALE:GREGORIAN",
		`X-WR-CALNAME:${net.data.title}`,
		`X-WR-TIMEZONE:${TZID}`,
		VTIMEZONE,
		vevent,
		"END:VCALENDAR",
	].join("\r\n");
}
