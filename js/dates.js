// أدوات التاريخ والوقت
export const todayISO = () => toISO(new Date());

export function toISO(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function nowTime() {
  const d = new Date();
  d.setMinutes(d.getMinutes() + 30);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function dayLabel(iso) {
  const today = todayISO();
  const t = new Date();
  t.setDate(t.getDate() + 1);
  if (iso === today) return 'اليوم';
  if (iso === toISO(t)) return 'غداً';
  const d = new Date(iso + 'T00:00');
  return d.toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' });
}

export function timeLabel(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  const d = new Date();
  d.setHours(h, m);
  return d.toLocaleTimeString('ar-EG', { hour: 'numeric', minute: '2-digit' });
}

export function longToday() {
  return new Date().toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' });
}

export function greetingWord() {
  const h = new Date().getHours();
  if (h < 12) return 'صباح الخير';
  if (h < 18) return 'مساء النور';
  return 'مساء الخير';
}

export const isOverdue = (task) =>
  !task.done && new Date(`${task.date}T${task.time}`) < new Date();
