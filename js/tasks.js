// منطق المهام: إضافة، تبديل، حذف، فلترة، تجميع
import { loadTasks, saveTasks } from './storage.js';
import { todayISO } from './dates.js';

let tasks = loadTasks();

const persist = () => saveTasks(tasks);
const byDateTime = (a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`);

export const getTasks = () => tasks;

export function addTask({ title, notes, date, time, priority }) {
  tasks.push({
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    title: title.trim(),
    notes: (notes || '').trim(),
    date,
    time,
    priority: priority || 'medium',
    done: false,
    createdAt: Date.now(),
  });
  persist();
}

export function toggleTask(id) {
  const t = tasks.find((x) => x.id === id);
  if (t) { t.done = !t.done; persist(); }
}

export function deleteTask(id) {
  tasks = tasks.filter((x) => x.id !== id);
  persist();
}

export function filterTasks(filter) {
  const today = todayISO();
  const list = {
    today: tasks.filter((t) => t.date === today && !t.done),
    upcoming: tasks.filter((t) => t.date > today && !t.done),
    done: tasks.filter((t) => t.done),
    all: [...tasks],
  }[filter] || tasks;
  return list.sort(byDateTime);
}

export function groupByDay(list) {
  return list.reduce((acc, t) => {
    (acc[t.date] ||= []).push(t);
    return acc;
  }, {});
}

export function stats() {
  const today = todayISO();
  return {
    today: tasks.filter((t) => t.date === today && !t.done).length,
    pending: tasks.filter((t) => !t.done).length,
    done: tasks.filter((t) => t.done).length,
  };
}
