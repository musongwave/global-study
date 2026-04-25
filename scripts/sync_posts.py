"""
Синхронизация постов из Telegram-канала @Globalstudyy.

Парсит публичный веб-интерфейс канала, переводит на русский через Claude API,
обновляет data/posts.json и пушит изменения на GitHub Pages.
"""

import json
import os
import re
import sys
import subprocess
import urllib.request
from datetime import datetime, timezone
from html import unescape

import anthropic

CHANNEL = "Globalstudyy"
REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
POSTS_FILE = os.path.join(REPO_ROOT, "data", "posts.json")
MAX_FETCH = 30   # постов со страницы канала
MAX_STORE = 50   # максимум постов в posts.json

client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

SYSTEM_PROMPT = """Ты — контент-менеджер образовательного портала для студентов из СНГ.
Получаешь текст поста из Telegram-канала об учёбе за рубежом (на любом языке).
Возвращаешь ТОЛЬКО валидный JSON (без markdown-обёртки) со следующими полями:

{
  "title": "Привлекательный заголовок на русском (40-80 символов)",
  "preview": "Краткое описание на русском 2-3 предложения (150-250 символов)",
  "category": "одна из: образование | новости | возможности | ресурсы",
  "tags": ["тег1", "тег2", "тег3"],
  "translated_text": "Полный текст поста на русском языке"
}

Правила категоризации:
- возможности — стипендии, гранты, стажировки, работа, программы обмена
- образование — курсы, экзамены, поступление, советы, обзоры вузов, языки
- новости — рейтинги, изменения в образовании, новости вузов и программ
- ресурсы — инструменты, гайды, сервисы, полезные ссылки, шаблоны

Теги — ключевые слова строчными буквами, 2-4 штуки."""


# ── Парсинг канала ──────────────────────────────────────────────────────────

def fetch_channel_posts() -> list[dict]:
    url = f"https://t.me/s/{CHANNEL}"
    req = urllib.request.Request(url, headers={
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
    })
    try:
        html = urllib.request.urlopen(req, timeout=20).read().decode("utf-8")
    except Exception as exc:
        print(f"[ERROR] Не удалось получить страницу канала: {exc}", file=sys.stderr)
        return []

    posts = []
    # Разбиваем по блокам сообщений
    blocks = re.split(r'<div class="tgme_widget_message_wrap', html)

    for block in blocks[1:]:
        # ID поста
        id_match = re.search(r'data-post="[^/]+/(\d+)"', block)
        if not id_match:
            continue
        msg_id = int(id_match.group(1))
        tg_link = f"https://t.me/{CHANNEL}/{msg_id}"

        # Изображение (фон карточки или фото)
        img_match = re.search(r"background-image:url\('([^']+)'\)", block)
        image_url = img_match.group(1) if img_match else f"https://picsum.photos/seed/{msg_id}/600/400"

        # Текст поста
        text_match = re.search(
            r'<div class="tgme_widget_message_text[^>]*>(.*?)</div>',
            block, re.DOTALL
        )
        if not text_match:
            continue

        raw = text_match.group(1)
        text = re.sub(r"<br\s*/?>", "\n", raw)
        text = re.sub(r'<a[^>]*href="([^"]*)"[^>]*>([^<]*)</a>', r"\2 (\1)", text)
        text = re.sub(r"<[^>]+>", "", text)
        text = unescape(text).strip()

        if len(text) < 30:   # пропускаем слишком короткие
            continue

        # Дата публикации
        date_match = re.search(r'datetime="([^"]+)"', block)
        if date_match:
            try:
                dt = datetime.fromisoformat(date_match.group(1).replace("Z", "+00:00"))
                date_str = dt.strftime("%Y-%m-%d")
            except ValueError:
                date_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")
        else:
            date_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")

        posts.append({
            "msg_id": msg_id,
            "tg_link": tg_link,
            "image": image_url,
            "text": text,
            "date": date_str,
        })

    posts.sort(key=lambda p: p["msg_id"], reverse=True)
    return posts[:MAX_FETCH]


# ── Claude API ──────────────────────────────────────────────────────────────

def process_with_claude(raw_post: dict) -> dict | None:
    text_input = raw_post["text"][:2500]   # не превышаем контекст
    try:
        response = client.messages.create(
            model="claude-haiku-4-5",
            max_tokens=1024,
            system=SYSTEM_PROMPT,
            messages=[{
                "role": "user",
                "content": f"Текст поста:\n\n{text_input}"
            }]
        )
        result_text = response.content[0].text.strip()
        # Убираем возможную markdown-обёртку
        result_text = re.sub(r"^```(?:json)?\s*", "", result_text)
        result_text = re.sub(r"\s*```$", "", result_text)
        return json.loads(result_text)
    except Exception as exc:
        print(f"[ERROR] Ошибка обработки поста {raw_post['msg_id']}: {exc}", file=sys.stderr)
        return None


# ── Хранилище ───────────────────────────────────────────────────────────────

def load_posts() -> list[dict]:
    if not os.path.exists(POSTS_FILE):
        return []
    with open(POSTS_FILE, encoding="utf-8") as f:
        return json.load(f)


def save_posts(posts: list[dict]) -> None:
    os.makedirs(os.path.dirname(POSTS_FILE), exist_ok=True)
    with open(POSTS_FILE, "w", encoding="utf-8") as f:
        json.dump(posts, f, ensure_ascii=False, indent=2)


# ── Git ─────────────────────────────────────────────────────────────────────

def git_push(n_new: int) -> None:
    cmds = [
        ["git", "config", "user.email", "sync-bot@globalstudyy.com"],
        ["git", "config", "user.name", "Global Study Sync Bot"],
        ["git", "add", "data/posts.json"],
    ]
    for cmd in cmds:
        subprocess.run(cmd, cwd=REPO_ROOT, check=True, capture_output=True)

    commit_msg = f"content: добавить {n_new} новых постов из Telegram ({datetime.now(timezone.utc).strftime('%Y-%m-%d')})"
    result = subprocess.run(
        ["git", "commit", "-m", commit_msg],
        cwd=REPO_ROOT, capture_output=True, text=True
    )
    if result.returncode == 0:
        subprocess.run(["git", "push"], cwd=REPO_ROOT, check=True, capture_output=True)
        print(f"[OK] Запушено {n_new} новых постов")
    else:
        print("[INFO] Нет изменений для коммита")


# ── Основной поток ───────────────────────────────────────────────────────────

def main() -> None:
    print(f"[INFO] Получение постов из @{CHANNEL}...")
    raw_posts = fetch_channel_posts()
    print(f"[INFO] Найдено {len(raw_posts)} постов на странице")

    existing = load_posts()
    existing_links = {p["tg_link"] for p in existing}

    new_raw = [p for p in raw_posts if p["tg_link"] not in existing_links]
    print(f"[INFO] Новых постов: {len(new_raw)}")

    if not new_raw:
        print("[INFO] Нет новых постов. Выход.")
        return

    processed = []
    for raw in new_raw:
        print(f"[INFO]  → обработка поста {raw['msg_id']}...")
        meta = process_with_claude(raw)
        if not meta:
            continue

        processed.append({
            "id": raw["msg_id"],
            "date": raw["date"],
            "category": meta.get("category", "новости"),
            "title": meta.get("title", "Новый пост из канала Global Study"),
            "preview": meta.get("preview", raw["text"][:200]),
            "text": meta.get("translated_text", raw["text"]),
            "image": raw["image"],
            "tags": meta.get("tags", ["образование"]),
            "tg_link": raw["tg_link"],
        })

    if not processed:
        print("[INFO] Ни один пост не был обработан успешно. Выход.")
        return

    # Объединяем: новые посты первыми, затем старые, без дубликатов
    all_posts = processed + existing
    seen: set[str] = set()
    unique: list[dict] = []
    for p in all_posts:
        key = p.get("tg_link", str(p.get("id", "")))
        if key not in seen:
            seen.add(key)
            unique.append(p)

    unique = unique[:MAX_STORE]   # не храним больше MAX_STORE постов

    save_posts(unique)
    print(f"[OK] Сохранено {len(unique)} постов в {POSTS_FILE}")

    git_push(len(processed))


if __name__ == "__main__":
    main()
