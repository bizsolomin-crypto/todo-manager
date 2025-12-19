# Добавьте workflow файл в GitHub

Код загружен! Теперь нужно добавить workflow файл для автоматического деплоя.

## Способ 1: Через веб-интерфейс GitHub (рекомендуется)

1. Зайдите в ваш репозиторий: https://github.com/bizsolomin-crypto/todo-manager
2. Нажмите кнопку **"Add file"** → **"Create new file"**
3. В поле имени файла введите: `.github/workflows/deploy.yml`
4. Скопируйте содержимое файла `.github/workflows/deploy.yml` из проекта
5. Вставьте в редактор на GitHub
6. Нажмите **"Commit new file"** внизу страницы

## Способ 2: Обновите токен с правами workflow

1. Зайдите на: https://github.com/settings/tokens
2. Найдите ваш токен `todo-manager-deploy`
3. Нажмите **"Edit"**
4. Поставьте галочку на **`workflow`** (в дополнение к `repo`)
5. Нажмите **"Update token"**
6. Затем выполните:
   ```bash
   cd /Users/sergey/Desktop/тудушка
   git push origin main
   ```

## После добавления workflow:

1. Перейдите в **Actions** в вашем репозитории
2. Должен запуститься автоматический деплой
3. Через 2-3 минуты приложение будет доступно по адресу:
   ```
   https://bizsolomin-crypto.github.io/todo-manager/
   ```

---

**Важно:** Убедитесь, что:
- ✅ Секреты добавлены в GitHub (VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY)
- ✅ Таблица `todos` создана в Supabase (выполнен SQL скрипт)
- ✅ GitHub Pages настроен на "GitHub Actions"


