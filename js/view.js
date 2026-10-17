const list = document.querySelector('[data-list]');
const empty = document.querySelector('[data-empty]');
const template = document.querySelector('#task-template');

export function render(state) {
  list.replaceChildren(...state.tasks.map(createItem));
  empty.hidden = state.tasks.length > 0;
}

function createItem(task) {
  const item = template.content.firstElementChild.cloneNode(true);
  const titleEl = item.querySelector('.task__title');
  const bodyEl = item.querySelector('.task__body');
  const timeEl = item.querySelector('.task__time');
  const menuBtn = item.querySelector('.task__menu-btn');
  const menu = item.querySelector('.task__menu');
  const actionBtns = menu.querySelectorAll('button');

  item.dataset.id = task.id;
  item.classList.toggle('task--done', task.done);
  
  titleEl.textContent = task.title;
  bodyEl.textContent = task.body;
  
  // Выводим время, если оно есть
  if (task.time) {
    timeEl.textContent = `Deadline: ${task.time}`;
  }

  menuBtn.setAttribute('aria-label', `Действия: ${task.title}`);
  actionBtns.forEach(btn => {
    const action = btn.dataset.action;
    let actionText = action === 'delete' ? 'Удалить' : action === 'edit' ? 'Редактировать' : 'Выполнено';
    btn.setAttribute('aria-label', `${actionText} задачу: ${task.title}`);
  });

  return item;
}