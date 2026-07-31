"""create sections table

Revision ID: 002_sections
Revises: 001_social_links
Create Date: 2026-07-29

"""
from alembic import op
import sqlalchemy as sa

revision = "002_sections"
down_revision = "001_social_links"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "sections",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("key", sa.String(length=50), nullable=False),
        sa.Column("title", sa.String(length=100), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("order_index", sa.Integer(), nullable=False, server_default="0"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=True,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=True,
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("key"),
    )
    op.create_index(op.f("ix_sections_id"), "sections", ["id"], unique=False)
    op.create_index(op.f("ix_sections_key"), "sections", ["key"], unique=True)


def downgrade() -> None:
    op.drop_index(op.f("ix_sections_key"), table_name="sections")
    op.drop_index(op.f("ix_sections_id"), table_name="sections")
    op.drop_table("sections")
