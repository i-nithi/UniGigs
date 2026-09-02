"""create notification schema

Revision ID: 0004_notification_schema
Revises: 0003_wallet_escrow_schema
Create Date: 2026-09-02 19:59:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '0004_notification_schema'
down_revision = '0003_wallet_escrow_schema'
branch_labels = None
depends_on = None

def upgrade() -> None:
    op.create_table(
        'notifications',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('type', sa.Enum(
            'GIG_APPLICATION_RECEIVED',
            'APPLICATION_WITHDRAWN',
            'WORKER_SELECTED',
            'APPLICATION_REJECTED',
            'GIG_STARTED',
            'WORK_SUBMITTED',
            'GIG_COMPLETED',
            'PAYMENT_LOCKED',
            'PAYMENT_RELEASED',
            'PAYMENT_REFUNDED',
            'REVIEW_RECEIVED',
            'GIG_CANCELLED',
            'GIG_STATUS_CHANGED',
            'PAYMENT_LOCKED_LEGACY',
            'SYSTEM',
            name='notificationtype'
        ), nullable=False),
        sa.Column('title', sa.String(length=150), nullable=False),
        sa.Column('message', sa.String(length=500), nullable=False),
        sa.Column('is_read', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('related_gig_id', sa.Integer(), sa.ForeignKey('gigs.id', ondelete='SET NULL'), nullable=True),
        sa.Column('related_application_id', sa.Integer(), sa.ForeignKey('applications.id', ondelete='SET NULL'), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('read_at', sa.DateTime(timezone=True), nullable=True)
    )
    op.create_index('ix_notifications_user_id', 'notifications', ['user_id'])
    op.create_index('ix_notifications_is_read', 'notifications', ['is_read'])
    op.create_index('ix_notifications_created_at', 'notifications', ['created_at'])

def downgrade() -> None:
    op.drop_table('notifications')
