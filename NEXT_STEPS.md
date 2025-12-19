# Следующие шаги для деплоя

## ✅ Что уже сделано:
- ✅ Код загружен на GitHub
- ✅ Supabase проект настроен
- ✅ .env файл создан

## 🔧 Что нужно сделать сейчас:

### 1. Добавьте секреты в GitHub (ОБЯЗАТЕЛЬНО!)

1. Зайдите в ваш репозиторий: https://github.com/bizsolomin-crypto/todo-manager
2. Перейдите в **Settings** → **Secrets and variables** → **Actions**
3. Нажмите **"New repository secret"**

   **Первый секрет:**
   - **Name**: `VITE_SUPABASE_URL`
   - **Secret**: `https://juqkhwodgxbuklvvpvrj.supabase.co`
   - Нажмите **"Add secret"**

   **Второй секрет:**
   - **Name**: `VITE_SUPABASE_ANON_KEY`
   - **Secret**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1cWtod29kZ3hidWtsdnZwdnJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxNDczODUsImV4cCI6MjA4MTcyMzM4NX0.ky-foczlj6Zz4gdgy0fn6O87rwbPXPvdD51qM_PGh68`
   - Нажмите **"Add secret"**

### 2. Настройте GitHub Pages

1. В репозитории перейдите в **Settings** → **Pages**
2. В разделе **"Source"** выберите:
   - **Source**: `GitHub Actions`
3. Сохраните (если нужно)

### 3. Проверьте деплой

1. Перейдите во вкладку **"Actions"** в вашем репозитории
2. Вы должны увидеть процесс деплоя (может занять 2-3 минуты)
3. После успешного деплоя:
   - Вернитесь в **Settings** → **Pages**
   - Там будет ссылка на ваше приложение: `https://bizsolomin-crypto.github.io/todo-manager/`

### 4. Проверьте таблицу в Supabase

Убедитесь, что вы выполнили SQL скрипт из файла `supabase-setup-clean.sql` в Supabase SQL Editor.

---

## 🎉 После этого ваше приложение будет работать!

Если возникнут проблемы - проверьте логи в разделе **Actions** на GitHub.


