-- Миграция: добавление колонки category в таблицу todos
-- Выполните этот скрипт в SQL Editor вашего проекта Supabase

ALTER TABLE todos 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'none';

-- Обновляем существующие записи, у которых category NULL
UPDATE todos 
SET category = 'none' 
WHERE category IS NULL;



