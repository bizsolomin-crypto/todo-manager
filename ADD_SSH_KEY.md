# Добавьте SSH ключ в GitHub

## Ваш публичный SSH ключ (скопируйте его):

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIFe/ZvwoIi/KwB+/jybZC4Jz073/UgmVTjfUwVU2r3Lf github
```

## Инструкция:

1. Зайдите на [github.com](https://github.com) и войдите
2. Нажмите на ваш **аватар** (правый верхний угол) → **Settings**
3. В левом меню найдите **"SSH and GPG keys"**
4. Нажмите **"New SSH key"** (зеленая кнопка)
5. Заполните:
   - **Title**: `MacBook` (или любое имя)
   - **Key**: вставьте ключ выше (весь текст, начиная с `ssh-ed25519...`)
6. Нажмите **"Add SSH key"**
7. Может попросить пароль GitHub - введите его

## После добавления ключа:

Сообщите мне, и я загружу код на GitHub!

Или выполните команды сами:
```bash
cd /Users/sergey/Desktop/тудушка
git remote set-url origin git@github.com:bizsolomin-crypto/todo-manager.git
git push -u origin main
```



