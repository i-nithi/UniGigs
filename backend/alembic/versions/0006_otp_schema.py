"""0006_otp_schema

Revision ID: 0006_otp_schema
Revises: 0005_security_constraints
Create Date: 2026-09-02 20:46:00.000000

"""
from alembic import op
import sqlalchemy as sa

revision = '0006_otp_schema'
down_revision = '0005_security_constraints'
branch_labels = None
depends_on = None

def upgrade() -> None:
    op.create_table(
        'otp_records',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('otp_code', sa.String(length=6), nullable=False),
        sa.Column('expires_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('is_used', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_otp_records_email', 'otp_records', ['email'], unique=False)
    op.create_index('ix_otp_records_expires_at', 'otp_records', ['expires_at'], unique=False)
    op.create_index('ix_otp_records_is_used', 'otp_records', ['is_used'], unique=False)


def downgrade() -> None:
    op.drop_table('otp_records')
