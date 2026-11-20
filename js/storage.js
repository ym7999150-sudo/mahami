// طبقة التخزين: حفظ المهام والاسم في localStorage
const TASKS_KEY = 'mahami.tasks';
const NAME_KEY = 'mahami.name';

function safeGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* التخزين غير متاح */
  }
}

export const loadTasks = () => safeGet(TASKS_KEY, []);
export const saveTasks = (tasks) => safeSet(TASKS_KEY, tasks);
export const loadName = () => safeGet(NAME_KEY, '');
export const saveName = (name) => safeSet(NAME_KEY, name);
