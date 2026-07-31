"""create social_links table

Revision ID: 001_social_links
Revises:
Create Date: 2026-07-29

"""
from alembic import op
import sqlalchemy as sa

revision = "001_social_links"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "social_links",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("platform", sa.String(length=50), nullable=False),
        sa.Column("label", sa.String(length=100), nullable=False),
        sa.Column("url", sa.String(length=512), nullable=False),
        sa.Column("icon", sa.String(length=100), nullable=True),
        sa.Column("order_index", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
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
    )
    op.create_index(op.f("ix_social_links_id"), "social_links", ["id"], unique=False)
    op.create_index(
        op.f("ix_social_links_platform"), "social_links", ["platform"], unique=False
    )


def downgrade() -> None:
    op.drop_index(op.f("ix_social_links_platform"), table_name="social_links")
    op.drop_index(op.f("ix_social_links_id"), table_name="social_links")
    op.drop_table("social_links")
