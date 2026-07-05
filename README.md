# ResuMesh

ResuMesh, geliştiriciler için GitHub, LinkedIn, Medium, Dev.to gibi platformlardaki verileri bir araya toplayıp kişisel portfolyo ve yapay zeka destekli CV oluşturmaya yarayan bir web uygulamasıdır.

## Proje Mimarisi

- **Backend:** Python, FastAPI, Pydantic
- **Veritabanı:** Agnostik Yapı (PostgreSQL, MongoDB, Firebase, Supabase desteği)
- **Frontend:** React, Vite (Faz 2'de eklenecek)

## Başlangıç

### Backend Kurulumu

1. `backend` dizinine gidin:
   ```bash
   cd backend
   ```

2. Sanal ortam (virtual environment) oluşturun ve aktif edin:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # Windows için: .venv\Scripts\activate
   ```

3. Bağımlılıkları yükleyin:
   ```bash
   pip install -r requirements.txt
   ```

4. Veritabanı ayarları için `.env` dosyasını oluşturun (Örnek olarak `.env.example` dosyasını kullanabilirsiniz). Docker ile PostgreSQL ve MongoDB'yi hızlıca başlatmak için:
   ```bash
   docker compose up -d
   ```

5. Geliştirme sunucusunu başlatın:
   ```bash
   uvicorn app.main:app --reload
   ```

6. Tarayıcınızda `http://127.0.0.1:8000/docs` adresine giderek otomatik oluşturulan Swagger API dokümantasyonunu inceleyebilirsiniz.

## Katkıda Bulunma

Geliştirme aşamasındadır.
