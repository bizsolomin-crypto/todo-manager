# Быстрый старт - Деплой приложения

## Что нужно сделать (пошагово):

### 1️⃣ Supabase (5 минут)

1. Зайдите на [supabase.com](https://supabase.com) и создайте проект
2. В SQL Editor выполните код из файла `supabase-setup.sql`
3. В Settings → API скопируйте:
   - **Project URL**
   - **anon public** key

### 2️⃣ GitHub (5 минут)

1. Создайте новый репозиторий на GitHub
2. Загрузите код (команды ниже)
3. В Settings → Secrets → Actions добавьте:
   - `VITE_SUPABASE_URL` = ваш Project URL
   - `VITE_SUPABASE_ANON_KEY` = ваш anon key
4. В Settings → Pages выберите "GitHub Actions"

### 3️⃣ Команды для загрузки на GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/ВАШ_USERNAME/ВАШ_РЕПОЗИТОРИЙ.git
git branch -M main
git push -u origin main
```

**Замените** `ВАШ_USERNAME` и `ВАШ_РЕПОЗИТОРИЙ` на свои значения!

### 4️⃣ Готово! 

Через 2-3 минуты ваше приложение будет доступно по адресу:
`https://ВАШ_USERNAME.github.io/ВАШ_РЕПОЗИТОРИЙ/`

---

📖 **Подробная инструкция** смотрите в файле `DEPLOY.md`

