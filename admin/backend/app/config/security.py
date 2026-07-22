import os

SECRET_KEY = os.getenv(
    "SUPABASE_JWT_SECRET", os.getenv("JWT_SECRET_KEY", "test-secret-key")
)
ALGORITHM = "HS256"
