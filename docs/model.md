# Модель данных

## Сущность "Задача"
- `id` (string) — уникальный идентификатор (crypto.randomUUID)
- `title` (string) — заголовок задачи (обязательный)
- `body` (string) — описание задачи (необязательное)
- `done` (boolean) — статус выполнения
- `createdAt` (number) — метка времени создания

## Состояние
```javascript
const state = {
  tasks: [
    { id: '1', title: 'Купить хлеб', body: 'В магазине', done: false, createdAt: 1690000000000 }
  ]
}