const KEY = 'todo-app:v1';

export function load() {
  try {
    const data = JSON.parse(localStorage.getItem(KEY));
    if (data && Array.isArray(data.tasks)) {
      return data;
    }
  } catch (error) {
    console.warn('Не удалось прочитать сохранённые задачи', error);
  }
  return { tasks: [] };
}

export function save(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('Не удалось сохранить задачи', error);
  }
}