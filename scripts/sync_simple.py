"""
Синхронизация постов из @globalstudyuzz с переводом на русский (без Claude API).
"""

import json, os, re, sys, time, urllib.request
from datetime import datetime, timezone
from html import unescape

try:
    from deep_translator import GoogleTranslator
    TRANSLATE_AVAILABLE = True
except ImportError:
    TRANSLATE_AVAILABLE = False
    print("[WARN] deep-translator не установлен. pip3 install deep-translator")

CHANNEL  = "globalstudyuzz"
REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
POSTS_FILE = os.path.join(REPO_ROOT, "data", "posts.json")
MAX_STORE = 50

CATEGORY_KEYWORDS = {
    "возможности": ["стипендия", "грант", "стажировк", "scholarship", "grant", "internship",
                    "fellowship", "grant", "bursary", "stipendiya", "grant", "o'qish"],
    "образование":  ["курс", "экзамен", "университет", "ielts", "toefl", "degree",
                    "bachelor", "master", "magistr", "bakalavr", "kurs", "talim"],
    "новости":      ["рейтинг", "ranking", "объявил", "открыл", "diqqat", "elon",
                    "yangi", "новост", "изменени"],
    "ресурсы":      ["гайд", "guide", "советы", "tips", "инструмент", "bepul",
                    "free", "how to", "qanday"],
}

def categorize(text: str) -> str:
    t = text.lower()
    scores = {c: sum(1 for kw in kws if kw in t) for c, kws in CATEGORY_KEYWORDS.items()}
    best = max(scores, key=scores.get)
    return best if scores[best] > 0 else "новости"

def translate_to_ru(text: str) -> str:
    if not TRANSLATE_AVAILABLE:
        return text
    try:
        chunks, result = [], []
        # Google Translate ограничение ~5000 символов за раз
        for i in range(0, len(text), 4500):
            chunks.append(text[i:i+4500])
        for chunk in chunks:
            translated = GoogleTranslator(source='auto', target='ru').translate(chunk)
            result.append(translated or chunk)
            if len(chunks) > 1:
                time.sleep(0.3)
        return "\n".join(result)
    except Exception as e:
        print(f"[WARN] Перевод не удался: {e}")
        return text

def make_title(text: str) -> str:
    lines = [l.strip() for l in text.split("\n") if l.strip()]
    for line in lines:
        clean = re.sub(r"[*_`#🔣📞✅🔵🔝💸🎓🇦🇺🇩🇪🇫🇷🇳🇴🇫🇮🇸🇰🇨🇭🇦🇹]+", "", line).strip()
        clean = re.sub(r"\s+", " ", clean).strip()
        if len(clean) >= 15:
            return clean[:80]
    return re.sub(r"[^\w\s]", "", text[:80]).strip()

def make_preview(text: str, title: str) -> str:
    body = text.replace(title, "", 1).strip()
    body = re.sub(r"\n+", " ", body).strip()
    body = re.sub(r"\s+", " ", body)
    if len(body) > 250:
        return body[:250].rsplit(" ", 1)[0] + "..."
    return body[:250] if body else text[:250]

def make_tags(text: str, category: str) -> list:
    tags = [category]
    keywords_map = {
        "стипендия": "стипендия", "грант": "грант", "стажировка": "стажировка",
        "ielts": "ielts", "toefl": "toefl", "великобритания": "великобритания",
        "сша": "сша", "германия": "германия", "канада": "канада",
        "австралия": "австралия", "европа": "европа", "магистратура": "магистратура",
        "бакалавр": "бакалавриат", "бесплатно": "бесплатно", "онлайн": "онлайн",
        "норвегия": "норвегия", "финляндия": "финляндия", "швейцария": "швейцария",
        "франция": "франция", "австрия": "австрия", "словакия": "словакия",
    }
    t = text.lower()
    for kw, tag in keywords_map.items():
        if kw in t and tag not in tags:
            tags.append(tag)
        if len(tags) >= 4:
            break
    return tags[:4]

def fetch_posts() -> list[dict]:
    url = f"https://t.me/s/{CHANNEL}"
    req = urllib.request.Request(url, headers={
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"
    })
    try:
        html = urllib.request.urlopen(req, timeout=20).read().decode("utf-8")
    except Exception as exc:
        print(f"[ERROR] Не удалось получить канал: {exc}")
        return []

    posts = []
    blocks = re.split(r'<div class="tgme_widget_message_wrap', html)

    for block in blocks[1:]:
        id_match = re.search(r'data-post="[^/]+/(\d+)"', block)
        if not id_match:
            continue
        msg_id = int(id_match.group(1))
        tg_link = f"https://t.me/{CHANNEL}/{msg_id}"

        img_match = re.search(r"background-image:url\('([^']+)'\)", block)
        image_url = img_match.group(1) if img_match else f"https://picsum.photos/seed/{msg_id}/600/400"

        text_match = re.search(
            r'<div class="tgme_widget_message_text[^>]*>(.*?)</div>',
            block, re.DOTALL
        )
        if not text_match:
            continue

        raw = text_match.group(1)
        text = re.sub(r"<br\s*/?>", "\n", raw)
        text = re.sub(r'<a[^>]*href="([^"]*)"[^>]*>([^<]*)</a>', r"\2", text)
        text = re.sub(r"<[^>]+>", "", text)
        text = unescape(text).strip()

        if len(text) < 30:
            continue

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
    return posts

def main():
    print(f"[INFO] Получаем посты из @{CHANNEL}...")
    raw_posts = fetch_posts()
    print(f"[INFO] Найдено {len(raw_posts)} постов")

    if not raw_posts:
        print("[INFO] Постов нет. Выход.")
        return

    existing = []
    if os.path.exists(POSTS_FILE):
        with open(POSTS_FILE, encoding="utf-8") as f:
            existing = json.load(f)
        existing = [p for p in existing if f"t.me/{CHANNEL}/" in p.get("tg_link", "")]

    existing_ids = {p["id"] for p in existing}
    new_raw = [p for p in raw_posts if p["msg_id"] not in existing_ids]
    print(f"[INFO] Новых: {len(new_raw)}")

    if not new_raw:
        print("[INFO] Нет новых постов.")
        all_posts = existing[:MAX_STORE]
    else:
        processed = []
        for i, raw in enumerate(new_raw):
            print(f"[INFO] ({i+1}/{len(new_raw)}) Перевожу пост #{raw['msg_id']}...")
            translated = translate_to_ru(raw["text"])
            category = categorize(translated)
            title = make_title(translated)
            preview = make_preview(translated, title)
            tags = make_tags(translated, category)
            processed.append({
                "id": raw["msg_id"],
                "date": raw["date"],
                "category": category,
                "title": title,
                "preview": preview,
                "text": translated,
                "image": raw["image"],
                "tags": tags,
                "tg_link": raw["tg_link"],
            })
            time.sleep(0.5)

        all_posts = (processed + existing)[:MAX_STORE]

    with open(POSTS_FILE, "w", encoding="utf-8") as f:
        json.dump(all_posts, f, ensure_ascii=False, indent=2)

    print(f"[OK] Сохранено {len(all_posts)} постов → data/posts.json")

if __name__ == "__main__":
    main()
