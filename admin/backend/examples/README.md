# ResuMesh — Data Fetching Examples

Bu klasör, ResuMesh'in veri çekme servislerinin veritabanı bağlantısına
gerek duymadan nasıl çalıştığını gösteren bağımsız Python scriptlerini içerir.

## Dosyalar

| Dosya | Platform | Yöntem |
|---|---|---|
| `fetch_github.py` | GitHub | REST API (`api.github.com`) |
| `fetch_medium.py` | Medium | RSS Besleme (`medium.com/feed/@...`) |
| `fetch_devto.py` | Dev.to | REST API (`dev.to/api/articles`) |

## Kurulum

Örnekler `backend/` klasöründeki mevcut bağımlılıkları kullanır.
Yüklemediyseniz:

```bash
cd backend
pip install httpx feedparser
```

## Kullanım

Tüm scriptler **`backend/` klasöründen** modül olarak çalıştırılmalıdır:

```bash
cd backend

# GitHub repoları çek
GITHUB_USERNAME=octocat python -m examples.fetch_github

# Medium makaleleri çek
MEDIUM_USERNAME=medium python -m examples.fetch_medium

# Dev.to makaleleri çek
DEVTO_USERNAME=devteam python -m examples.fetch_devto
```

## Ortam Değişkenleri

### GitHub (`fetch_github.py`)

| Değişken | Zorunlu | Açıklama |
|---|---|---|
| `GITHUB_USERNAME` | ✅ | GitHub kullanıcı adı |
| `GITHUB_PAT` | ❌ | Personal Access Token — rate limit 60→5000/saat |

### Medium (`fetch_medium.py`)

| Değişken | Zorunlu | Açıklama |
|---|---|---|
| `MEDIUM_USERNAME` | ✅ | Medium kullanıcı adı (`@` olmadan) |

> **Not:** Medium'un RSS beslemesi API anahtarı gerektirmez.

### Dev.to (`fetch_devto.py`)

| Değişken | Zorunlu | Açıklama |
|---|---|---|
| `DEVTO_USERNAME` | ✅ | Dev.to kullanıcı adı |
| `DEVTO_API_KEY` | ❌ | API anahtarı — private makaleler ve yüksek rate limit |

Dev.to API anahtarı almak için:
[https://dev.to/settings/extensions](https://dev.to/settings/extensions) → "DEV Community API Keys"

## Üretim Servisi ile İlişkisi

Bu örnekler, `app/services/ingestion_service.py` içindeki
[`IngestionService`](../app/services/ingestion_service.py) sınıfının
aynı mantığını veritabanı katmanı olmadan gösterir:

| Örnek | `IngestionService` Metodu |
|---|---|
| `fetch_github.py` | `fetch_github_repos()` |
| `fetch_medium.py` | `fetch_medium_articles()` |
| `fetch_devto.py` | `fetch_devto_articles()` |
