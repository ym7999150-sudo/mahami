// طبقة العرض: رسم القائمة والإحصائيات والترحيب
import { filterTasks, groupByDay, stats } from './tasks.js';
import { dayLabel, timeLabel, longToday, greetingWord, isOverdue } from './dates.js';

const $ = (s) => document.querySelector(s);
const PRIORITY = { low: 'منخفضة', medium: 'متوسطة', high: 'عالية' };
const EMPTY = {
  today: ['☀️', 'لا مهام لليوم — استمتع بيومك'],
  upcoming: ['🗓️', 'لا مهام قادمة'],
  done: ['🎯', 'لم تُنجز أي مهمة بعد'],
  all: ['📝', 'اضغط + لإضافة أول مهمة'],
};

const esc = (s) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export function renderHeader(name) {
  $('#today-label').textContent = longToday();
  $('#greeting').textContent = `${greetingWord()}، ${name}`;
  $('#avatar').textContent = name.trim().charAt(0) || '؟';
}

export function renderStats() {
  const s = stats();
  $('#stat-today').textContent = s.today;
  $('#stat-pending').textContent = s.pending;
  $('#stat-done').textContent = s.done;
}

function taskHTML(t) {
  const late = isOverdue(t);
  return `
    <div class="task ${t.done ? 'done' : ''}" data-id="${t.id}">
      <button class="check" data-action="toggle" aria-label="إنجاز">${t.done ? '✓' : ''}</button>
      <div class="task-body">
        <p class="task-title">${esc(t.title)}</p>
        <div class="task-meta">
          <span class="dot ${t.priority}" title="${PRIORITY[t.priority]}"></span>
          <span class="${late ? 'overdue' : ''}">⏰ ${timeLabel(t.time)}${late ? ' · متأخرة' : ''}</span>
          ${t.notes ? `<span>· ${esc(t.notes)}</span>` : ''}
        </div>
      </div>
      <button class="del" data-action="delete" aria-label="حذف">🗑</button>
    </div>`;
}

export function renderList(filter) {
  const list = filterTasks(filter);
  const root = $('#task-list');
  if (!list.length) {
    const [icon, msg] = EMPTY[filter];
    root.innerHTML = `<div class="empty"><div class="big">${icon}</div>${msg}</div>`;
  } else {
    const groups = groupByDay(list);
    root.innerHTML = Object.entries(groups)
      .map(([date, items]) => `
        <div class="day-group">
          <h3 class="day-title">${dayLabel(date)}</h3>
          <div class="card-list">${items.map(taskHTML).join('')}</div>
        </div>`)
      .join('');
  }
  renderStats();
}
