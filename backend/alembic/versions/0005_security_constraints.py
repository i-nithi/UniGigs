"""0005_security_constraints

Revision ID: 0005_security_constraints
Revises: 0004_notification_schema
Create Date: 2026-09-02 20:15:00.000000

"""
from alembic import op
import sqlalchemy as sa

revision = '0005_security_constraints'
down_revision = '0004_notification_schema'
branch_labels = None
depends_on = None

def upgrade() -> None:
    # Add CheckConstraint on wallets for non-negative balances
    op.create_check_constraint(
        'ck_wallet_balance_non_negative',
        'wallets',
        'available_balance >= 0 AND locked_balance >= 0'
    )


def downgrade() -> None:
    op.drop_constraint('ck_wallet_balance_non_negative', 'wallets', type_='check')
