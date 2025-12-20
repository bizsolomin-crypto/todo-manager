# Загрузка кода на GitHub

SSH ключ имеет ограничения. Используем Personal Access Token.

## Создайте Personal Access Token:

1. Зайдите на [github.com/settings/tokens](https://github.com/settings/tokens)
2. Нажмите **"Generate new token"** → **"Generate new token (classic)"**
3. Заполните:
   - **Note**: `todo-manager-deploy`
   - **Expiration**: выберите срок (например, 90 days)
   - **Scopes**: поставьте галочку на **`repo`** (полный доступ)
4. Нажмите **"Generate token"**
5. **ВАЖНО!** Скопируйте токен (начинается с `ghp_...`)

## Выполните команду:

```bash
cd /Users/sergey/Desktop/тудушка
git push -u origin main
```

Когда Git попросит:
- **Username**: `bizsolomin-crypto`
- **Password**: вставьте ваш токен (НЕ пароль от GitHub!)

---

## Альтернатива: Используйте GitHub Desktop

Если не хотите создавать токен, можете использовать GitHub Desktop:
1. Скачайте [GitHub Desktop](https://desktop.github.com/)
2. Войдите в аккаунт
3. File → Add Local Repository → выберите папку `/Users/sergey/Desktop/тудушка`
4. Нажмите "Publish repository"



