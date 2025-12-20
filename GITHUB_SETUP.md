# Настройка GitHub - Пошаговая инструкция

## Шаг 1: Создайте репозиторий на GitHub

1. Зайдите на [github.com](https://github.com) и войдите в аккаунт
2. Нажмите кнопку **"+"** в правом верхнем углу → **"New repository"**
3. Заполните форму:
   - **Repository name**: `todo-manager` (или любое другое имя)
   - **Description**: "To-Do менеджер на React с Supabase"
   - Выберите **Public** (или Private, если хотите)
   - **НЕ** ставьте галочки на "Add a README file", "Add .gitignore", "Choose a license"
4. Нажмите **"Create repository"**

## Шаг 2: Загрузите код на GitHub

После создания репозитория GitHub покажет инструкции. Выполните эти команды в терминале:

```bash
cd /Users/sergey/Desktop/тудушка
git remote add origin https://github.com/ВАШ_USERNAME/ВАШ_РЕПОЗИТОРИЙ.git
git branch -M main
git push -u origin main
```

**Важно:** Замените:
- `ВАШ_USERNAME` - на ваш GitHub username
- `ВАШ_РЕПОЗИТОРИЙ` - на имя репозитория, которое вы создали

## Шаг 3: Добавьте секреты в GitHub

1. В вашем репозитории на GitHub перейдите в **Settings** (вверху страницы)
2. В левом меню найдите **"Secrets and variables"** → **"Actions"**
3. Нажмите **"New repository secret"**

   **Первый секрет:**
   - **Name**: `VITE_SUPABASE_URL`
   - **Secret**: `https://juqkhwodgxbuklvvpvrj.supabase.co`
   - Нажмите **"Add secret"**

   **Второй секрет:**
   - **Name**: `VITE_SUPABASE_ANON_KEY`
   - **Secret**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1cWtod29kZ3hidWtsdnZwdnJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxNDczODUsImV4cCI6MjA4MTcyMzM4NX0.ky-foczlj6Zz4gdgy0fn6O87rwbPXPvdD51qM_PGh68`
   - Нажмите **"Add secret"**

## Шаг 4: Настройте GitHub Pages

1. В репозитории перейдите в **Settings** → **Pages**
2. В разделе **"Source"** выберите:
   - **Source**: `GitHub Actions`
3. Сохраните изменения (если нужно)

## Шаг 5: Проверьте деплой

1. Перейдите во вкладку **"Actions"** в вашем репозитории
2. Вы должны увидеть процесс деплоя (может занять 2-3 минуты)
3. После успешного деплоя вернитесь в **Settings** → **Pages**
4. Там будет ссылка на ваше приложение: `https://ВАШ_USERNAME.github.io/ВАШ_РЕПОЗИТОРИЙ/`

---

## Готово! 🎉

Ваше приложение будет автоматически деплоиться при каждом push в ветку `main`!




