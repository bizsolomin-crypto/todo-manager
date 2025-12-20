# Настройка аутентификации GitHub

Для загрузки кода на GitHub нужна аутентификация. Есть два способа:

## Способ 1: Personal Access Token (быстрый)

### 1. Создайте токен:
1. Зайдите на GitHub → ваш аватар → **Settings**
2. В левом меню внизу найдите **"Developer settings"**
3. Выберите **"Personal access tokens"** → **"Tokens (classic)"**
4. Нажмите **"Generate new token"** → **"Generate new token (classic)"**
5. Заполните:
   - **Note**: `todo-manager-deploy`
   - **Expiration**: выберите срок (например, 90 days)
   - **Scopes**: поставьте галочку на **`repo`** (полный доступ к репозиториям)
6. Нажмите **"Generate token"**
7. **ВАЖНО!** Скопируйте токен сразу (он показывается только один раз!)
   - Токен начинается с `ghp_...`

### 2. Используйте токен для push:
```bash
cd /Users/sergey/Desktop/тудушка
git push -u origin main
```
Когда Git попросит:
- **Username**: `bizsolomin-crypto`
- **Password**: вставьте ваш токен (не пароль от GitHub!)

---

## Способ 2: SSH ключ (рекомендуется для постоянного использования)

### 1. Проверьте, есть ли SSH ключ:
```bash
ls -la ~/.ssh/id_*.pub
```

### 2. Если ключа нет, создайте его:
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```
Нажмите Enter на все вопросы (можно оставить пароль пустым)

### 3. Скопируйте публичный ключ:
```bash
cat ~/.ssh/id_ed25519.pub
```
Скопируйте весь вывод (начинается с `ssh-ed25519...`)

### 4. Добавьте ключ в GitHub:
1. GitHub → аватар → **Settings**
2. В левом меню **"SSH and GPG keys"**
3. Нажмите **"New SSH key"**
4. **Title**: `MacBook` (или любое имя)
5. **Key**: вставьте скопированный ключ
6. Нажмите **"Add SSH key"**

### 5. Измените URL репозитория на SSH:
```bash
cd /Users/sergey/Desktop/тудушка
git remote set-url origin git@github.com:bizsolomin-crypto/todo-manager.git
git push -u origin main
```

---

## Какой способ выбрать?

- **Personal Access Token** - быстрее, но нужно вводить при каждом push
- **SSH ключ** - один раз настроить, потом работает автоматически

Рекомендую **SSH ключ** для удобства!



