import { state, subscribe, addTask, toggleTask, removeTask, editTask } from './state.js';
import { render } from './view.js';

const form = document.querySelector('[data-add-form]');
const input = document.getElementById('new-task');
const errorEl = document.getElementById('new-task-error');
const list = document.querySelector('[data-list]');
const statusEl = document.querySelector('[data-status]');

// Подписка на изменение состояния
subscribe(render);
render(state); // Первичная отрисовка

// 1. Добавление задачи (форма)
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const title = input.value.trim();

  if (!title) {
    errorEl.textContent = 'Введите текст задачи';
    input.setAttribute('aria-invalid', 'true');
    return;
  }

  errorEl.textContent = '';
  input.removeAttribute('aria-invalid');
  
  addTask(title);
  form.reset();
  input.focus();
});

// Очистка ошибки при вводе
input.addEventListener('input', () => {
  if (errorEl.textContent) {
    errorEl.textContent = '';
    input.removeAttribute('aria-invalid');
  }
});

// 2. Делегирование событий на списке
list.addEventListener('change', (event) => {
  if (!event.target.matches('.task__check')) return;
  const id = event.target.closest('.task').dataset.id;
  toggleTask(id);
  statusEl.textContent = 'Статус задачи изменен';
});

list.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (!button) return;

  const taskItem = button.closest('.task');
  const id = taskItem.dataset.id;
  const action = button.dataset.action;

  if (action === 'delete') {
    removeTask(id);
    statusEl.textContent = 'Задача удалена';
    // Управление фокусом после удаления
    setTimeout(() => {
      if (list.children.length > 0) {
        const focusTarget = list.querySelector('.task__check') || list.querySelector('.task__btn');
        if (focusTarget) focusTarget.focus();
      } else {
        input.focus();
      }
    }, 0);
  }

  if (action === 'edit') {
    startEditMode(taskItem);
  }
});

// Двойной клик на текст для редактирования
list.addEventListener('dblclick', (event) => {
  if (event.target.matches('.task__title')) {
    startEditMode(event.target.closest('.task'));
  }
});

function startEditMode(taskItem) {
  if (taskItem.classList.contains('task--editing')) return;
  
  const id = taskItem.dataset.id;
  const label = taskItem.querySelector('.task__title');
  const oldTitle = label.textContent;
  
  const inputEdit = document.createElement('input');
  inputEdit.type = 'text';
  inputEdit.className = 'task__edit-input';
  inputEdit.value = oldTitle;
  inputEdit.maxLength = 200;
  
  taskItem.classList.add('task--editing');
  taskItem.querySelector('.task__actions').style.display = 'none';
  
  label.replaceWith(inputEdit);
  inputEdit.focus();
  
  let isSaved = false;

  const saveEdit = () => {
    if (isSaved) return;
    isSaved = true;
    const newTitle = inputEdit.value.trim();
    
    if (!newTitle) {
      // Если пусто — возвращаем старый текст 
      finishEdit(label, oldTitle);
    } else {
      editTask(id, newTitle);
      statusEl.textContent = 'Задача обновлена';
      // render вызовется автоматически через subscribe
    }
  };

  const cancelEdit = () => {
    if (isSaved) return;
    isSaved = true;
    finishEdit(label, oldTitle);
  };

  const finishEdit = (originalLabel, text) => {
    inputEdit.remove();
    originalLabel.textContent = text;
    taskItem.classList.remove('task--editing');
    taskItem.querySelector('.task__actions').style.display = '';
    
    // Возврат фокуса на кнопку редактирования или на чекбокс
    const editBtn = taskItem.querySelector('[data-action="edit"]');
    if (editBtn) editBtn.focus();
  };

  inputEdit.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveEdit();
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      cancelEdit();
    }
  });

  // Сохранение при потере фокуса
  inputEdit.addEventListener('blur', saveEdit);
}