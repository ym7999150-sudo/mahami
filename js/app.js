// نقطة الدخول: ربط الأحداث بين الواجهة والمنطق
import { loadName, saveName } from './storage.js';
import { addTask, toggleTask, deleteTask } from './tasks.js';
import { renderHeader, renderList } from './ui.js';
import { todayISO, nowTime } from './dates.js';

const $ = (s) => document.querySelector(s);
let currentFilter = 'today';
let priority = 'medium';

function showApp(name) {
  $('#welcome').hidden = true;
  $('#app').hidden = false;
  renderHeader(name);
  renderList(currentFilter);
}

function showWelcome() {
  $('#app').hidden = true;
  $('#welcome').hidden = false;
  $('#name-input').value = loadName();
  $('#name-input').focus();
}

function openSheet() {
  $('#task-sheet').reset();
  $('#task-date').value = todayISO();
  $('#task-time').value = nowTime();
  setPriority('medium');
  $('#sheet-backdrop').hidden = false;
  $('#task-sheet').hidden = false;
  setTimeout(() => $('#task-title').focus(), 50);
}

function closeSheet() {
  $('#sheet-backdrop').hidden = true;
  $('#task-sheet').hidden = true;
}

function setPriority(p) {
  priority = p;
  document.querySelectorAll('#priority button').forEach((b) => b.classList.toggle('active', b.dataset.p === p));
}

// الاسم
$('#name-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = $('#name-input').value.trim();
  if (!name) return;
  saveName(name);
  showApp(name);
});
$('#edit-name').addEventListener('click', showWelcome);

// الفلاتر
document.querySelectorAll('.segmented[role="tablist"] button').forEach((btn) =>
  btn.addEventListener('click', () => {
    currentFilter = btn.dataset.filter;
    document.querySelectorAll('.segmented[role="tablist"] button').forEach((b) => b.classList.toggle('active', b === btn));
    renderList(currentFilter);
  })
);

// القائمة: إنجاز / حذف
$('#task-list').addEventListener('click', (e) => {
  const action = e.target.closest('[data-action]');
  if (!action) return;
  const id = action.closest('.task').dataset.id;
  if (action.dataset.action === 'toggle') toggleTask(id);
  if (action.dataset.action === 'delete') deleteTask(id);
  renderList(currentFilter);
});

// ورقة الإضافة
$('#fab').addEventListener('click', openSheet);
$('#sheet-cancel').addEventListener('click', closeSheet);
$('#sheet-backdrop').addEventListener('click', closeSheet);
document.querySelectorAll('#priority button').forEach((b) => b.addEventListener('click', () => setPriority(b.dataset.p)));
document.addEventListener('keydown', (e) => e.key === 'Escape' && closeSheet());

$('#task-sheet').addEventListener('submit', (e) => {
  e.preventDefault();
  addTask({
    title: $('#task-title').value,
    notes: $('#task-notes').value,
    date: $('#task-date').value,
    time: $('#task-time').value,
    priority,
  });
  closeSheet();
  renderList(currentFilter);
});

// تشغيل
const saved = loadName();
saved ? showApp(saved) : showWelcome();
