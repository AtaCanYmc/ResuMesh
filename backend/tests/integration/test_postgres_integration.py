import os

import pytest
from sqlalchemy import create_engine
from testcontainers.postgres import PostgresContainer

from app.config.database import Base
from app.db.providers.postgres_provider import PostgresSearchRepository

# Will be initialized in fixture
postgres = None


@pytest.fixture(scope="module", autouse=True)
def setup_postgres(request):
    """Start PostgreSQL container and create tables"""
    try:
        global postgres
        postgres = PostgresContainer("postgres:15-alpine")
        postgres.start()
    except Exception as e:
        pytest.skip(f"Docker is not available or container failed to start: {e}")

    def remove_container():
        if postgres:
            postgres.stop()

    request.addfinalizer(remove_container)

    # Set up DB connection and schema
    db_url = postgres.get_connection_url()
    # Replace +psycopg2 with asyncpg if needed, or just use sync engine for setup
    engine = create_engine(db_url)
    Base.metadata.create_all(bind=engine)

    # Set environment variable so the app uses this DB
    os.environ["DATABASE_URL"] = db_url.replace("psycopg2", "asyncpg")


@pytest.mark.asyncio
async def test_postgres_global_search_ilike():
    """Verify PostgreSQL search queries with ILIKE and array containment"""

    from app.config.database import engine
    from app.db.providers.postgres_provider import PostgresProjectRepository
    from app.schemas.project import ProjectCreate

    # Create tables in sync engine
    with engine.begin():
        Base.metadata.drop_all(bind=engine)
        Base.metadata.create_all(bind=engine)

    # Seed data
    project_repo = PostgresProjectRepository()

    await project_repo.create_project(
        ProjectCreate(
            title="Postgres ILIKE Test",
            description="Testing case insensitive search",
            github_url="https://github.com/test",
            languages=["Python", "SQL"],
            tags=["database"],
        )
    )

    search_repo = PostgresSearchRepository()

    # Perform search using case insensitive query
    result = await search_repo.global_search("ILIKE")

    assert len(result.projects) == 1
    assert result.projects[0].title == "Postgres ILIKE Test"

    # Search by array item
    result_lang = await search_repo.global_search("Python")
    assert len(result_lang.projects) == 1

    # Empty search
    result_empty = await search_repo.global_search("nonexistent")
    assert len(result_empty.projects) == 0
