import { state, subscribe, addTask, toggleTask, removeTask, editTask } from './state.js';
import { render } from './view.js';

const form = document.querySelector('[data-add-form]');
const inputTitle = document.getElementById('new-task');
const inputBody = document.getElementById('new-task-body');
const errorEl = document.getElementById('new-task-error');
const list = document.querySelector('[data-list]');
const statusEl = document.querySelector('[data-status]');

const deleteModal = document.getElementById('delete-modal');
const editModal = document.getElementById('edit-modal');
const editTitleInput = document.getElementById('edit-title-input');
const editBodyInput = document.getElementById('edit-body-input');

let taskToDeleteId = null;
let taskToEditId = null;
let lastFocusedElement = null;

subscribe(render);
render(state);

// Добавление
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = inputTitle.value.trim();
  const body = inputBody.value.trim();

  if (!title) {
    errorEl.textContent = 'Введите заголовок задачи';
    inputTitle.focus();
    return;
  }
  
  errorEl.textContent = '';
  addTask(title, body);
  form.reset();
  inputTitle.focus();
});

// Делегирование
list.addEventListener('click', (e) => {
  const menuBtn = e.target.closest('.task__menu-btn');
  if (menuBtn) {
    const task = menuBtn.closest('.task');
    const menu = task.querySelector('.task__menu');
    menu.hidden = false;
    menuBtn.setAttribute('aria-expanded', 'true');
    menu.querySelector('button').focus();
    return;
  }

  if (!e.target.closest('.task__menu')) {
    document.querySelectorAll('.task__menu').forEach(m => m.hidden = true);
    document.querySelectorAll('.task__menu-btn').forEach(b => b.setAttribute('aria-expanded', 'false'));
  }

  const actionBtn = e.target.closest('[data-action]');
  if (!actionBtn) return;

  const taskItem = actionBtn.closest('.task');
  const id = taskItem.dataset.id;
  const action = actionBtn.dataset.action;

  if (action === 'delete') {
    taskToDeleteId = id;
    lastFocusedElement = actionBtn;
    deleteModal.hidden = false;
    deleteModal.querySelector('.btn-primary').focus();
  } 
  
  if (action === 'edit') {
    taskToEditId = id;
    lastFocusedElement = actionBtn;
    const task = state.tasks.find(t => t.id === id);
    
    editTitleInput.value = task.title;
    editBodyInput.value = task.body;
    
    editModal.hidden = false;
    editTitleInput.focus();
  }

  if (action === 'toggle') {
    toggleTask(id);
    statusEl.textContent = 'Статус изменен';
    taskItem.querySelector('.task__menu').hidden = true;
    taskItem.querySelector('.task__menu-btn').setAttribute('aria-expanded', 'false');
  }
});

// Удаление
document.getElementById('confirm-delete').addEventListener('click', () => {
  if (taskToDeleteId) {
    removeTask(taskToDeleteId);
    statusEl.textContent = 'Задача удалена';
    closeModal(deleteModal);
    setTimeout(() => inputTitle.focus(), 0);
  }
});

// Сохранение редактирования
document.getElementById('confirm-edit').addEventListener('click', () => {
  if (taskToEditId) {
    const newTitle = editTitleInput.value.trim();
    const newBody = editBodyInput.value.trim();

    if (!newTitle) {
      editTitleInput.focus();
      return;
    }

    editTask(taskToEditId, newTitle, newBody);
    statusEl.textContent = 'Задача обновлена';
    closeModal(editModal);
  }
});

// Закрытие
document.querySelectorAll('[data-close-modal]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const modal = e.target.closest('.modal');
    closeModal(modal);
  });
});

function closeModal(modal) {
  modal.hidden = true;
  if (lastFocusedElement) {
    lastFocusedElement.focus();
  } else {
    inputTitle.focus();
  }
}

// Клавиатура
editModal.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
    e.preventDefault();
    document.getElementById('confirm-edit').click();
  }
  if (e.key === 'Escape') {
    closeModal(editModal);
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (!deleteModal.hidden) closeModal(deleteModal);
    document.querySelectorAll('.task__menu').forEach(m => m.hidden = true);
    document.querySelectorAll('.task__menu-btn').forEach(b => b.setAttribute('aria-expanded', 'false'));
  }
});