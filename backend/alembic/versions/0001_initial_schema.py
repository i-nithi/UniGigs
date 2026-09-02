"""Initial schema: users, gigs, applications, transactions, reviews, notifications

Revision ID: 0001_initial_schema
Revises: 
Create Date: 2026-09-02 19:05:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '0001_initial_schema'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Create USERS table
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('registration_number', sa.String(length=50), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('email', sa.String(length=150), nullable=False),
        sa.Column('department', sa.String(length=100), nullable=True),
        sa.Column('year', sa.String(length=20), nullable=True),
        sa.Column('profile_image', sa.String(length=255), nullable=True),
        sa.Column('bio', sa.Text(), nullable=True),
        sa.Column('skills', sa.JSON(), nullable=True),
        sa.Column('is_verified', sa.Boolean(), nullable=False, server_default=sa.text('false')),
        sa.Column('trust_score', sa.Integer(), nullable=False, server_default=sa.text('85')),
        sa.Column('average_rating', sa.Float(), nullable=False, server_default=sa.text('5.0')),
        sa.Column('completed_gigs_count', sa.Integer(), nullable=False, server_default=sa.text('0')),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    op.create_index(op.f('ix_users_registration_number'), 'users', ['registration_number'], unique=True)

    # 2. Create GIGS table
    op.create_table(
        'gigs',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('title', sa.String(length=150), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('category', sa.String(length=50), nullable=False),
        sa.Column('reward_amount', sa.Float(), nullable=False),
        sa.Column('location', sa.String(length=100), nullable=False),
        sa.Column('estimated_duration', sa.String(length=50), nullable=True),
        sa.Column('deadline', sa.DateTime(timezone=True), nullable=True),
        sa.Column('required_skills', sa.JSON(), nullable=True),
        sa.Column(
            'status',
            sa.Enum(
                'OPEN', 'APPLICATIONS_OPEN', 'WORKER_SELECTED', 'IN_PROGRESS',
                'WORK_SUBMITTED', 'COMPLETED', 'CANCELLED', 'DISPUTED',
                name='gigstatus'
            ),
            nullable=False,
            server_default='OPEN'
        ),
        sa.Column('poster_id', sa.Integer(), nullable=False),
        sa.Column('selected_worker_id', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.CheckConstraint('reward_amount > 0', name='chk_positive_reward'),
        sa.ForeignKeyConstraint(['poster_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['selected_worker_id'], ['users.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_gigs_id'), 'gigs', ['id'], unique=False)
    op.create_index(op.f('ix_gigs_title'), 'gigs', ['title'], unique=False)
    op.create_index(op.f('ix_gigs_category'), 'gigs', ['category'], unique=False)
    op.create_index(op.f('ix_gigs_status'), 'gigs', ['status'], unique=False)
    op.create_index(op.f('ix_gigs_poster_id'), 'gigs', ['poster_id'], unique=False)
    op.create_index(op.f('ix_gigs_selected_worker_id'), 'gigs', ['selected_worker_id'], unique=False)

    # 3. Create APPLICATIONS table
    op.create_table(
        'applications',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('gig_id', sa.Integer(), nullable=False),
        sa.Column('applicant_id', sa.Integer(), nullable=False),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('estimated_completion_time', sa.String(length=100), nullable=True),
        sa.Column(
            'status',
            sa.Enum('PENDING', 'SELECTED', 'REJECTED', 'WITHDRAWN', name='applicationstatus'),
            nullable=False,
            server_default='PENDING'
        ),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['applicant_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['gig_id'], ['gigs.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('gig_id', 'applicant_id', name='uq_gig_applicant')
    )
    op.create_index(op.f('ix_applications_id'), 'applications', ['id'], unique=False)
    op.create_index(op.f('ix_applications_gig_id'), 'applications', ['gig_id'], unique=False)
    op.create_index(op.f('ix_applications_applicant_id'), 'applications', ['applicant_id'], unique=False)
    op.create_index(op.f('ix_applications_status'), 'applications', ['status'], unique=False)

    # 4. Create TRANSACTIONS table
    op.create_table(
        'transactions',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('gig_id', sa.Integer(), nullable=True),
        sa.Column('sender_id', sa.Integer(), nullable=False),
        sa.Column('receiver_id', sa.Integer(), nullable=False),
        sa.Column('amount', sa.Float(), nullable=False),
        sa.Column(
            'status',
            sa.Enum('PENDING', 'LOCKED_IN_ESCROW', 'RELEASED', 'REFUNDED', 'FAILED', name='transactionstatus'),
            nullable=False
        ),
        sa.Column(
            'transaction_type',
            sa.Enum('PAYMENT', 'REFUND', 'PAYOUT', name='transactiontype'),
            nullable=False
        ),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['gig_id'], ['gigs.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['receiver_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['sender_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_transactions_id'), 'transactions', ['id'], unique=False)
    op.create_index(op.f('ix_transactions_gig_id'), 'transactions', ['gig_id'], unique=False)
    op.create_index(op.f('ix_transactions_sender_id'), 'transactions', ['sender_id'], unique=False)
    op.create_index(op.f('ix_transactions_receiver_id'), 'transactions', ['receiver_id'], unique=False)
    op.create_index(op.f('ix_transactions_status'), 'transactions', ['status'], unique=False)
    op.create_index(op.f('ix_transactions_transaction_type'), 'transactions', ['transaction_type'], unique=False)

    # 5. Create REVIEWS table
    op.create_table(
        'reviews',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('gig_id', sa.Integer(), nullable=False),
        sa.Column('reviewer_id', sa.Integer(), nullable=False),
        sa.Column('reviewee_id', sa.Integer(), nullable=False),
        sa.Column('rating', sa.Integer(), nullable=False),
        sa.Column('comment', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.CheckConstraint('rating >= 1 AND rating <= 5', name='chk_valid_rating'),
        sa.ForeignKeyConstraint(['gig_id'], ['gigs.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['reviewee_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['reviewer_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('gig_id', 'reviewer_id', 'reviewee_id', name='uq_gig_reviewer_reviewee')
    )
    op.create_index(op.f('ix_reviews_id'), 'reviews', ['id'], unique=False)
    op.create_index(op.f('ix_reviews_gig_id'), 'reviews', ['gig_id'], unique=False)
    op.create_index(op.f('ix_reviews_reviewer_id'), 'reviews', ['reviewer_id'], unique=False)
    op.create_index(op.f('ix_reviews_reviewee_id'), 'reviews', ['reviewee_id'], unique=False)

    # 6. Create NOTIFICATIONS table
    op.create_table(
        'notifications',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(length=150), nullable=False),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column(
            'notification_type',
            sa.Enum(
                'APPLICATION_RECEIVED', 'APPLICATION_SELECTED', 'APPLICATION_REJECTED',
                'GIG_STATUS_CHANGED', 'PAYMENT_LOCKED', 'PAYMENT_RELEASED',
                'REVIEW_RECEIVED', 'SYSTEM', name='notificationtype'
            ),
            nullable=False
        ),
        sa.Column('is_read', sa.Boolean(), nullable=False, server_default=sa.text('false')),
        sa.Column('related_gig_id', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['related_gig_id'], ['gigs.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_notifications_id'), 'notifications', ['id'], unique=False)
    op.create_index(op.f('ix_notifications_user_id'), 'notifications', ['user_id'], unique=False)
    op.create_index(op.f('ix_notifications_notification_type'), 'notifications', ['notification_type'], unique=False)
    op.create_index(op.f('ix_notifications_related_gig_id'), 'notifications', ['related_gig_id'], unique=False)


def downgrade() -> None:
    op.drop_table('notifications')
    op.drop_table('reviews')
    op.drop_table('transactions')
    op.drop_table('applications')
    op.drop_table('gigs')
    op.drop_table('users')
