import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

// Initialize Calendar
export function initializeCalendar(calendarId, events = []) {
  const calendarEl = document.getElementById(calendarId);
  const calendar = new Calendar(calendarEl, {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: "dayGridMonth",
    editable: true,
    selectable: true,
    events: events,
    dateClick: (info) => {
      alert(`Date clicked: ${info.dateStr}`);
    },
    eventClick: (info) => {
      alert(`Event clicked: ${info.event.title}`);
    },
  });
  calendar.render();
}