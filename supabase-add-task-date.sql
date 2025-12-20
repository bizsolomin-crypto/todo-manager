-- Миграция: добавление колонки task_date в таблицу todos
-- Выполните этот скрипт в SQL Editor вашего проекта Supabase

ALTER TABLE todos 
ADD COLUMN IF NOT EXISTS task_date DATE;


