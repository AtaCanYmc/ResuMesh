import os
from fastapi import Depends
from app.db.base import ProjectRepository
from app.db.providers.postgres_provider import PostgresProvider
from app.db.providers.mongo_provider import MongoProvider
from app.db.providers.firebase_provider import FirebaseProvider
from app.db.providers.supabase_provider import SupabaseProvider

# Singleton instances
_postgres_provider = None
_mongo_provider = None
_firebase_provider = None
_supabase_provider = None

def get_db_provider() -> ProjectRepository:
    provider_name = os.getenv("DB_PROVIDER", "local-postgres").lower()
    
    if provider_name == "local-postgres":
        global _postgres_provider
        if not _postgres_provider:
            _postgres_provider = PostgresProvider()
        return _postgres_provider
        
    elif provider_name == "mongodb":
        global _mongo_provider
        if not _mongo_provider:
            _mongo_provider = MongoProvider()
        return _mongo_provider
        
    elif provider_name == "firebase":
        global _firebase_provider
        if not _firebase_provider:
            _firebase_provider = FirebaseProvider()
        return _firebase_provider
        
    elif provider_name == "supabase":
        global _supabase_provider
        if not _supabase_provider:
            _supabase_provider = SupabaseProvider()
        return _supabase_provider
        
    else:
        raise ValueError(f"Unknown DB_PROVIDER: {provider_name}")
