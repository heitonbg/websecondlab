import { load, save } from './storage.js';

export const state = load();
let onStateChange = () => {};

export function subscribe(listener) {
  onStateChange = listener;
}

function commit() {
  save(state);
  onStateChange(state);
}

export function addTask(title) {
  state.tasks.push({
    id: crypto.randomUUID(),
    title: title,
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

export function editTask(id, newTitle) {
  const task = state.tasks.find((t) => t.id === id);
  if (task) task.title = newTitle;
  commit();
}