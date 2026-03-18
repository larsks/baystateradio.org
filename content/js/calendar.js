(function () {
  "use strict";

  const DAY_ABBREVS = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Tues: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  // Parse a schedule string and return a function(date) -> boolean
  function parseSchedule(schedule) {
    if (!schedule) return () => false;

    const parts = schedule.trim().split(/\s+/);
    const dayPart = parts[0];

    // Daily: "*"
    if (dayPart === "*") {
      return () => true;
    }

    // Specific date: "YYYY-MM-DD"
    if (/^\d{4}-\d{2}-\d{2}$/.test(dayPart)) {
      const target = new Date(dayPart + "T00:00:00");
      return (date) =>
        date.getFullYear() === target.getFullYear() &&
        date.getMonth() === target.getMonth() &&
        date.getDate() === target.getDate();
    }

    // Weekly: "Mon,Wed,Fri" or "Thu"
    const days = dayPart.split(",").map((d) => DAY_ABBREVS[d.trim()]).filter((d) => d !== undefined);
    if (days.length > 0) {
      return (date) => days.includes(date.getDay());
    }

    return () => false;
  }

  // Get raw time string from schedule (e.g., "19:30")
  function getScheduleTime(schedule) {
    if (!schedule) return "";
    const parts = schedule.trim().split(/\s+/);
    return parts.length > 1 ? parts[1] : "";
  }

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

  // Build a map of day-of-month -> list of nets for the given year/month
  function getNetsForMonth(nets, year, month) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const dayMap = {};

    for (let d = 1; d <= daysInMonth; d++) {
      dayMap[d] = [];
    }

    for (const net of nets) {
      const matches = parseSchedule(net.schedule);
      const time = getScheduleTime(net.schedule);
      for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(year, month, d);
        if (matches(date)) {
          dayMap[d].push({ ...net, time });
        }
      }
    }

    // Sort each day's events by start time (HH:MM lexicographic order works fine)
    for (const d of Object.keys(dayMap)) {
      dayMap[d].sort((a, b) => a.time.localeCompare(b.time));
    }

    return dayMap;
  }

  function renderCalendar(nets, year, month, container) {
    const dayMap = getNetsForMonth(nets, year, month);
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    const nowCheck = new Date();
    const isCurrentMonth = year === nowCheck.getFullYear() && month === nowCheck.getMonth();

    let html = `<div class="cal-header">
      <button class="cal-nav" id="cal-prev" aria-label="Previous month">&#8249;</button>
      <span class="cal-month-label">${MONTH_NAMES[month]} ${year}</span>
      <button class="cal-nav" id="cal-next" aria-label="Next month">&#8250;</button>
      <button class="cal-nav" id="cal-today" aria-label="Go to today"${isCurrentMonth ? ' disabled' : ''}>Today</button>
    </div>
    <div class="cal-grid">`;

    for (const name of DAY_NAMES) {
      html += `<div class="cal-dow">${name}</div>`;
    }

    // Leading empty cells
    for (let i = 0; i < firstDay; i++) {
      html += `<div class="cal-cell cal-cell--empty"></div>`;
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const isToday =
        today.getFullYear() === year &&
        today.getMonth() === month &&
        today.getDate() === d;
      const events = dayMap[d];
      html += `<div class="cal-cell${isToday ? " cal-cell--today" : ""}">
        <span class="cal-day-num">${d}</span>`;
      for (const evt of events) {
        const displayTime = formatTime12h(evt.time);
        const label = displayTime ? `${evt.title} ${displayTime}` : evt.title;
        html += `<a class="cal-pill" href="${evt.url}" title="${evt.title}${displayTime ? " at " + displayTime : ""}">${label}</a>`;
      }
      html += `</div>`;
    }

    html += `</div>`;
    container.innerHTML = html;

    document.getElementById("cal-prev").addEventListener("click", () => {
      let m = month - 1;
      let y = year;
      if (m < 0) { m = 11; y--; }
      renderCalendar(nets, y, m, container);
    });

    document.getElementById("cal-next").addEventListener("click", () => {
      let m = month + 1;
      let y = year;
      if (m > 11) { m = 0; y++; }
      renderCalendar(nets, y, m, container);
    });

    document.getElementById("cal-today").addEventListener("click", () => {
      const now = new Date();
      renderCalendar(nets, now.getFullYear(), now.getMonth(), container);
    });
  }

  function init() {
    const container = document.getElementById("net-calendar");
    if (!container) return;

    fetch("/nets.json")
      .then((r) => r.json())
      .then((nets) => {
        const now = new Date();
        renderCalendar(nets, now.getFullYear(), now.getMonth(), container);
      })
      .catch((err) => {
        console.error("Failed to load nets.json:", err);
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
