import ICAL from "ical.js";

const DAY_ABBREVS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
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

// Format "HH:MM" as 12-hour time with am/pm (e.g., "7:30pm")
function formatTime12h(time) {
	if (!time) return "";
	const [hStr, mStr] = time.split(":");
	let h = parseInt(hStr, 10);
	const m = mStr || "00";
	const suffix = h >= 12 ? "pm" : "am";
	h = h % 12 || 12;
	return m === "00" ? `${h}${suffix}` : `${h}:${m}${suffix}`;
}

// Parse ICS text and return an array of ICAL.Event objects
export function parseIcs(icsText) {
	const parsed = ICAL.parse(icsText);
	const vcalendar = new ICAL.Component(parsed);
	// Register timezones so the iterator resolves local times correctly
	vcalendar.getAllSubcomponents("vtimezone").forEach((vtz) => {
		ICAL.TimezoneService.register(new ICAL.Timezone(vtz));
	});
	return vcalendar.getAllSubcomponents("vevent").map((v) => new ICAL.Event(v));
}

// Build a map of day-of-month -> list of event objects for the given year/month
export function getNetsForMonth(events, year, month) {
	const daysInMonth = new Date(year, month + 1, 0).getDate();
	const dayMap = {};
	for (let d = 1; d <= daysInMonth; d++) {
		dayMap[d] = [];
	}

	// ical.js month is 1-based
	const icalMonth = month + 1;

	for (const event of events) {
		const uid = event.uid || "";
		const slug = uid.split("@")[0];
		const url = slug ? `/nets/${slug}/` : "";
		const frequency = event.description || "";
		const title = event.summary;

		if (event.isRecurring()) {
			// Iterate from DTSTART rather than passing a startedOn date, because
			// ical.js discards the time-of-day when fast-forwarding with startedOn.
			const iter = event.iterator();
			let occ;
			while ((occ = iter.next())) {
				if (occ.year > year || (occ.year === year && occ.month > icalMonth))
					break;
				if (occ.year === year && occ.month === icalMonth) {
					const time = `${String(occ.hour).padStart(2, "0")}:${String(occ.minute).padStart(2, "0")}`;
					dayMap[occ.day].push({ title, time, url, frequency });
				}
			}
		} else {
			const start = event.startDate;
			if (start.year === year && start.month === icalMonth) {
				const time = `${String(start.hour).padStart(2, "0")}:${String(start.minute).padStart(2, "0")}`;
				dayMap[start.day].push({ title, time, url, frequency });
			}
		}
	}

	for (const d of Object.keys(dayMap)) {
		dayMap[d].sort((a, b) => a.time.localeCompare(b.time));
	}

	return dayMap;
}

function buildCalendarHtml(events, year, month) {
	const dayMap = getNetsForMonth(events, year, month);
	const firstDay = new Date(year, month, 1).getDay();
	const daysInMonth = new Date(year, month + 1, 0).getDate();
	const today = new Date();

	const isCurrentMonth =
		year === today.getFullYear() && month === today.getMonth();

	let html = `<div class="cal-header">
    <button class="cal-nav" id="cal-prev" aria-label="Previous month">&#8249;</button>
    <span class="cal-month-label">${MONTH_NAMES[month]} ${year}</span>
    <button class="cal-nav" id="cal-next" aria-label="Next month">&#8250;</button>
    <button class="noprint cal-nav" id="cal-today" aria-label="Go to today"${isCurrentMonth ? " disabled" : ""}>Today</button>
    <a class="noprint cal-subscribe" href="/nets.ics">Add to calendar</a>
  </div>
  <div class="cal-grid">`;

	for (const name of DAY_ABBREVS) {
		html += `<div class="cal-dow">${name}</div>`;
	}

	for (let i = 0; i < firstDay; i++) {
		html += `<div class="cal-cell cal-cell--empty"></div>`;
	}

	for (let d = 1; d <= daysInMonth; d++) {
		const isToday =
			today.getFullYear() === year &&
			today.getMonth() === month &&
			today.getDate() === d;
		const evts = dayMap[d];
		html += `<div class="cal-cell${isToday ? " cal-cell--today" : ""}">
      <span class="cal-day-num">${d}</span>`;
		for (const evt of evts) {
			const displayTime = formatTime12h(evt.time);
			const label = displayTime ? `${evt.title} ${displayTime}` : evt.title;
			const tooltipParts = [
				`${evt.title}${displayTime ? " at " + displayTime : ""}`,
			];
			if (evt.frequency) tooltipParts.push(evt.frequency);
			html += `<a class="cal-pill" href="${evt.url}" title="${tooltipParts.join("\n")}">${label}</a>`;
		}
		html += `</div>`;
	}

	html += `</div>`;
	return html;
}

function renderCalendar(events, year, month, container) {
	const html = buildCalendarHtml(events, year, month);
	container.innerHTML = html;

	// Store current year/month as data attributes for event delegation
	container.dataset.currentYear = year;
	container.dataset.currentMonth = month;
}

function init() {
	const container = document.getElementById("net-calendar");
	if (!container) return;

	fetch("/nets.ics")
		.then((r) => r.text())
		.then((icsText) => {
			const events = parseIcs(icsText);
			const now = new Date();
			renderCalendar(events, now.getFullYear(), now.getMonth(), container);

			// Event delegation: single click listener for all navigation buttons
			container.addEventListener("click", (e) => {
				const target = e.target;

				// Check if a navigation button was clicked
				if (
					target.id === "cal-prev" ||
					target.id === "cal-next" ||
					target.id === "cal-today"
				) {
					const currentYear = parseInt(container.dataset.currentYear, 10);
					const currentMonth = parseInt(container.dataset.currentMonth, 10);
					let newYear = currentYear;
					let newMonth = currentMonth;

					if (target.id === "cal-prev") {
						newMonth = currentMonth - 1;
						if (newMonth < 0) {
							newMonth = 11;
							newYear--;
						}
					} else if (target.id === "cal-next") {
						newMonth = currentMonth + 1;
						if (newMonth > 11) {
							newMonth = 0;
							newYear++;
						}
					} else if (target.id === "cal-today") {
						const today = new Date();
						newYear = today.getFullYear();
						newMonth = today.getMonth();
					}

					renderCalendar(events, newYear, newMonth, container);
				}
			});
		})
		.catch((err) => {
			console.error("Failed to load nets.ics:", err);
		});
}

if (typeof document !== "undefined") {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", init);
	} else {
		init();
	}
}
