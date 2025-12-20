-- Миграция: добавление колонки reward в таблицу todos
-- Выполните этот скрипт в SQL Editor вашего проекта Supabase

ALTER TABLE todos 
ADD COLUMN IF NOT EXISTS reward TEXT;


