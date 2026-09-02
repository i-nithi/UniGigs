"""create wallet escrow and transaction schema

Revision ID: 0003_wallet_escrow_schema
Revises: 0002_gig_lifecycle_fields
Create Date: 2026-09-02 19:36:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '0003_wallet_escrow_schema'
down_revision = '0002_gig_lifecycle_fields'
branch_labels = None
depends_on = None

def upgrade() -> None:
    # Wallets table
    op.create_table(
        'wallets',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, unique=True),
        sa.Column('available_balance', sa.Numeric(precision=12, scale=2), nullable=False, server_default='10000.00'),
        sa.Column('locked_balance', sa.Numeric(precision=12, scale=2), nullable=False, server_default='0.00'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False)
    )
    op.create_index('ix_wallets_user_id', 'wallets', ['user_id'])

    # Escrows table
    op.create_table(
        'escrows',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('gig_id', sa.Integer(), sa.ForeignKey('gigs.id', ondelete='CASCADE'), nullable=False, unique=True),
        sa.Column('payer_id', sa.Integer(), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('payee_id', sa.Integer(), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('amount', sa.Numeric(precision=12, scale=2), nullable=False),
        sa.Column(
            'status',
            sa.Enum('LOCKED', 'RELEASED', 'REFUNDED', 'CANCELLED', name='escrowstatus'),
            nullable=False,
            server_default='LOCKED'
        ),
        sa.Column('locked_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('released_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('refunded_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False)
    )
    op.create_index('ix_escrows_gig_id', 'escrows', ['gig_id'])

def downgrade() -> None:
    op.drop_table('escrows')
    op.drop_table('wallets')
