"""
Example: Dev.to Article Fetching
====================================
Bu script, Dev.to'nun herkese açık REST API'sini kullanarak
bir kullanıcının makalelerini çeker ve konsola yazdırır.

Bağımlılıklar:
    pip install httpx

Kullanım:
    # Backend klasöründen çalıştırın:
    python -m examples.fetch_devto

    # Farklı kullanıcı için:
    DEVTO_USERNAME=ben python -m examples.fetch_devto

    # API anahtarı ile (rate limit artırmak ve private makaleleri görmek için):
    DEVTO_API_KEY=your_key DEVTO_USERNAME=yourname python -m examples.fetch_devto

Ortam değişkenleri:
    DEVTO_USERNAME  - Dev.to kullanıcı adı (zorunlu değil, varsayılan: "devteam")
    DEVTO_API_KEY   - Dev.to API anahtarı (opsiyonel)

API Dökümantasyonu:
    https://developers.forem.com/api/v1
    Uç nokta: GET https://dev.to/api/articles?username={username}
"""

import asyncio
import json
import os

from app.services.scrapers.devto_scraper import DevToScraperService


async def fetch_devto_articles(
    username: str,
    api_key: str | None = None,
) -> list[dict]:
    """
    Dev.to REST API'den kullanıcının makalelerini çeker.

    Args:
        username: Dev.to kullanıcı adı
        api_key: Dev.to API anahtarı (opsiyonel). Eklenirse rate limit artar
                 ve private makaleler de gelir.

    Returns:
        Makale verilerinin listesi (dict).
        Her eleman ArticleCreate şemasına karşılık gelir.
    """
    print(f"🔗 Dev.to makaleleri çekiliyor: @{username}")
    if api_key:
        print("  🔑 API anahtarı kullanılıyor")
    articles = await DevToScraperService.fetch_articles(
        username=username,
        api_key=api_key,
    )

    results: list[dict] = []
    for article in articles:
        item = article.model_dump(mode="json")
        raw = item.get("raw_platform_data") or {}
        # Eski örnek çıktısıyla uyum için ham API alanlarını ekle.
        item["cover_image"] = raw.get("cover_image")
        item["social_image"] = raw.get("social_image")
        item["tags"] = raw.get("tag_list", [])
        item["reactions_count"] = raw.get("public_reactions_count", 0)
        item["comments_count"] = raw.get("comments_count", 0)
        item["page_views_count"] = raw.get("page_views_count")
        item["positive_reactions_count"] = raw.get("positive_reactions_count", 0)
        results.append(item)

    print(f"📦 Toplam makale alındı: {len(results)}")
    return results


def print_article(article: dict, index: int) -> None:
    """Tek bir makaleyi güzel formatlanmış şekilde konsola yazdırır."""
    print(f"\n{'─' * 55}")
    print(f"  #{index + 1}  {article['title']}")
    print(f"{'─' * 55}")
    print(f"  🔗 URL          : {article['url']}")

    if article.get("published_at"):
        print(f"  📅 Tarih        : {article['published_at']}")

    print(f"  ⏱  Okuma süresi : {article['reading_time_minutes']} dk")
    print(f"  ❤️  Beğeni       : {article['reactions_count']}")
    print(f"  💬 Yorum        : {article['comments_count']}")

    if article.get("page_views_count") is not None:
        print(f"  👁  Görüntülenme : {article['page_views_count']}")

    if article.get("tags"):
        tags = article["tags"] if isinstance(article["tags"], list) else []
        if tags:
            print(f"  🏷  Etiketler    : {', '.join(tags)}")

    if article.get("summary"):
        preview = article["summary"][:130]
        if len(article["summary"]) > 130:
            preview += "..."
        print(f"  📄 Özet         : {preview}")


async def main():
    username = os.getenv("DEVTO_USERNAME", "devteam")
    api_key = os.getenv("DEVTO_API_KEY")

    print("=" * 60)
    print("  ResuMesh — Dev.to Makale Çekme Örneği")
    print(f"  Kullanıcı: @{username}")
    if api_key:
        print("  🔑 API anahtarı aktif (private makaleler dahil)")
    else:
        print("  ℹ️  API anahtarı yok — yalnızca public makaleler")
    print("=" * 60)

    articles = await fetch_devto_articles(username, api_key)

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

    # İstatistik özeti
    total_reactions = sum(a["reactions_count"] for a in articles)
    total_comments = sum(a["comments_count"] for a in articles)
    total_reading = sum(a["reading_time_minutes"] for a in articles)

    all_tags: dict[str, int] = {}
    for a in articles:
        tags = a.get("tags", [])
        if isinstance(tags, list):
            for tag in tags:
                all_tags[tag] = all_tags.get(tag, 0) + 1

    # En çok beğenilen makaleler
    top_by_reactions = sorted(
        articles, key=lambda x: x["reactions_count"], reverse=True
    )[:3]

    print(f"\n{'=' * 60}")
    print("  📊 Özet İstatistikler")
    print(f"{'=' * 60}")
    print(f"  Toplam makale        : {len(articles)}")
    print(f"  Toplam beğeni        : {total_reactions}")
    print(f"  Toplam yorum         : {total_comments}")
    print(
        "  Toplam okuma süresi  : "
        f"{total_reading} dk "
        f"({total_reading // 60} saat {total_reading % 60} dk)"
    )

    if total_reactions > 0:
        avg_reactions = total_reactions / len(articles)
        print(f"  Ort. beğeni/makale   : {avg_reactions:.1f}")

    if all_tags:
        print("\n  En sık etiketler:")
        top_tags = sorted(all_tags.items(), key=lambda x: x[1], reverse=True)[:8]
        for tag, count in top_tags:
            bar = "█" * count
            print(f"    #{tag:<22} {bar} ({count})")

    if top_by_reactions:
        print("\n  🏆 En çok beğenilen makaleler:")
        for i, a in enumerate(top_by_reactions):
            title_short = a["title"][:45]
            if len(a["title"]) > 45:
                title_short += "..."
            print(f"    {i + 1}. {title_short} ({a['reactions_count']} ❤️)")

    # Ham JSON örneği (ilk makale, raw_platform_data hariç)
    if articles:
        print(f"\n{'=' * 60}")
        print("  📋 Ham Veri Örneği (ilk makale — JSON, raw_platform_data hariç)")
        print(f"{'=' * 60}")
        preview_article = {
            k: v for k, v in articles[0].items() if k != "raw_platform_data"
        }
        print(json.dumps(preview_article, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    asyncio.run(main())
