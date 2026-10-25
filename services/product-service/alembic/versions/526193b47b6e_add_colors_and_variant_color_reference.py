"""add colors and variant color reference

Revision ID: 526193b47b6e
Revises: 4a27976f216c
"""

from collections.abc import Sequence
from uuid import uuid4

import sqlalchemy as sa

from alembic import op

revision: str = "526193b47b6e"
down_revision: str | Sequence[str] | None = "4a27976f216c"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "colors",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("name", sa.String(length=50), nullable=False),
        sa.Column("hex_code", sa.String(length=7), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("name", name="uq_colors_name"),
    )

    op.add_column(
        "product_variants",
        sa.Column("color_id", sa.UUID(), nullable=True),
    )

    op.create_index(
        "ix_product_variants_color_id",
        "product_variants",
        ["color_id"],
        unique=False,
    )

    op.create_foreign_key(
        "fk_product_variants_color_id_colors",
        "product_variants",
        "colors",
        ["color_id"],
        ["id"],
        ondelete="SET NULL",
    )

    # Backfill existing colours and preserve variant records.
    connection = op.get_bind()

    color_hex_codes = {
        "Red": "#FF0000",
        "Blue": "#0000FF",
        "Green": "#008000",
        "White": "#FFFFFF",
    }

    existing_colors = (
        connection.execute(
            sa.text(
                """
                SELECT DISTINCT attributes->>'color'
                FROM product_variants
                WHERE attributes->>'color' IS NOT NULL
                  AND trim(attributes->>'color') <> ''
                """
            )
        )
        .scalars()
        .all()
    )

    color_ids: dict[str, object] = {}

    for name in existing_colors:
        color_id = uuid4()
        hex_code = color_hex_codes.get(name, "#808080")

        connection.execute(
            sa.text(
                """
                INSERT INTO colors (id, name, hex_code)
                VALUES (:id, :name, :hex_code)
                """
            ),
            {
                "id": color_id,
                "name": name,
                "hex_code": hex_code,
            },
        )

        color_ids[name] = color_id

    for name, color_id in color_ids.items():
        connection.execute(
            sa.text(
                """
                UPDATE product_variants
                SET color_id = :color_id
                WHERE attributes->>'color' = :name
                """
            ),
            {
                "color_id": color_id,
                "name": name,
            },
        )


def downgrade() -> None:
    op.drop_constraint(
        "fk_product_variants_color_id_colors",
        "product_variants",
        type_="foreignkey",
    )
    op.drop_index(
        "ix_product_variants_color_id",
        table_name="product_variants",
    )
    op.drop_column("product_variants", "color_id")
    op.drop_table("colors")
