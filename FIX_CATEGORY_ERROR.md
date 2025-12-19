# Исправление ошибки с колонкой category

## Проблема:
Ошибка: "Could not find the 'category' column of 'todos' in the schema cache"

## Решение:

### Вариант 1: Выполните миграцию в Supabase (рекомендуется)

1. Зайдите в Supabase → SQL Editor
2. Выполните этот SQL:

```sql
-- Добавляем колонку category, если её нет
ALTER TABLE todos 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'none';

-- Обновляем существующие записи
UPDATE todos 
SET category = 'none' 
WHERE category IS NULL;
```

3. Обновите страницу приложения

### Вариант 2: Пересоздайте таблицу (если нет важных данных)

1. Зайдите в Supabase → SQL Editor
2. Выполните:

```sql
-- Удалите таблицу (ВНИМАНИЕ: удалит все данные!)
DROP TABLE IF EXISTS todos CASCADE;

-- Создайте таблицу заново с колонкой category
CREATE TABLE todos (
  id BIGSERIAL PRIMARY KEY,
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  category TEXT DEFAULT 'none',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_todos_completed ON todos(completed);
CREATE INDEX IF NOT EXISTS idx_todos_created_at ON todos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_todos_category ON todos(category);

ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations for todos" ON todos
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_todos_updated_at
  BEFORE UPDATE ON todos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## После выполнения:

- Ошибка исчезнет
- Категории будут сохраняться в Supabase
- Приложение будет работать корректно

## Примечание:

Код теперь обрабатывает отсутствие колонки и использует localStorage как fallback, но для полной функциональности лучше выполнить миграцию.

