"""
Example: Medium RSS Feed Fetching
====================================
Bu script, Medium'un RSS besleme URL'ini kullanarak bir kullanıcının
makalelerini çeker, feedparser ile parse eder ve konsola yazdırır.

Bağımlılıklar:
    pip install httpx feedparser

Kullanım:
    # Backend klasöründen çalıştırın:
    python -m examples.fetch_medium

    # Farklı kullanıcı için:
    MEDIUM_USERNAME=towardsdatascience python -m examples.fetch_medium

Ortam değişkenleri:
    MEDIUM_USERNAME  - Medium kullanıcı adı (@ işareti olmadan)

Not:
    Medium'un RSS beslemesi herkese açıktır; API anahtarı gerekmez.
    Besleme URL formatı: https://medium.com/feed/@{username}
"""

import asyncio
import json
import os

from dotenv import load_dotenv
from resumesh_scrapers import MediumScraperService

load_dotenv()


async def fetch_medium_articles(username: str) -> list[dict]:
    """
    Medium RSS besleme URL'inden kullanıcının makalelerini çeker.

    Args:
        username: Medium kullanıcı adı (@ işareti olmadan)

    Returns:
        Makale verilerinin listesi (dict).
        Her eleman ArticleCreate şemasına karşılık gelir.
    """
    print(f"🔗 Medium makaleleri çekiliyor: @{username}")
    articles = await MediumScraperService.fetch_articles(username=username)

    results: list[dict] = []
    for article in articles:
        item = article.model_dump(mode="json")
        raw = item.get("raw_platform_data") or {}
        item["tags"] = raw.get("tags", [])
        item["author"] = raw.get("author")
        results.append(item)

    print(f"📦 Toplam makale: {len(results)}")
    return results


def print_article(article: dict, index: int) -> None:
    """Tek bir makaleyi güzel formatlanmış şekilde konsola yazdırır."""
    print(f"\n{'─' * 55}")
    print(f"  #{index + 1}  {article['title']}")
    print(f"{'─' * 55}")
    print(f"  🔗 URL        : {article['url']}")

    if article.get("author"):
        print(f"  ✍️  Yazar      : {article['author']}")

    if article.get("published_at"):
        print(f"  📅 Tarih      : {article['published_at']}")

    if article.get("tags"):
        print(f"  🏷  Etiketler  : {', '.join(article['tags'])}")

    if article.get("summary"):
        # Özetten ilk satırı al (HTML temizlenmemiş olabilir)
        first_line = article["summary"].split("\n")[0].strip()
        if first_line:
            preview = first_line[:120]
            if len(first_line) > 120:
                preview += "..."
            print(f"  📄 Özet       : {preview}")


async def main():
    username = os.getenv("MEDIUM_USERNAME", "medium")

    print("=" * 60)
    print("  ResuMesh — Medium Makale Çekme Örneği")
    print(f"  Kullanıcı: @{username}")
    print("=" * 60)

    articles = await fetch_medium_articles(username)

    if not articles:
        print("⚠️  Hiç makale bulunamadı veya bir hata oluştu.")
        return

    print(f"\n✅ Toplam makale sayısı: {len(articles)}")

    # İlk 5 makaleyi göster
    preview = articles[:5]
    for i, article in enumerate(preview):
        print_article(article, i)

    if len(articles) > 5:
        print(f"\n... ve {len(articles) - 5} makale daha.")

    # Etiket istatistikleri
    all_tags: dict[str, int] = {}
    for a in articles:
        for tag in a.get("tags", []):
            all_tags[tag] = all_tags.get(tag, 0) + 1

    print(f"\n{'=' * 60}")
    print("  📊 Özet İstatistikler")
    print(f"{'=' * 60}")
    print(f"  Toplam makale   : {len(articles)}")

    if all_tags:
        top_tags = sorted(all_tags.items(), key=lambda x: x[1], reverse=True)[:8]
        print("  En sık etiketler:")
        for tag, count in top_tags:
            bar = "█" * count
            print(f"    {tag:<25} {bar} ({count})")

    # Ham JSON örneği (ilk makale)
    if articles:
        print(f"\n{'=' * 60}")
        print("  📋 Ham Veri Örneği (ilk makale — JSON)")
        print(f"{'=' * 60}")
        # Uzun HTML özetini kısalt
        preview_article = dict(articles[0])
        if preview_article.get("summary") and len(preview_article["summary"]) > 200:
            preview_article["summary"] = preview_article["summary"][:200] + "..."
        print(json.dumps(preview_article, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    asyncio.run(main())
