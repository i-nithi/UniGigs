"""add gig lifecycle fields

Revision ID: 0002_gig_lifecycle_fields
Revises: 0001_initial_schema
Create Date: 2026-09-02 19:28:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '0002_gig_lifecycle_fields'
down_revision = '0001_initial_schema'
branch_labels = None
depends_on = None

def upgrade() -> None:
    op.add_column('gigs', sa.Column('submission_note', sa.Text(), nullable=True))
    op.add_column('gigs', sa.Column('submission_link', sa.String(length=500), nullable=True))
    op.add_column('gigs', sa.Column('submitted_at', sa.DateTime(timezone=True), nullable=True))
    op.add_column('gigs', sa.Column('completed_at', sa.DateTime(timezone=True), nullable=True))
    op.add_column('gigs', sa.Column('cancelled_at', sa.DateTime(timezone=True), nullable=True))

def downgrade() -> None:
    op.drop_column('gigs', 'cancelled_at')
    op.drop_column('gigs', 'completed_at')
    op.drop_column('gigs', 'submitted_at')
    op.drop_column('gigs', 'submission_link')
    op.drop_column('gigs', 'submission_note')
