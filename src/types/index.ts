export type UserMode = 'REQUESTER' | 'TASKER';

export type TaskMode = 'ONLINE' | 'ONSITE' | 'FLEXIBLE';

export type TaskStatus = 'DRAFT' | 'OPEN' | 'AWARDED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export type UserRole = 'GUEST' | 'USER' | 'STAFF' | 'ADMIN';

export type ActiveScreen =
  | 'HOME'
  | 'MY_TASKS'
  | 'MY_JOBS'
  | 'ORDER_WORKSPACE'
  | 'ORDER_MANAGEMENT'
  | 'PUBLIC_PORTFOLIO'
  | 'INTEGRITY_POLICY'
  | 'STUDENT_ANALYTICS'
  | 'TASK_DETAIL'
  | 'CREATE_TASK'
  | 'CHECKOUT_ESCROW'
  | 'MESSAGES'
  | 'WALLET'
  | 'SAVED_TASKS'
  | 'DISPUTES'
  | 'NOTIFICATIONS'
  | 'PROFILE'
  | 'HELP_CENTER'
  | 'ADMIN'
  | 'STAFF'
  | 'LOGGED_OUT'
  | 'CAMPUS_HUB'
  | 'REVIEWS_CENTER'
  | 'VERIFICATION_CENTER';

export interface University {
  id: string;
  name: string;
  shortName: string;
  city: 'Hà Nội' | 'TP. Hồ Chí Minh' | 'Đà Nẵng' | 'Khác';
}

export interface UserProfile {
  id: string;
  displayName: string;
  university: string;
  major: string;
  avatarBg: string;
  avatarUrl?: string;
  rating: number;
  reviewCount: number;
  tasksCompleted: number;
  isVerifiedStudent: boolean;
  role: 'STUDENT' | 'STAFF' | 'ADMIN';
  email?: string;
  studentId?: string;
  bio?: string;
  skills?: string[];
  phoneNumber?: string;
  graduationYear?: string;
  headline?: string;
  portfolioUrl?: string;
  githubUrl?: string;
  zaloContact?: string;
  bankName?: string;
  bankAccountNumber?: string;
  bankAccountName?: string;
  hourlyRate?: number;
  availableHoursPerWeek?: number;
}

export interface TaskAttachment {
  name: string;
  size: string;
  type: string;
}

export type TaskTimeFilter = 'ALL' | 'NEWEST' | 'PAST_24H' | 'PAST_3DAYS';

export type TaskTrustFilter = 'ALL' | 'VERIFIED_ONLY' | 'TOP_REPUTATION';

export interface TaskItem {
  id: string;
  title: string;
  categoryId: string;
  categoryName: string;
  description: string;
  expectedOutput: string;
  budget: number; // in VND (integer)
  deadline: string;
  mode: TaskMode;
  location?: string;
  status: TaskStatus;
  requester: UserProfile;
  offersCount: number;
  createdAt: string;
  createdTimestamp?: number;
  attachments?: TaskAttachment[];
  tags: string[];
}

export interface TaskCategory {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  taskCount: number;
  description: string;
}

export type OfferStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';

export interface OfferItem {
  id: string;
  taskId: string;
  taskTitle: string;
  tasker: UserProfile;
  proposedPrice: number;
  deliveryDays: number;
  message: string;
  status: OfferStatus;
  createdAt: string;
}

export type OrderStatus =
  | 'AWAITING_PAYMENT'
  | 'IN_PROGRESS'
  | 'DELIVERED'
  | 'REVISION_REQUESTED'
  | 'COMPLETED'
  | 'DISPUTED'
  | 'CANCELLED'
  | 'REFUNDED';

export interface OrderItem {
  id: string;
  taskId: string;
  taskTitle: string;
  requester: UserProfile;
  tasker: UserProfile;
  agreedPrice: number;
  platformFee: number;
  payoutAmount: number;
  deadline: string;
  status: OrderStatus;
  createdAt: string;
  deliveries: DeliveryItem[];
}

export interface DeliveryItem {
  id: string;
  orderId: string;
  submittedBy: string;
  note: string;
  fileName: string;
  fileSize: string;
  version: number;
  createdAt: string;
  status: 'PENDING' | 'ACCEPTED' | 'REVISION_REQUESTED';
}

export interface OrderMessage {
  id: string;
  orderId: string;
  senderId: string;
  senderName: string;
  senderRole: 'REQUESTER' | 'TASKER' | 'STAFF';
  content: string;
  createdAt: string;
  attachmentName?: string;
}

export interface VerificationRequest {
  id: string;
  studentName: string;
  studentEmail: string;
  studentId: string;
  university: string;
  submittedAt: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  evidenceRef: string;
  reviewedBy?: string;
  reviewNotes?: string;
}

export interface ReportItem {
  id: string;
  reporterName: string;
  targetType: 'TASK' | 'USER' | 'ORDER' | 'MESSAGE';
  targetId: string;
  targetTitle?: string;
  reason: string;
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'ESCALATED_TO_ADMIN';
  handledByStaff?: string;
  actionTaken?: 'WARNING_SENT' | 'TASK_DELISTED' | 'SUSPEND_REQUESTED' | 'NO_VIOLATION' | 'ESCALATED';
  staffNote?: string;
  createdAt: string;
}

export interface SupportTicketMessage {
  id: string;
  senderName: string;
  senderRole: 'STUDENT' | 'STAFF';
  content: string;
  timestamp: string;
}

export interface SupportTicketItem {
  id: string;
  studentName: string;
  studentEmail: string;
  university: string;
  subject: string;
  category: 'ESCROW_WALLET' | 'TASK_ORDER' | 'VERIFICATION' | 'ACCOUNT' | 'OTHER';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'IN_PROGRESS' | 'ANSWERED' | 'RESOLVED';
  assignedStaff?: string;
  messages: SupportTicketMessage[];
  createdAt: string;
}

export interface StaffMember {
  id: string;
  name: string;
  staffCode: string;
  email: string;
  avatarBg: string;
  role: 'STAFF';
  shift: 'Sáng (08:00 - 16:00)' | 'Chiều (16:00 - 23:00)' | 'Đêm (23:00 - 08:00)';
  status: 'ONLINE' | 'AWAY' | 'OFFLINE';
  todayVerifiedCount: number;
  todayDisputesCount: number;
  todayTicketsCount: number;
  avgResolutionMinutes: number;
  csatRating: number;
}

export interface FaqItem {
  id: string;
  question: string;
  officialAnswer: string;
  staffName: string;
  staffBadge: string;
  updatedAt: string;
}

export type TransactionType = 'DEPOSIT' | 'ESCROW_HOLD' | 'ESCROW_RELEASE' | 'PAYOUT_WITHDRAWAL' | 'REFUND';

export interface WalletTransaction {
  id: string;
  type: TransactionType;
  amount: number;
  title: string;
  orderId?: string;
  counterparty?: string;
  status: 'COMPLETED' | 'PENDING' | 'PROCESSING';
  createdAt: string;
}

export interface DisputeItem {
  id: string;
  orderId: string;
  taskTitle: string;
  claimant: UserProfile;
  defendant: UserProfile;
  reason: string;
  claimantRole: 'REQUESTER' | 'TASKER';
  amount: number;
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED_REFUND' | 'RESOLVED_PAYOUT' | 'RESOLVED_SPLIT' | 'ESCALATED_TO_ADMIN';
  resolution?: string;
  handledByStaff?: string;
  escalatedReason?: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  type:
    | 'OFFER_RECEIVED'
    | 'OFFER_ACCEPTED'
    | 'DELIVERY_SUBMITTED'
    | 'REVISION_REQUESTED'
    | 'ORDER_COMPLETED'
    | 'DISPUTE_OPENED'
    | 'VERIFIED'
    | 'SYSTEM';
  title: string;
  content: string;
  targetScreen: ActiveScreen;
  targetId?: string;
  read: boolean;
  createdAt: string;
}

export interface StudentReviewItem {
  id: string;
  orderId: string;
  taskTitle: string;
  reviewer: UserProfile;
  reviewee: UserProfile;
  reviewerRole: 'REQUESTER' | 'TASKER';
  ratingQuality: number;
  ratingTimeliness: number;
  ratingCommunication: number;
  overallRating: number;
  comment: string;
  tags: string[];
  response?: string;
  createdAt: string;
}

export interface CampusLeaderboardUser {
  id: string;
  rank: number;
  name: string;
  university: string;
  major: string;
  completedTasks: number;
  earnedVnd: number;
  rating: number;
  avatarBg: string;
  badge: string;
  skills: string[];
}

export interface DirectMessage {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

export interface ChatThread {
  id: string;
  peerUser: UserProfile;
  taskId?: string;
  taskTitle?: string;
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
  messages: DirectMessage[];
}

export interface EscrowCheckoutDraft {
  taskId: string;
  taskTitle: string;
  offerId: string;
  tasker: UserProfile;
  amount: number;
  deadline: string;
  platformFee: number;
  guaranteePledge: string;
}

export interface HelpTopic {
  id: string;
  title: string;
  category: 'ESCROW' | 'DISPUTE' | 'STUDENT_RULES' | 'WITHDRAWAL' | 'SAFETY';
  summary: string;
  content: string[];
}

export interface AuditLogEntry {
  id: string;
  actor: string;
  actorRole: 'STAFF' | 'ADMIN' | 'SYSTEM';
  action: string;
  target: string;
  timestamp: string;
  status: 'SUCCESS' | 'WARNING' | 'CRITICAL';
  details?: string;
}

export interface PlatformConfig {
  platformFeePercent: number;
  minWithdrawalVND: number;
  autoEscrowReleaseHours: number;
  maintenanceMode: boolean;
  slaKycTargetMinutes: number;
}

export interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl?: string;
  tags: string[];
  clientUniversity?: string;
  completionDate: string;
  rating: number;
  projectUrl?: string;
  githubUrl?: string;
}

export interface StudentSkillBadge {
  name: string;
  level: 'Cơ bản' | 'Thành thạo' | 'Chuyên gia';
  verifiedCount: number;
  endorsedByStaff: boolean;
}

export interface ContractVoucherData {
  orderId: string;
  taskTitle: string;
  requesterName: string;
  requesterUni: string;
  requesterStudentId?: string;
  taskerName: string;
  taskerUni: string;
  taskerStudentId?: string;
  agreedPrice: number;
  escrowRef: string;
  createdAt: string;
  deadline: string;
  status: string;
  escrowPledgeHash: string;
}

