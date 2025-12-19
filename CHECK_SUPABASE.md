# Проверка Supabase

## ⚠️ Проблема: Подключение к Supabase нестабильно

### Что нужно проверить:

1. **Таблица создана?**
   - Зайдите в Supabase → SQL Editor
   - Выполните: `SELECT * FROM todos LIMIT 1;`
   - Если ошибка "relation does not exist" - таблица не создана
   - Решение: выполните SQL из файла `supabase-setup-clean.sql`

2. **RLS политики настроены?**
   - Зайдите в Supabase → Authentication → Policies
   - Должна быть политика для таблицы `todos`
   - Или выполните SQL:
   ```sql
   CREATE POLICY "Allow all operations for todos" ON todos
     FOR ALL USING (true) WITH CHECK (true);
   ```

3. **Правильные ключи?**
   - Проверьте, что в GitHub Secrets добавлены:
     - `VITE_SUPABASE_URL` = `https://juqkhwodgxbuklvvpvrj.supabase.co`
     - `VITE_SUPABASE_ANON_KEY` = ваш anon key

### Быстрая проверка:

1. Откройте консоль браузера (F12) на странице приложения
2. Посмотрите на сообщения:
   - ✅ "Supabase подключен" - все хорошо
   - ⚠️ "Ошибка подключения" - проблема с таблицей или политиками
   - ⚠️ "Request timeout" - Supabase не отвечает

### Решение проблем:

**Если таблица не создана:**
```sql
-- Выполните в Supabase SQL Editor
CREATE TABLE IF NOT EXISTS todos (
  id BIGSERIAL PRIMARY KEY,
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations for todos" ON todos
  FOR ALL USING (true) WITH CHECK (true);
```

**Если проблемы с RLS:**
```sql
-- Отключите RLS временно для теста
ALTER TABLE todos DISABLE ROW LEVEL SECURITY;
```

**Если все еще не работает:**
- Приложение автоматически переключится на localStorage
- Задачи будут сохраняться локально в браузере

