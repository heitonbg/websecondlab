import { load, save } from './storage.js';

export const state = load();
let onStateChange = () => {};

export function subscribe(listener) { onStateChange = listener; }

function commit() {
  save(state);
  onStateChange(state);
}

// Добавлено время
export function addTask(title, body, time) {
  state.tasks.push({
    id: crypto.randomUUID(),
    title: title,
    body: body || 'Task body about this task...',
    time: time || '', // Сохраняем время, если есть
    done: false,
    createdAt: Date.now(),
  });
  commit();
}

export function toggleTask(id) {
  const task = state.tasks.find((t) => t.id === id);
  if (task) task.done = !task.done;
  commit();
}

export function removeTask(id) {
  state.tasks = state.tasks.filter((t) => t.id !== id);
  commit();
}

// Добавлено время
export function editTask(id, newTitle, newBody, newTime) {
  const task = state.tasks.find((t) => t.id === id);
  if (task) {
    task.title = newTitle;
    task.body = newBody.trim() || 'Task body about this task...'; 
    task.time = newTime || '';
  }
  commit();
}