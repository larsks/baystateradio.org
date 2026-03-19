const MONTH_NAMES = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

export function eventsByMonth(events, year) {
	year = year ?? new Date().getFullYear();
	const months = MONTH_NAMES.map((name) => ({ name, events: [] }));

	for (const event of events) {
		const schedule = event.data?.schedule;
		if (!schedule) continue;
		const datePart = schedule.trim().split(" ")[0];
		const match = datePart.match(/^(\d{4})-(\d{2})-(\d{2})$/);
		if (!match) continue;
		if (parseInt(match[1]) !== year) continue;
		months[parseInt(match[2]) - 1].events.push(event);
	}

	for (const month of months) {
		month.events.sort((a, b) =>
			a.data.schedule
				.split(" ")[0]
				.localeCompare(b.data.schedule.split(" ")[0]),
		);
	}

	return months;
}
