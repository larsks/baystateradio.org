export function eventsByMonth(events, now) {
	now = now instanceof Date ? now : new Date();
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

	// 14 months: previous month, current month, plus 12 months ahead
	const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
	const months = [];
	for (let i = 0; i < 14; i++) {
		const d = new Date(start.getFullYear(), start.getMonth() + i, 1);
		months.push({
			name: d.toLocaleString("en-US", { month: "long" }),
			year: d.getFullYear(),
			month: d.getMonth() + 1,
			events: [],
		});
	}

	for (const event of events) {
		const schedule = event.data?.schedule;
		if (!schedule) continue;
		const datePart = schedule.trim().split(" ")[0];
		const match = datePart.match(/^(\d{4})-(\d{2})-(\d{2})$/);
		if (!match) continue;
		const [, yearStr, monthStr, dayStr] = match;
		const eventYear = parseInt(yearStr);
		const eventMonth = parseInt(monthStr);
		const slot = months.find(
			(m) => m.year === eventYear && m.month === eventMonth,
		);
		if (!slot) continue;
		const eventDate = new Date(eventYear, eventMonth - 1, parseInt(dayStr));
		slot.events.push({ event, isPast: eventDate < today });
	}

	for (const month of months) {
		month.events.sort((a, b) =>
			a.event.data.schedule
				.split(" ")[0]
				.localeCompare(b.event.data.schedule.split(" ")[0]),
		);
	}

	return months;
}
