"""
Example: GitHub Repository Fetching
====================================
Bu script, GitHub REST API'yi kullanarak bir kullanıcının
public repolarını çeker ve konsola yazdırır.

Bağımlılıklar:
    pip install httpx

Kullanım:
    # Backend klasöründen çalıştırın:
    python -m examples.fetch_github

    # Farklı kullanıcı için:
    GITHUB_USERNAME=torvalds python -m examples.fetch_github

Ortam değişkenleri:
    GITHUB_USERNAME  - GitHub kullanıcı adı (zorunlu değil, varsayılan: "github")
    GITHUB_PAT       - GitHub Personal Access Token (opsiyonel,
                       rate limit artırmak için)
"""

import asyncio
import json
import os

from dotenv import load_dotenv

from app.services.scrapers.github_scraper import GitHubScraperService

load_dotenv()


async def fetch_github_repos(username: str, pat: str | None = None) -> list[dict]:
    """
    GitHub REST API'den kullanıcının public repolarını çeker.

    Args:
        username: GitHub kullanıcı adı
        pat: Personal Access Token (opsiyonel). Eklenmesi durumunda
             rate limit 60/saat'ten 5000/saat'e çıkar.

    Returns:
        Fork olmayan repoların listesi (dict)
    """
    print(f"🔗 GitHub repos çekiliyor: @{username}")
    projects = await GitHubScraperService.fetch_repos(username=username, pat=pat)
    print(f"📦 Toplam repo alındı (fork hariç): {len(projects)}")

    return [project.model_dump(mode="json") for project in projects]


def print_repo(repo: dict, index: int) -> None:
    """Tek bir repoyu güzel formatlanmış şekilde konsola yazdırır."""
    print(f"\n{'─' * 50}")
    print(f"  #{index + 1}  {repo['title']}")
    print(f"{'─' * 50}")

    if repo["description"]:
        print(f"  📄 Açıklama   : {repo['description']}")

    print(f"  🔗 URL        : {repo['github_url']}")
    print(f"  ⭐ Yıldız     : {repo['stars']}")
    print(f"  🍴 Fork       : {repo['forks']}")
    print(f"  👁  Takip      : {repo['watchers']}")

    if repo["languages"]:
        print(f"  💻 Dil        : {', '.join(repo['languages'])}")

    if repo["tags"]:
        print(f"  🏷  Etiketler  : {', '.join(repo['tags'])}")

    if repo.get("updated_at"):
        print(f"  🕒 Güncelleme : {repo['updated_at']}")


async def main():
    username = os.getenv("GITHUB_USERNAME", "github")
    pat = os.getenv("GITHUB_PAT")

    print("=" * 60)
    print("  ResuMesh — GitHub Repo Çekme Örneği")
    print(f"  Kullanıcı: @{username}")
    if pat:
        print("  🔑 PAT kullanılıyor (yüksek rate limit)")
    else:
        print("  ⚠️  PAT yok — rate limit: 60 istek/saat")
    print("=" * 60)

    repos = await fetch_github_repos(username, pat)

    if not repos:
        print("⚠️  Hiç repo bulunamadı veya bir hata oluştu.")
        return

    print(f"\n✅ Fork olmayan repo sayısı: {len(repos)}")

    # İlk 5 repoyu göster
    preview = repos[:5]
    for i, repo in enumerate(preview):
        print_repo(repo, i)

    if len(repos) > 5:
        print(f"\n... ve {len(repos) - 5} repo daha.")

    # İstatistik özeti
    total_stars = sum(r["stars"] for r in repos)
    total_forks = sum(r["forks"] for r in repos)
    lang_counts: dict[str, int] = {}
    for r in repos:
        for lang in r["languages"]:
            lang_counts[lang] = lang_counts.get(lang, 0) + 1

    print(f"\n{'=' * 60}")
    print("  📊 Özet İstatistikler")
    print(f"{'=' * 60}")
    print(f"  Toplam repo     : {len(repos)}")
    print(f"  Toplam yıldız   : {total_stars}")
    print(f"  Toplam fork     : {total_forks}")

    if lang_counts:
        top_langs = sorted(lang_counts.items(), key=lambda x: x[1], reverse=True)[:5]
        print("  En çok kullanılan diller:")
        for lang, count in top_langs:
            print(f"    - {lang}: {count} repo")

    # Ham JSON örneği (ilk repo)
    if repos:
        print(f"\n{'=' * 60}")
        print("  📋 Ham Veri Örneği (ilk repo — JSON)")
        print(f"{'=' * 60}")
        print(json.dumps(repos[0], indent=2, ensure_ascii=False))


if __name__ == "__main__":
    asyncio.run(main())
