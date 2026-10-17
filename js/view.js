const list = document.querySelector('[data-list]');
const empty = document.querySelector('[data-empty]');
const template = document.querySelector('#task-template');

export function render(state) {
  list.replaceChildren(...state.tasks.map(createItem));
  empty.hidden = state.tasks.length > 0;
}

function createItem(task) {
  const item = template.content.firstElementChild.cloneNode(true);
  const check = item.querySelector('.task__check');
  const label = item.querySelector('.task__title');
  const editBtn = item.querySelector('[data-action="edit"]');
  const deleteBtn = item.querySelector('[data-action="delete"]');

  // Связывание данных с DOM
  item.dataset.id = task.id;
  item.classList.toggle('task--done', task.done);

  // Доступность и значения
  check.id = `task-${task.id}`;
  check.checked = task.done;
  label.htmlFor = check.id;
  label.textContent = task.title; // Безопасно от XSS

  // Обновление ARIA-лейблов кнопок
  editBtn.setAttribute('aria-label', `Редактировать задачу: ${task.title}`);
  deleteBtn.setAttribute('aria-label', `Удалить задачу: ${task.title}`);

  return item;
}