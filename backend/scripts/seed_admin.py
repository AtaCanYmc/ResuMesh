import os
import sys

from dotenv import load_dotenv  # noqa: E402

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
load_dotenv()

from app.config.database import Base, SessionLocal, engine  # noqa: E402
from app.config.security import SecurityUtils  # noqa: E402
from app.models.user import User  # noqa: E402


def seed_admin():
    db = SessionLocal()
    try:
        # Check if admin already exists
        admin_username = os.getenv("ADMIN_USERNAME", "admin")
        existing_user = db.query(User).filter(User.username == admin_username).first()

        if existing_user:
            print(f"Admin user '{admin_username}' already exists.")
            return

        admin_password = os.getenv("ADMIN_PASSWORD", "admin")
        password_hash = SecurityUtils.hash_password(admin_password)

        new_user = User(username=admin_username, password_hash=password_hash)
        db.add(new_user)
        db.commit()
        print(f"Admin user '{admin_username}' created successfully.")
    except Exception as e:
        print(f"Error seeding admin user: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    # Ensure tables exist (since Alembic might not have been run yet during seeding)
    # Usually you'd rely on Alembic, but we'll do this to be safe in dev.
    Base.metadata.create_all(bind=engine)
    seed_admin()
