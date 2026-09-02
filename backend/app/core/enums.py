from enum import Enum

class GigStatus(str, Enum):
    """
    Status lifecycle of a campus Gig.
    """
    OPEN = "OPEN"
    APPLICATIONS_OPEN = "APPLICATIONS_OPEN"
    WORKER_SELECTED = "WORKER_SELECTED"
    IN_PROGRESS = "IN_PROGRESS"
    WORK_SUBMITTED = "WORK_SUBMITTED"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"
    DISPUTED = "DISPUTED"


class ApplicationStatus(str, Enum):
    """
    Status of a student application for a Gig.
    """
    PENDING = "PENDING"
    SELECTED = "SELECTED"
    REJECTED = "REJECTED"
    WITHDRAWN = "WITHDRAWN"


class EscrowStatus(str, Enum):
    """
    Status of locked escrow funds.
    """
    LOCKED = "LOCKED"
    RELEASED = "RELEASED"
    REFUNDED = "REFUNDED"
    CANCELLED = "CANCELLED"


class TransactionStatus(str, Enum):
    """
    Status of simulated escrow and wallet transaction.
    """
    PENDING = "PENDING"
    COMPLETED = "COMPLETED"
    LOCKED_IN_ESCROW = "LOCKED_IN_ESCROW"
    RELEASED = "RELEASED"
    REFUNDED = "REFUNDED"
    FAILED = "FAILED"


class TransactionType(str, Enum):
    """
    Type of financial movement in UniGigs platform.
    """
    ESCROW_LOCK = "ESCROW_LOCK"
    ESCROW_RELEASE = "ESCROW_RELEASE"
    ESCROW_REFUND = "ESCROW_REFUND"
    PAYMENT = "PAYMENT"
    REFUND = "REFUND"
    PAYOUT = "PAYOUT"


class NotificationType(str, Enum):
    """
    Type of system / event notification sent to a student.
    """
    GIG_APPLICATION_RECEIVED = "GIG_APPLICATION_RECEIVED"
    APPLICATION_RECEIVED = "APPLICATION_RECEIVED"
    APPLICATION_WITHDRAWN = "APPLICATION_WITHDRAWN"
    WORKER_SELECTED = "WORKER_SELECTED"
    APPLICATION_SELECTED = "APPLICATION_SELECTED"
    APPLICATION_REJECTED = "APPLICATION_REJECTED"
    GIG_STARTED = "GIG_STARTED"
    WORK_SUBMITTED = "WORK_SUBMITTED"
    GIG_COMPLETED = "GIG_COMPLETED"
    PAYMENT_LOCKED = "PAYMENT_LOCKED"
    PAYMENT_RELEASED = "PAYMENT_RELEASED"
    PAYMENT_REFUNDED = "PAYMENT_REFUNDED"
    REVIEW_RECEIVED = "REVIEW_RECEIVED"
    GIG_CANCELLED = "GIG_CANCELLED"
    GIG_STATUS_CHANGED = "GIG_STATUS_CHANGED"
    SYSTEM = "SYSTEM"
