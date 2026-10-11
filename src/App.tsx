import React, { useState, useMemo } from 'react';
import {
  UserMode,
  TaskItem,
  TaskMode,
  ActiveScreen,
  OfferItem,
  OrderItem,
  OrderStatus,
  OrderMessage,
  UserProfile,
  WalletTransaction,
  DisputeItem,
  NotificationItem,
  CampusLeaderboardUser,
  StudentReviewItem,
  ChatThread,
  EscrowCheckoutDraft,
  TaskTimeFilter,
  TaskTrustFilter,
  VerificationRequest,
  ReportItem,
  SupportTicketItem,
  StaffMember,
  AuditLogEntry,
  PlatformConfig,
  TaskCategory,
} from './types';
import {
  INITIAL_TASKS,
  CATEGORIES,
  UNIVERSITIES,
  CURRENT_USER,
  MOCK_OFFERS,
  MOCK_ORDERS,
  MOCK_MESSAGES,
  MOCK_TRANSACTIONS,
  MOCK_DISPUTES,
  MOCK_NOTIFICATIONS,
  MOCK_CAMPUS_LEADERBOARD,
  MOCK_STUDENT_REVIEWS,
  MOCK_CHAT_THREADS,
  MOCK_VERIFICATIONS,
  MOCK_REPORTS,
  MOCK_SUPPORT_TICKETS,
  MOCK_STAFF_MEMBERS,
  MOCK_AUDIT_LOGS,
  DEFAULT_PLATFORM_CONFIG,
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { RoleSwitcherBar, UserRole } from './components/RoleSwitcherBar';
import { MvpScreenBar } from './components/MvpScreenBar';
import { CategoryNav } from './components/CategoryNav';
import { HeroSection } from './components/HeroSection';
import { StudentHomeBanner } from './components/StudentHomeBanner';
import { TaskCard } from './components/TaskCard';
import { TaskDetailModal } from './components/TaskDetailModal';
import { PostTaskModal } from './components/PostTaskModal';
import { VerifyModal } from './components/VerifyModal';
import { AuthModal } from './components/AuthModal';
import { EditProfileModal } from './components/EditProfileModal';
import { SpringChatBot } from './components/SpringChatBot';
import { Footer } from './components/Footer';

// Modular Screens
import { GuestScreen } from './components/screens/GuestScreen';
import { MyTasksScreen } from './components/screens/MyTasksScreen';
import { MyJobsScreen } from './components/screens/MyJobsScreen';
import { OrderWorkspaceScreen } from './components/screens/OrderWorkspaceScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { StaffScreen } from './components/screens/StaffScreen';
import { AdminScreen } from './components/screens/AdminScreen';
import { LoggedOutScreen } from './components/screens/LoggedOutScreen';
import { TaskDetailScreen } from './components/screens/TaskDetailScreen';
import { WalletScreen } from './components/screens/WalletScreen';
import { DisputeCenterScreen } from './components/screens/DisputeCenterScreen';
import { NotificationCenterScreen } from './components/screens/NotificationCenterScreen';
import { CampusHubScreen } from './components/screens/CampusHubScreen';
import { ReviewsCenterScreen } from './components/screens/ReviewsCenterScreen';
import { VerificationCenterScreen } from './components/screens/VerificationCenterScreen';
import { CreateTaskScreen } from './components/screens/CreateTaskScreen';
import { CheckoutEscrowScreen } from './components/screens/CheckoutEscrowScreen';
import { ChatCenterScreen } from './components/screens/ChatCenterScreen';
import { SavedTasksScreen } from './components/screens/SavedTasksScreen';
import { HelpCenterScreen } from './components/screens/HelpCenterScreen';
import { OrderManagementScreen } from './components/screens/OrderManagementScreen';
import { PublicPortfolioScreen } from './components/screens/PublicPortfolioScreen';
import { IntegrityPolicyScreen } from './components/screens/IntegrityPolicyScreen';
import { StudentAnalyticsScreen } from './components/screens/StudentAnalyticsScreen';
import { ModeSwitchNotification } from './components/ModeSwitchNotification';

import {
  Filter,
  RefreshCw,
  CheckCircle2,
  X,
  Grid,
  Clock,
  ShieldCheck,
  CheckCircle,
  Sparkles,
  Search,
  GraduationCap,
  Building,
} from 'lucide-react';

export default function App() {
  // Role Architecture (Guest / User / Admin)
  const [currentRole, setCurrentRole] = useState<UserRole>('USER');

  // Logged-in User Profile State (Minh Anh - HUST)
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('vietvi_user_profile');
      if (saved) {
        return { ...CURRENT_USER, ...JSON.parse(saved) };
      }
    } catch {
      // ignore
    }
    return CURRENT_USER;
  });

  // User Mode (One Person = One Account: Requester / Tasker)
  const [userMode, setUserMode] = useState<UserMode>('REQUESTER');

  // Navigation & Screen Management
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('HOME');

  // Core Data State
  const [categories, setCategories] = useState<TaskCategory[]>(CATEGORIES);
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [offers, setOffers] = useState<OfferItem[]>(MOCK_OFFERS);
  const [orders, setOrders] = useState<OrderItem[]>(MOCK_ORDERS);
  const [messages, setMessages] = useState<OrderMessage[]>(MOCK_MESSAGES);
  const [activeOrder, setActiveOrder] = useState<OrderItem>(MOCK_ORDERS[0]);
  const [transactions, setTransactions] = useState<WalletTransaction[]>(MOCK_TRANSACTIONS);
  const [disputes, setDisputes] = useState<DisputeItem[]>(MOCK_DISPUTES);
  const [verifications, setVerifications] = useState<VerificationRequest[]>(MOCK_VERIFICATIONS);
  const [reports, setReports] = useState<ReportItem[]>(MOCK_REPORTS);
  const [supportTickets, setSupportTickets] = useState<SupportTicketItem[]>(MOCK_SUPPORT_TICKETS);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(MOCK_STAFF_MEMBERS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(MOCK_AUDIT_LOGS);
  const [platformConfig, setPlatformConfig] = useState<PlatformConfig>(DEFAULT_PLATFORM_CONFIG);
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [campusLeaders, setCampusLeaders] = useState<CampusLeaderboardUser[]>(MOCK_CAMPUS_LEADERBOARD);
  const [studentReviews, setStudentReviews] = useState<StudentReviewItem[]>(MOCK_STUDENT_REVIEWS);
  const [availableBalance, setAvailableBalance] = useState<number>(1450000);
  const [chatThreads, setChatThreads] = useState<ChatThread[]>(MOCK_CHAT_THREADS);
  const [checkoutDraft, setCheckoutDraft] = useState<EscrowCheckoutDraft>({
    taskId: INITIAL_TASKS[0].id,
    taskTitle: INITIAL_TASKS[0].title,
    offerId: MOCK_OFFERS[0].id,
    tasker: MOCK_OFFERS[0].tasker,
    amount: MOCK_OFFERS[0].proposedPrice,
    deadline: INITIAL_TASKS[0].deadline,
    platformFee: 0,
    guaranteePledge: 'Bảo hộ Escrow 100% bởi VIETVI',
  });

  const escrowLockedAmount = useMemo(() => {
    return orders
      .filter((o) => o.status === 'IN_PROGRESS' || o.status === 'DELIVERED')
      .reduce((sum, o) => sum + o.agreedPrice, 0);
  }, [orders]);

  // Bookmarked / Saved Tasks state (Simple User Function)
  const [savedTaskIds, setSavedTaskIds] = useState<string[]>(['tsk-001', 'tsk-002']);

  // Filter State (Synchronized with CategoryNav & MarketTasks)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedUni, setSelectedUni] = useState<string>('all');
  const [selectedMode, setSelectedMode] = useState<TaskMode | 'ALL'>('ALL');
  const [activeQuickTab, setActiveQuickTab] = useState<'ALL' | 'URGENT' | 'HIGH_BUDGET' | 'ONLINE' | 'ONSITE'>('ALL');
  const [priceFilter, setPriceFilter] = useState<'ALL' | 'UNDER_300K' | '300K_600K' | 'OVER_600K'>('ALL');
  const [timeFilter, setTimeFilter] = useState<TaskTimeFilter>('ALL');
  const [trustFilter, setTrustFilter] = useState<TaskTrustFilter>('ALL');

  // Modals state
  const [selectedTaskForDetail, setSelectedTaskForDetail] = useState<TaskItem | null>(null);
  const [selectedStudentForPortfolio, setSelectedStudentForPortfolio] = useState<UserProfile | CampusLeaderboardUser | null>(null);
  const [isPostTaskOpen, setIsPostTaskOpen] = useState<boolean>(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState<boolean>(false);
  const [editProfileInitialTab, setEditProfileInitialTab] = useState<'BASIC' | 'SKILLS' | 'BANKING'>('BASIC');
  const [authIntent, setAuthIntent] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [modeSwitchNotifOpen, setModeSwitchNotifOpen] = useState<boolean>(false);
  const [selectedChatThreadId, setSelectedChatThreadId] = useState<string | undefined>(undefined);

  const handleOpenEditProfile = (tab: 'BASIC' | 'SKILLS' | 'BANKING' = 'BASIC') => {
    setEditProfileInitialTab(tab);
    setIsEditProfileOpen(true);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Toggle Saved Task (Bookmark)
  const handleToggleSaveTask = (taskId: string) => {
    setSavedTaskIds((prev) => {
      const exists = prev.includes(taskId);
      if (exists) {
        showToast('Đã xóa Task khỏi danh sách đã lưu.');
        return prev.filter((id) => id !== taskId);
      } else {
        showToast('Đã lưu Task vào danh sách yêu thích!');
        return [...prev, taskId];
      }
    });
  };

  const savedTasks = useMemo(() => {
    return tasks.filter((t) => savedTaskIds.includes(t.id));
  }, [tasks, savedTaskIds]);

  // Logout Flow
  const handleLogout = () => {
    setCurrentRole('GUEST');
    setActiveScreen('LOGGED_OUT');
    showToast('Bạn đã đăng xuất an toàn khỏi VIETVI.');
  };

  // Edit Profile Flow
  const handleSaveProfile = (updatedProfile: Partial<UserProfile>) => {
    setCurrentUser((prev) => {
      const updated: UserProfile = {
        ...prev,
        ...updatedProfile,
      };
      try {
        localStorage.setItem('vietvi_user_profile', JSON.stringify(updated));
      } catch {
        // ignore
      }
      if (
        selectedStudentForPortfolio &&
        (selectedStudentForPortfolio.id === prev.id || selectedStudentForPortfolio.id === 'usr-current')
      ) {
        setSelectedStudentForPortfolio(updated);
      }
      return updated;
    });
    showToast('Đã cập nhật hồ sơ cá nhân thành công!');
  };

  // Role switching
  const handleSelectRole = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'GUEST') {
      setActiveScreen('HOME');
      showToast('Đã chuyển sang vai trò: Khách (Guest). Khám phá công khai, chưa đăng nhập.');
    } else if (role === 'ADMIN') {
      setActiveScreen('ADMIN');
      showToast('Đã chuyển sang vai trò: Quản trị viên (Admin). Giám sát toàn hệ thống, chung thẩm tranh chấp & thiết lập chính sách.');
    } else if (role === 'STAFF') {
      setActiveScreen('STAFF');
      showToast('Đã chuyển sang vai trò: Chuyên viên Vận hành (Staff Ops). Trực ca KYC, hòa giải tranh chấp sơ thẩm & CSKH.');
    } else {
      setActiveScreen('HOME');
      showToast('Đã chuyển sang vai trò: Sinh viên (User - Nguyễn Minh Anh).');
    }
  };

  // Staff & Admin Synchronized Workflows
  const handleApproveVerification = (id: string, notes?: string) => {
    setVerifications((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: 'VERIFIED', reviewNotes: notes } : v))
    );
    const targetVerif = verifications.find((v) => v.id === id);
    if (targetVerif) {
      if (currentUser.studentId === targetVerif.studentId || currentUser.displayName === targetVerif.studentName) {
        setCurrentUser((prev) => ({ ...prev, isVerifiedStudent: true }));
      }
      setTasks((prev) =>
        prev.map((t) =>
          t.requester.displayName === targetVerif.studentName
            ? { ...t, requester: { ...t.requester, isVerifiedStudent: true } }
            : t
        )
      );
    }
    const entry: AuditLogEntry = {
      id: `aud-${Date.now().toString().slice(-4)}`,
      actor: currentRole === 'ADMIN' ? 'SuperAdmin_Hoang' : 'Lê Hoàng Nam (STF-01)',
      actorRole: currentRole === 'ADMIN' ? 'ADMIN' : 'STAFF',
      action: 'APPROVE_VERIFICATION',
      target: `Hồ sơ #${id} (${targetVerif?.studentName || ''})`,
      timestamp: 'Vừa xong',
      status: 'SUCCESS',
      details: notes || 'Thẻ sinh viên hợp lệ, đã cấp huy hiệu Tick xanh.',
    };
    setAuditLogs((prev) => [entry, ...prev]);
    showToast(`Đã duyệt Tick xanh cho ${targetVerif?.studentName || 'sinh viên'}!`);
  };

  const handleRejectVerification = (id: string, reason: string) => {
    setVerifications((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: 'REJECTED', reviewNotes: reason } : v))
    );
    const targetVerif = verifications.find((v) => v.id === id);
    const entry: AuditLogEntry = {
      id: `aud-${Date.now().toString().slice(-4)}`,
      actor: currentRole === 'ADMIN' ? 'SuperAdmin_Hoang' : 'Lê Hoàng Nam (STF-01)',
      actorRole: currentRole === 'ADMIN' ? 'ADMIN' : 'STAFF',
      action: 'REJECT_VERIFICATION',
      target: `Hồ sơ #${id} (${targetVerif?.studentName || ''})`,
      timestamp: 'Vừa xong',
      status: 'WARNING',
      details: reason,
    };
    setAuditLogs((prev) => [entry, ...prev]);
    showToast(`Đã từ chối hồ sơ xác minh #${id}`);
  };

  const handleRequestResubmitVerification = (id: string, note: string) => {
    setVerifications((prev) =>
      prev.map((v) => (v.id === id ? { ...v, reviewNotes: note } : v))
    );
    const targetVerif = verifications.find((v) => v.id === id);
    const entry: AuditLogEntry = {
      id: `aud-${Date.now().toString().slice(-4)}`,
      actor: 'Lê Hoàng Nam (STF-01)',
      actorRole: 'STAFF',
      action: 'REQUEST_RESUBMIT_VERIFICATION',
      target: `Hồ sơ #${id} (${targetVerif?.studentName || ''})`,
      timestamp: 'Vừa xong',
      status: 'WARNING',
      details: note,
    };
    setAuditLogs((prev) => [entry, ...prev]);
    showToast(`Đã yêu cầu ${targetVerif?.studentName || 'sinh viên'} chụp lại thẻ!`);
  };

  const handleArbitrateDispute = (
    disputeId: string,
    decision: 'REFUND_REQUESTER' | 'PAYOUT_TASKER' | 'SPLIT_50_50' | 'ESCALATE_TO_ADMIN',
    staffNote: string
  ) => {
    const targetDispute = disputes.find((d) => d.id === disputeId);

    if (decision === 'ESCALATE_TO_ADMIN') {
      setDisputes((prev) =>
        prev.map((d) =>
          d.id === disputeId
            ? {
                ...d,
                status: 'ESCALATED_TO_ADMIN',
                handledByStaff: 'Lê Hoàng Nam (STF-01)',
                escalatedReason: staffNote,
                resolution: 'Đã chuyển cấp lên Super Admin phán quyết chung thẩm.',
              }
            : d
        )
      );
      const entry: AuditLogEntry = {
        id: `aud-${Date.now().toString().slice(-4)}`,
        actor: 'Lê Hoàng Nam (STF-01)',
        actorRole: 'STAFF',
        action: 'ESCALATE_TO_ADMIN',
        target: `Tranh chấp #${disputeId}`,
        timestamp: 'Vừa xong',
        status: 'WARNING',
        details: staffNote,
      };
      setAuditLogs((prev) => [entry, ...prev]);
      showToast(`Đã chuyển hồ sơ tranh chấp #${disputeId} lên Quản trị viên (Admin)!`);
      return;
    }

    let nextStatus: DisputeItem['status'] = 'INVESTIGATING';
    if (decision === 'REFUND_REQUESTER') {
      nextStatus = 'RESOLVED_REFUND';
      if (targetDispute) {
        setTransactions((prev) => [
          {
            id: `TX-${Date.now().toString().slice(-4)}`,
            type: 'REFUND',
            amount: targetDispute.amount,
            title: `Hoàn tiền tranh chấp #${disputeId} theo phán quyết Staff`,
            orderId: targetDispute.orderId,
            counterparty: targetDispute.defendant.displayName,
            status: 'COMPLETED',
            createdAt: 'Vừa xong',
          },
          ...prev,
        ]);
      }
    } else if (decision === 'PAYOUT_TASKER') {
      nextStatus = 'RESOLVED_PAYOUT';
      if (targetDispute) {
        setTransactions((prev) => [
          {
            id: `TX-${Date.now().toString().slice(-4)}`,
            type: 'ESCROW_RELEASE',
            amount: targetDispute.amount,
            title: `Giải ngân tranh chấp #${disputeId} theo phán quyết Staff`,
            orderId: targetDispute.orderId,
            counterparty: targetDispute.claimant.displayName,
            status: 'COMPLETED',
            createdAt: 'Vừa xong',
          },
          ...prev,
        ]);
      }
    } else if (decision === 'SPLIT_50_50') {
      nextStatus = 'RESOLVED_SPLIT';
      if (targetDispute) {
        const half = Math.round(targetDispute.amount / 2);
        setTransactions((prev) => [
          {
            id: `TX-${Date.now().toString().slice(-4)}`,
            type: 'REFUND',
            amount: half,
            title: `Hoàn 50% ký quỹ tranh chấp #${disputeId}`,
            orderId: targetDispute.orderId,
            status: 'COMPLETED',
            createdAt: 'Vừa xong',
          },
          {
            id: `TX-${(Date.now() + 1).toString().slice(-4)}`,
            type: 'ESCROW_RELEASE',
            amount: targetDispute.amount - half,
            title: `Giải ngân 50% ký quỹ tranh chấp #${disputeId}`,
            orderId: targetDispute.orderId,
            status: 'COMPLETED',
            createdAt: 'Vừa xong',
          },
          ...prev,
        ]);
      }
    }

    setDisputes((prev) =>
      prev.map((d) =>
        d.id === disputeId
          ? {
              ...d,
              status: nextStatus,
              handledByStaff: 'Lê Hoàng Nam (STF-01)',
              resolution: staffNote,
            }
          : d
      )
    );

    if (targetDispute) {
      const orderResolvedStatus: OrderStatus =
        decision === 'REFUND_REQUESTER' ? 'REFUNDED' : 'COMPLETED';
      setOrders((prev) =>
        prev.map((o) =>
          o.id === targetDispute.orderId ? { ...o, status: orderResolvedStatus } : o
        )
      );
      if (activeOrder.id === targetDispute.orderId) {
        setActiveOrder((prev) => ({ ...prev, status: orderResolvedStatus }));
      }
    }

    const entry: AuditLogEntry = {
      id: `aud-${Date.now().toString().slice(-4)}`,
      actor: 'Lê Hoàng Nam (STF-01)',
      actorRole: 'STAFF',
      action: 'ARBITRATE_DISPUTE',
      target: `Tranh chấp #${disputeId}`,
      timestamp: 'Vừa xong',
      status: 'SUCCESS',
      details: `Phán quyết: ${decision}. Ghi chú: ${staffNote}`,
    };
    setAuditLogs((prev) => [entry, ...prev]);
    showToast(`Đã ra phán quyết sơ thẩm cho Tranh chấp #${disputeId}!`);
  };

  const handleModerateReport = (
    reportId: string,
    action: 'DELIST_TASK' | 'WARN_USER' | 'REQUEST_BAN' | 'DISMISS',
    staffNote: string
  ) => {
    const targetReport = reports.find((r) => r.id === reportId);
    let newStatus: ReportItem['status'] = 'RESOLVED';
    let newActionTaken: ReportItem['actionTaken'] = 'NO_VIOLATION';

    if (action === 'DELIST_TASK') {
      newActionTaken = 'TASK_DELISTED';
      if (targetReport && targetReport.targetType === 'TASK') {
        setTasks((prev) => prev.filter((t) => t.id !== targetReport.targetId));
      }
    } else if (action === 'WARN_USER') {
      newActionTaken = 'WARNING_SENT';
    } else if (action === 'REQUEST_BAN') {
      newStatus = 'ESCALATED_TO_ADMIN';
      newActionTaken = 'SUSPEND_REQUESTED';
    } else {
      newActionTaken = 'NO_VIOLATION';
    }

    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? {
              ...r,
              status: newStatus,
              actionTaken: newActionTaken,
              staffNote,
              handledByStaff: 'Lê Hoàng Nam (STF-01)',
            }
          : r
      )
    );

    const entry: AuditLogEntry = {
      id: `aud-${Date.now().toString().slice(-4)}`,
      actor: 'Lê Hoàng Nam (STF-01)',
      actorRole: 'STAFF',
      action: action === 'REQUEST_BAN' ? 'ESCALATE_BAN_RECOMMENDATION' : 'MODERATE_REPORT',
      target: `Báo cáo #${reportId} (${targetReport?.targetId || ''})`,
      timestamp: 'Vừa xong',
      status: action === 'REQUEST_BAN' ? 'WARNING' : 'SUCCESS',
      details: staffNote,
    };
    setAuditLogs((prev) => [entry, ...prev]);
  };

  const handleReplyTicket = (ticketId: string, replyText: string, markResolved?: boolean) => {
    setSupportTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const newMsg = {
            id: `tm-${Date.now().toString().slice(-4)}`,
            senderName: 'Lê Hoàng Nam (Staff CSKH)',
            senderRole: 'STAFF' as const,
            content: replyText,
            timestamp: 'Vừa xong',
          };
          return {
            ...t,
            status: markResolved ? 'RESOLVED' : 'ANSWERED',
            messages: [...t.messages, newMsg],
          };
        }
        return t;
      })
    );
  };

  const handleBoostUrgentTask = (taskId: string) => {
    setTasks((prev) => {
      const target = prev.find((t) => t.id === taskId);
      if (!target) return prev;
      return [{ ...target, createdAt: 'Vừa xong', createdTimestamp: Date.now() }, ...prev.filter((t) => t.id !== taskId)];
    });
    showToast(`Đã ghim ưu tiên Task #${taskId} lên đầu sàn!`);
  };

  const handleFinalRulingDispute = (
    disputeId: string,
    decision: 'REFUND_REQUESTER' | 'PAYOUT_TASKER' | 'CUSTOM_SPLIT' | 'PLATFORM_COMPENSATE',
    adminRulingNote: string,
    splitPercentRequester: number = 50
  ) => {
    const targetDispute = disputes.find((d) => d.id === disputeId);
    let resolvedStatus: DisputeItem['status'] = 'RESOLVED_SPLIT';

    if (decision === 'REFUND_REQUESTER') resolvedStatus = 'RESOLVED_REFUND';
    else if (decision === 'PAYOUT_TASKER') resolvedStatus = 'RESOLVED_PAYOUT';

    setDisputes((prev) =>
      prev.map((d) =>
        d.id === disputeId
          ? {
              ...d,
              status: resolvedStatus,
              resolution: `[CHUNG THẨM ADMIN] ${adminRulingNote}`,
            }
          : d
      )
    );

    if (targetDispute) {
      if (decision === 'REFUND_REQUESTER') {
        setTransactions((prev) => [
          {
            id: `TX-${Date.now().toString().slice(-4)}`,
            type: 'REFUND',
            amount: targetDispute.amount,
            title: `[Chung thẩm Admin] Hoàn 100% tranh chấp #${disputeId}`,
            orderId: targetDispute.orderId,
            status: 'COMPLETED',
            createdAt: 'Vừa xong',
          },
          ...prev,
        ]);
      } else if (decision === 'PAYOUT_TASKER') {
        setTransactions((prev) => [
          {
            id: `TX-${Date.now().toString().slice(-4)}`,
            type: 'ESCROW_RELEASE',
            amount: targetDispute.amount,
            title: `[Chung thẩm Admin] Giải ngân 100% tranh chấp #${disputeId}`,
            orderId: targetDispute.orderId,
            status: 'COMPLETED',
            createdAt: 'Vừa xong',
          },
          ...prev,
        ]);
      } else if (decision === 'CUSTOM_SPLIT') {
        const refundAmt = Math.round((targetDispute.amount * splitPercentRequester) / 100);
        const payoutAmt = targetDispute.amount - refundAmt;
        setTransactions((prev) => [
          {
            id: `TX-${Date.now().toString().slice(-4)}`,
            type: 'REFUND',
            amount: refundAmt,
            title: `[Chung thẩm Admin] Hoàn ${splitPercentRequester}% cho Requester #${disputeId}`,
            orderId: targetDispute.orderId,
            status: 'COMPLETED',
            createdAt: 'Vừa xong',
          },
          {
            id: `TX-${(Date.now() + 1).toString().slice(-4)}`,
            type: 'ESCROW_RELEASE',
            amount: payoutAmt,
            title: `[Chung thẩm Admin] Giải ngân ${100 - splitPercentRequester}% cho Tasker #${disputeId}`,
            orderId: targetDispute.orderId,
            status: 'COMPLETED',
            createdAt: 'Vừa xong',
          },
          ...prev,
        ]);
      }

      const orderResolvedStatus: OrderStatus =
        decision === 'REFUND_REQUESTER' ? 'REFUNDED' : 'COMPLETED';
      setOrders((prev) =>
        prev.map((o) =>
          o.id === targetDispute.orderId ? { ...o, status: orderResolvedStatus } : o
        )
      );
      if (activeOrder.id === targetDispute.orderId) {
        setActiveOrder((prev) => ({ ...prev, status: orderResolvedStatus }));
      }

      const adminRulingAudit: AuditLogEntry = {
        id: `aud-${Date.now().toString().slice(-4)}`,
        actor: 'Admin Tối Cao (ADM-01)',
        actorRole: 'ADMIN',
        action: 'FINAL_RULING_DISPUTE',
        target: `Tranh chấp #${disputeId}`,
        timestamp: 'Vừa xong',
        status: 'SUCCESS',
        details: `Phán quyết chung thẩm: ${decision}. Ghi chú: ${adminRulingNote}`,
      };
      setAuditLogs((prev) => [adminRulingAudit, ...prev]);
      showToast(`Admin đã ban hành phán quyết chung thẩm cho Tranh chấp #${disputeId}!`);
    }
  };

  const handleConfirmBanUser = (reportId: string, userId: string, reason: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: 'RESOLVED', actionTaken: 'SUSPEND_REQUESTED' } : r))
    );
    showToast(`Đã phê duyệt khóa vĩnh viễn tài khoản #${userId}!`);
  };

  const handlePardonUser = (reportId: string, reason: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: 'RESOLVED', actionTaken: 'WARNING_SENT' } : r))
    );
    showToast(`Đã ân xá cho tài khoản trong báo cáo #${reportId}!`);
  };

  const handleAddCategory = (newCat: TaskCategory) => {
    setCategories((prev) => [...prev, newCat]);
  };

  const handleToggleMode = () => {
    const nextMode = userMode === 'REQUESTER' ? 'TASKER' : 'REQUESTER';
    setUserMode(nextMode);
    setModeSwitchNotifOpen(true);

    if (nextMode === 'TASKER') {
      // 1. Push official unread System Notification into Notification Center
      const taskerNotif: NotificationItem = {
        id: `notif-mode-tasker-${Date.now()}`,
        type: 'SYSTEM',
        title: 'Kích hoạt chế độ Người thực hiện (Tasker) 🛠️',
        content: 'Bạn đã chuyển từ Người yêu cầu sang Người thực hiện! Quyền hạn gửi báo giá cho các Task mở, nộp sản phẩm nghiệm thu và bảo chứng thù lao Escrow 100% đã sẵn sàng.',
        targetScreen: 'MY_JOBS',
        read: false,
        createdAt: 'Vừa xong',
      };
      setNotifications((prev) => [taskerNotif, ...prev]);

      // 2. If user was on requester-only screen, navigate to worker screen
      if (activeScreen === 'MY_TASKS' || activeScreen === 'CREATE_TASK' || activeScreen === 'CHECKOUT_ESCROW') {
        setActiveScreen('MY_JOBS');
      }
      showToast(
        'Đã kích hoạt chế độ Người thực hiện (Tasker): Khám phá việc làm, gửi báo giá và nộp bài để nhận thù lao bảo chứng!'
      );
    } else {
      // 1. Push official unread System Notification into Notification Center
      const requesterNotif: NotificationItem = {
        id: `notif-mode-req-${Date.now()}`,
        type: 'SYSTEM',
        title: 'Kích hoạt chế độ Người yêu cầu (Requester) 📋',
        content: 'Bạn đã chuyển sang chế độ Người yêu cầu (Thuê việc). Bạn có thể đăng bài tuyển mới, so sánh báo giá ứng viên và giải ngân an toàn qua Escrow.',
        targetScreen: 'MY_TASKS',
        read: false,
        createdAt: 'Vừa xong',
      };
      setNotifications((prev) => [requesterNotif, ...prev]);

      // 2. If user was on worker-only screen, navigate to requester screen
      if (activeScreen === 'MY_JOBS') {
        setActiveScreen('MY_TASKS');
      }
      showToast(
        'Đã kích hoạt chế độ Người yêu cầu (Requester): Đăng Task mới, duyệt ứng viên và giải ngân Escrow khi hài lòng!'
      );
    }
  };

  const handleDepositFunds = (amount: number, method: string) => {
    const depositTxn: WalletTransaction = {
      id: `TXN-${Date.now().toString().slice(-4)}`,
      type: 'DEPOSIT',
      amount,
      title: `Nạp tiền vào ví ký quỹ qua ${method}`,
      counterparty: method,
      status: 'COMPLETED',
      createdAt: 'Vừa xong',
    };
    setTransactions((prev) => [depositTxn, ...prev]);
    setAvailableBalance((prev) => prev + amount);
    showToast(`Đã nạp thành công ${amount.toLocaleString('vi-VN')} đ vào ví ký quỹ!`);
  };

  // Auth Intent Trigger (for Guests)
  const handleTriggerAuth = (intent: string) => {
    setAuthIntent(intent);
    setIsAuthModalOpen(true);
  };

  const handleSuccessLogin = (
    email: string,
    profileData?: Partial<UserProfile>,
    initialMode?: UserMode,
    verificationData?: { studentCardImage?: string; requestTickXanh?: boolean }
  ) => {
    setCurrentRole('USER');
    if (initialMode) {
      setUserMode(initialMode);
    }
    if (profileData) {
      setCurrentUser((prev) => ({
        ...prev,
        ...profileData,
        email: email,
        isVerifiedStudent: verificationData?.requestTickXanh ? false : (profileData.isVerifiedStudent ?? prev.isVerifiedStudent),
      }));
    } else {
      setCurrentUser((prev) => ({
        ...prev,
        email: email,
      }));
    }

    if (verificationData?.requestTickXanh) {
      const newVerif: VerificationRequest = {
        id: `vrf-${Date.now().toString().slice(-4)}`,
        studentName: profileData?.displayName || currentUser.displayName,
        studentEmail: email,
        studentId: profileData?.studentId || currentUser.studentId || '20235678',
        university: profileData?.university || currentUser.university,
        submittedAt: 'Vừa xong',
        status: 'PENDING',
        evidenceRef: 'Ảnh thẻ sinh viên đính kèm',
        reviewNotes: 'Hồ sơ tạo mới gửi tự động từ luồng Đăng ký & Onboarding sinh viên',
      };
      setVerifications((prev) => [newVerif, ...prev]);
    }

    showToast(
      profileData
        ? `Đăng ký & tạo hồ sơ thành công! Chào mừng ${profileData.displayName || 'bạn'} gia nhập VIETVI.`
        : `Đăng nhập thành công với email ${email}! Chào mừng bạn quay trở lại VIETVI.`
    );

    // Resume intent
    if (authIntent === 'POST_TASK') {
      setIsPostTaskOpen(true);
    } else if (authIntent === 'SUBMIT_OFFER' && selectedTaskForDetail) {
      // Keep task modal open for offer
    }
    setAuthIntent(null);
  };

  const handleTaskCreated = (newTask: TaskItem) => {
    const taskWithTimestamp: TaskItem = {
      ...newTask,
      createdTimestamp: newTask.createdTimestamp || Date.now(),
      createdAt: newTask.createdAt || 'Vừa xong',
    };
    setTasks([taskWithTimestamp, ...tasks]);
    showToast(`Đã đăng Task mới: "${newTask.title}" thành công!`);
  };

  const handleSubmitOffer = (
    taskId: string,
    proposedPrice: number,
    deliveryDays: number,
    message: string
  ) => {
    if (currentRole === 'GUEST') {
      handleTriggerAuth('SUBMIT_OFFER');
      return;
    }

    const targetTask = tasks.find((t) => t.id === taskId);
    const newOffer: OfferItem = {
      id: `off-${Date.now().toString().slice(-4)}`,
      taskId,
      taskTitle: targetTask ? targetTask.title : 'Task',
      tasker: currentUser,
      proposedPrice,
      deliveryDays,
      message,
      status: 'PENDING',
      createdAt: 'Vừa xong',
    };

    setOffers([newOffer, ...offers]);
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, offersCount: t.offersCount + 1 } : t))
    );
    showToast(`Đã gửi đề xuất báo giá ${proposedPrice.toLocaleString('vi-VN')} đ thành công!`);
  };

  // Rule BR-01: Requester accepts an offer -> Route to Checkout Escrow Screen
  const handleAcceptOffer = (task: TaskItem, offer: OfferItem) => {
    setCheckoutDraft({
      taskId: task.id,
      taskTitle: task.title,
      offerId: offer.id,
      tasker: offer.tasker,
      amount: offer.proposedPrice,
      deadline: task.deadline,
      platformFee: 0,
      guaranteePledge: 'Bảo hộ Escrow 100% bởi VIETVI',
    });
    setActiveScreen('CHECKOUT_ESCROW');
  };

  // Rule BR-02: Confirm Escrow Payment -> Deduct/Check, Lock Funds, Create Order & Start Workspace
  const handleConfirmEscrowPayment = (method: 'WALLET' | 'VIETQR' | 'MOMO') => {
    if (method === 'WALLET') {
      setAvailableBalance((prev) => Math.max(0, prev - checkoutDraft.amount));
    }

    const tx: WalletTransaction = {
      id: `tx-${Date.now().toString().slice(-4)}`,
      type: 'ESCROW_HOLD',
      amount: checkoutDraft.amount,
      title: `Khóa quỹ Escrow đơn #${checkoutDraft.taskId}`,
      orderId: checkoutDraft.taskId,
      counterparty: checkoutDraft.tasker.displayName,
      status: 'COMPLETED',
      createdAt: 'Vừa xong',
    };
    setTransactions((prev) => [tx, ...prev]);

    const newOrder: OrderItem = {
      id: `ORD-2026-${Math.floor(100 + Math.random() * 900)}`,
      taskId: checkoutDraft.taskId,
      taskTitle: checkoutDraft.taskTitle,
      requester: currentUser,
      tasker: checkoutDraft.tasker,
      agreedPrice: checkoutDraft.amount,
      platformFee: 0,
      payoutAmount: checkoutDraft.amount,
      deadline: checkoutDraft.deadline,
      status: 'IN_PROGRESS',
      createdAt: new Date().toLocaleDateString('vi-VN') + ' ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      deliveries: [],
    };

    setOffers((prev) =>
      prev.map((o) => {
        if (o.taskId === checkoutDraft.taskId) {
          return o.id === checkoutDraft.offerId ? { ...o, status: 'ACCEPTED' } : { ...o, status: 'REJECTED' };
        }
        return o;
      })
    );

    setTasks((prev) =>
      prev.map((t) => (t.id === checkoutDraft.taskId ? { ...t, status: 'AWARDED' } : t))
    );

    setOrders([newOrder, ...orders]);
    setActiveOrder(newOrder);

    const initialMsg: OrderMessage = {
      id: `msg-${Date.now()}`,
      orderId: newOrder.id,
      senderId: 'sys-vietvi',
      senderName: 'Hệ thống VIETVI',
      senderRole: 'STAFF',
      content: `Order #${newOrder.id} đã kích hoạt thành công qua phương thức ${method}! Số tiền ${checkoutDraft.amount.toLocaleString('vi-VN')} đ đã được khóa an toàn trong Escrow. Hai bạn sinh viên có thể bắt đầu trao đổi tin nhắn và tài liệu.`,
      createdAt: 'Vừa xong',
    };
    setMessages([initialMsg, ...messages]);

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      type: 'OFFER_ACCEPTED',
      title: 'Đề xuất đã được duyệt & Khóa Escrow',
      content: `Bạn đã khóa thành công ${checkoutDraft.amount.toLocaleString('vi-VN')} đ vào quỹ Escrow cho Order #${newOrder.id}.`,
      targetScreen: 'ORDER_WORKSPACE',
      targetId: newOrder.id,
      read: false,
      createdAt: 'Vừa xong',
    };
    setNotifications((prev) => [notif, ...prev]);

    setActiveScreen('ORDER_WORKSPACE');
    showToast(`Đã khóa quỹ Escrow thành công! Order #${newOrder.id} đã bắt đầu.`);
  };

  // Full Page Create Task
  const handleCreateTaskFromScreen = (taskData: {
    title: string;
    categoryId: string;
    description: string;
    expectedOutput: string;
    budget: number;
    deadline: string;
    mode: TaskMode;
    locationNote: string;
    tags: string[];
  }) => {
    const cat = CATEGORIES.find((c) => c.id === taskData.categoryId);
    const newTask: TaskItem = {
      id: `tsk-${Date.now().toString().slice(-4)}`,
      title: taskData.title,
      categoryId: taskData.categoryId,
      categoryName: cat ? cat.name : 'Khác',
      description: taskData.description,
      expectedOutput: taskData.expectedOutput,
      budget: taskData.budget,
      deadline: taskData.deadline,
      mode: taskData.mode,
      location: taskData.locationNote,
      requester: currentUser,
      status: 'OPEN',
      offersCount: 0,
      tags: taskData.tags,
      createdAt: 'Vừa xong',
      createdTimestamp: Date.now(),
    };
    handleTaskCreated(newTask);
    setActiveScreen('HOME');
  };

  // Direct Messenger Chat Send
  const handleSendDirectMessage = (threadId: string, content: string) => {
    setChatThreads((prev) =>
      prev.map((thread) => {
        if (thread.id === threadId) {
          const newMsg = {
            id: `msg-${Date.now()}`,
            senderId: currentUser.id,
            content,
            createdAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
            isRead: true,
          };
          return {
            ...thread,
            lastMessage: content,
            lastTimestamp: 'Vừa xong',
            messages: [...thread.messages, newMsg],
          };
        }
        return thread;
      })
    );
  };

  // Order Workspace interactions
  const handleSendMessage = (content: string) => {
    const msg: OrderMessage = {
      id: `msg-${Date.now()}`,
      orderId: activeOrder.id,
      senderId: currentUser.id,
      senderName: currentUser.displayName,
      senderRole: userMode === 'TASKER' ? 'TASKER' : 'REQUESTER',
      content,
      createdAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, msg]);
  };

  const handleSubmitDelivery = (note: string, fileName: string) => {
    const newDelivery = {
      id: `del-${Date.now()}`,
      orderId: activeOrder.id,
      submittedBy: currentUser.displayName,
      note,
      fileName,
      fileSize: '4.2 MB',
      version: activeOrder.deliveries.length + 1,
      createdAt: 'Vừa xong',
      status: 'PENDING' as const,
    };

    const updatedOrder = {
      ...activeOrder,
      status: 'DELIVERED' as const,
      deliveries: [newDelivery, ...activeOrder.deliveries],
    };

    setActiveOrder(updatedOrder);
    setOrders((prev) => prev.map((o) => (o.id === activeOrder.id ? updatedOrder : o)));
    showToast(`Đã nộp bàn giao phiên bản v${newDelivery.version} thành công!`);
  };

  const handleAcceptDelivery = (deliveryId: string) => {
    const updatedOrder = {
      ...activeOrder,
      status: 'COMPLETED' as const,
      deliveries: activeOrder.deliveries.map((d) =>
        d.id === deliveryId ? { ...d, status: 'ACCEPTED' as const } : d
      ),
    };

    setActiveOrder(updatedOrder);
    setOrders((prev) => prev.map((o) => (o.id === activeOrder.id ? updatedOrder : o)));

    // Sync Escrow Release into Wallet
    const releaseTxn: WalletTransaction = {
      id: `TXN-${Date.now().toString().slice(-4)}`,
      type: 'ESCROW_RELEASE',
      amount: updatedOrder.agreedPrice,
      title: `Giải ngân thù lao Order #${updatedOrder.id}`,
      orderId: updatedOrder.id,
      counterparty: updatedOrder.requester.displayName,
      status: 'COMPLETED',
      createdAt: 'Vừa xong',
    };
    setTransactions((prev) => [releaseTxn, ...prev]);
    setAvailableBalance((prev) => prev + updatedOrder.agreedPrice);

    // Push notification
    const completionNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      type: 'ORDER_COMPLETED',
      title: `Nghiệm thu thành công Order #${updatedOrder.id}`,
      content: `Thù lao ${updatedOrder.agreedPrice.toLocaleString('vi-VN')} đ đã được mở khóa và chuyển vào Ví của bạn.`,
      targetScreen: 'WALLET',
      targetId: updatedOrder.id,
      read: false,
      createdAt: 'Vừa xong',
    };
    setNotifications((prev) => [completionNotif, ...prev]);

    showToast(`Đã nghiệm thu Order #${activeOrder.id} và giải ngân thù lao ${updatedOrder.agreedPrice.toLocaleString('vi-VN')} đ thành công!`);
  };

  const handleRequestRevision = (deliveryId: string, reason: string) => {
    const updatedOrder = {
      ...activeOrder,
      status: 'IN_PROGRESS' as const,
      deliveries: activeOrder.deliveries.map((d) =>
        d.id === deliveryId ? { ...d, status: 'REVISION_REQUESTED' as const } : d
      ),
    };

    setActiveOrder(updatedOrder);
    setOrders((prev) => prev.map((o) => (o.id === activeOrder.id ? updatedOrder : o)));

    const sysMsg: OrderMessage = {
      id: `msg-${Date.now()}`,
      orderId: activeOrder.id,
      senderId: 'sys-vietvi',
      senderName: 'Yêu cầu chỉnh sửa',
      senderRole: 'REQUESTER',
      content: `Người yêu cầu đã gửi yêu cầu chỉnh sửa: "${reason}". Vui lòng cập nhật và nộp lại bàn giao.`,
      createdAt: 'Vừa xong',
    };
    setMessages((prev) => [...prev, sysMsg]);
    showToast(`Đã gửi yêu cầu chỉnh sửa cho Người thực hiện.`);
  };

  // 1. Dispute Handling Flow (MOD-01)
  const handleOpenDispute = (orderId: string, reason?: string) => {
    const targetOrder = orders.find((o) => o.id === orderId) || activeOrder;
    const disputeNote = reason || 'Yêu cầu can thiệp đối soát sản phẩm bàn giao chưa đạt tiêu chuẩn.';
    
    const newDispute: DisputeItem = {
      id: `DSP-${Date.now().toString().slice(-3)}`,
      orderId: targetOrder.id,
      taskTitle: targetOrder.taskTitle,
      claimant: currentUser,
      defendant: userMode === 'REQUESTER' ? targetOrder.tasker : targetOrder.requester,
      reason: disputeNote,
      claimantRole: userMode === 'REQUESTER' ? 'REQUESTER' : 'TASKER',
      amount: targetOrder.agreedPrice,
      status: 'INVESTIGATING',
      resolution: 'Staff đang đối chiếu mốc bàn giao và file đính kèm trong tin nhắn Order.',
      createdAt: 'Vừa xong',
    };

    setDisputes((prev) => [newDispute, ...prev]);
    setOrders((prev) =>
      prev.map((o) => (o.id === targetOrder.id ? { ...o, status: 'DISPUTED' } : o))
    );
    if (activeOrder.id === targetOrder.id) {
      setActiveOrder({ ...activeOrder, status: 'DISPUTED' });
    }

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      type: 'DISPUTE_OPENED',
      title: `Khiếu nại Order #${targetOrder.id}`,
      content: `Yêu cầu can thiệp tranh chấp đã được gửi tới Đội ngũ Vận hành VIETVI. Tiền Escrow tạm khóa bảo đảm.`,
      targetScreen: 'DISPUTES',
      targetId: newDispute.id,
      read: false,
      createdAt: 'Vừa xong',
    };
    setNotifications((prev) => [notif, ...prev]);

    setActiveScreen('DISPUTES');
    showToast(`Đã mở yêu cầu khiếu nại Order #${targetOrder.id}! Đội ngũ hỗ trợ đang tiếp nhận.`);
  };

  const handleAdminResolveDispute = (disputeId: string, resolutionType: 'REFUND' | 'PAYOUT') => {
    const targetDispute = disputes.find((d) => d.id === disputeId);
    if (!targetDispute) return;

    const resolutionText =
      resolutionType === 'REFUND'
        ? 'Phán quyết hòa giải: Hoàn 100% thù lao Escrow cho Người yêu cầu do task không đúng cam kết.'
        : 'Phán quyết hòa giải: Giải ngân 100% thù lao Escrow cho Người thực hiện do đã bàn giao đúng yêu cầu.';

    setDisputes((prev) =>
      prev.map((d) =>
        d.id === disputeId
          ? {
              ...d,
              status: resolutionType === 'REFUND' ? 'RESOLVED_REFUND' : 'RESOLVED_PAYOUT',
              resolution: resolutionText,
            }
          : d
      )
    );

    setOrders((prev) =>
      prev.map((o) =>
        o.id === targetDispute.orderId
          ? { ...o, status: resolutionType === 'REFUND' ? 'REFUNDED' : 'COMPLETED' }
          : o
      )
    );

    if (activeOrder.id === targetDispute.orderId) {
      setActiveOrder((prev) => ({
        ...prev,
        status: resolutionType === 'REFUND' ? 'REFUNDED' : 'COMPLETED',
      }));
    }

    if (resolutionType === 'REFUND') {
      const refundTxn: WalletTransaction = {
        id: `TXN-${Date.now().toString().slice(-4)}`,
        type: 'REFUND',
        amount: targetDispute.amount,
        title: `Hoàn tiền tranh chấp Order #${targetDispute.orderId}`,
        orderId: targetDispute.orderId,
        counterparty: 'Hệ thống Escrow',
        status: 'COMPLETED',
        createdAt: 'Vừa xong',
      };
      setTransactions((prev) => [refundTxn, ...prev]);
      setAvailableBalance((prev) => prev + targetDispute.amount);
    } else {
      const payoutTxn: WalletTransaction = {
        id: `TXN-${Date.now().toString().slice(-4)}`,
        type: 'ESCROW_RELEASE',
        amount: targetDispute.amount,
        title: `Giải ngân thù lao tranh chấp Order #${targetDispute.orderId}`,
        orderId: targetDispute.orderId,
        counterparty: 'Hệ thống Escrow',
        status: 'COMPLETED',
        createdAt: 'Vừa xong',
      };
      setTransactions((prev) => [payoutTxn, ...prev]);
      setAvailableBalance((prev) => prev + targetDispute.amount);
    }

    showToast(`Admin đã hòa giải tranh chấp #${disputeId}: ${resolutionType === 'REFUND' ? 'Hoàn tiền' : 'Giải ngân'} thành công!`);
  };

  // 2. Payout Withdrawal Flow (BR-02)
  const handleRequestPayout = (amount: number, bankName: string, accountNumber: string) => {
    if (amount > availableBalance) {
      showToast('Số dư khả dụng không đủ để thực hiện lệnh rút!');
      return;
    }

    const newTxn: WalletTransaction = {
      id: `TXN-${Date.now().toString().slice(-4)}`,
      type: 'PAYOUT_WITHDRAWAL',
      amount,
      title: `Rút tiền về ${bankName} - STK ${accountNumber}`,
      counterparty: bankName,
      status: 'COMPLETED',
      createdAt: 'Vừa xong',
    };

    setAvailableBalance((prev) => prev - amount);
    setTransactions((prev) => [newTxn, ...prev]);
    showToast(`Đã chuyển ${amount.toLocaleString('vi-VN')} đ về tài khoản ${bankName} thành công!`);
  };

  // 3. Reviews & Reputation Flow (EVAL-01, EVAL-02)
  const handleSubmitReview = (reviewData: {
    ratingQuality: number;
    ratingTimeliness: number;
    ratingCommunication: number;
    comment: string;
  }) => {
    const overall = Number(
      ((reviewData.ratingQuality + reviewData.ratingTimeliness + reviewData.ratingCommunication) / 3).toFixed(1)
    );

    const newReview: StudentReviewItem = {
      id: `rev-${Date.now().toString().slice(-4)}`,
      orderId: activeOrder.id,
      taskTitle: activeOrder.taskTitle,
      reviewer: currentUser,
      reviewee: activeOrder.tasker,
      reviewerRole: 'REQUESTER',
      ratingQuality: reviewData.ratingQuality,
      ratingTimeliness: reviewData.ratingTimeliness,
      ratingCommunication: reviewData.ratingCommunication,
      overallRating: overall,
      comment: reviewData.comment,
      tags: ['Đúng hạn cam kết', 'Chất lượng xuất sắc'],
      createdAt: 'Hôm nay',
    };

    setStudentReviews((prev) => [newReview, ...prev]);
    showToast('Đã lưu đánh giá 3 tiêu chí vào Trung tâm Đánh giá & Tín nhiệm 360°!');
  };

  const handleReplyReview = (reviewId: string, replyText: string) => {
    setStudentReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, response: replyText } : r))
    );
    showToast('Đã đăng phản hồi cho nhận xét của bạn bè thành công!');
  };

  // 4. Verification KYC Flow (VERIFY-01)
  const handleVerificationSubmitted = (uni: string, studentId: string, email: string) => {
    setCurrentUser((prev) => ({
      ...prev,
      university: uni,
      studentId: studentId,
      email: email,
      isVerifiedStudent: true,
    }));

    const newVerif: VerificationRequest = {
      id: `vrf-${Date.now().toString().slice(-4)}`,
      studentName: currentUser.displayName,
      studentEmail: email,
      studentId: studentId,
      university: uni,
      submittedAt: 'Vừa xong',
      status: 'VERIFIED',
      evidenceRef: 'Ảnh thẻ sinh viên đính kèm',
      reviewNotes: 'Hồ sơ đã tự động kích hoạt Tick Xanh qua cổng KYC Sinh Viên Trực Tuyến',
    };
    setVerifications((prev) => [newVerif, ...prev]);

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      type: 'VERIFIED',
      title: 'Đã xác minh thẻ sinh viên thành công',
      content: `Hồ sơ ${uni} - MSSV ${studentId} đã kích hoạt Tick Xanh chính thức!`,
      targetScreen: 'PROFILE',
      read: false,
      createdAt: 'Vừa xong',
    };
    setNotifications((prev) => [notif, ...prev]);

    showToast('Xác minh Thẻ Sinh viên thành công! Tick xanh uy tín đã xuất hiện trên hồ sơ của bạn.');
  };

  // 5. Notification Center Flow (NOTIF-01)
  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('Đã đánh dấu tất cả thông báo là đã đọc.');
  };

  const handleNotificationClick = (notif: NotificationItem) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
    );
    setActiveScreen(notif.targetScreen);
    if (notif.targetId) {
      const matchOrder = orders.find((o) => o.id === notif.targetId);
      if (matchOrder) setActiveOrder(matchOrder);
      const matchTask = tasks.find((t) => t.id === notif.targetId);
      if (matchTask) setSelectedTaskForDetail(matchTask);
    }
  };

  // 6. Fullscreen Task Detail Permlink
  const handleOpenTaskFullScreen = (task: TaskItem) => {
    setSelectedTaskForDetail(task);
    setActiveScreen('TASK_DETAIL');
  };

  // Synchronized Filter Calculation
  const filteredTasks = useMemo(() => {
    let result: TaskItem[] = tasks.filter((t) => {
      if (selectedCategoryId !== 'all' && t.categoryId !== selectedCategoryId) {
        return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = t.title.toLowerCase().includes(query);
        const matchesDesc = t.description.toLowerCase().includes(query);
        const matchesExpected = t.expectedOutput.toLowerCase().includes(query);
        const matchesTags = t.tags.some((tag) => tag.toLowerCase().includes(query));
        const matchesUni = t.requester.university.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesExpected && !matchesTags && !matchesUni) {
          return false;
        }
      }

      if (selectedUni !== 'all') {
        const uni = UNIVERSITIES.find((u) => u.id === selectedUni || u.name.toLowerCase() === selectedUni.toLowerCase());
        const reqUni = t.requester.university.toLowerCase();
        if (uni) {
          const targetName = uni.name.toLowerCase();
          const targetShort = uni.shortName.toLowerCase();
          const matches =
            reqUni.includes(targetName) ||
            targetName.includes(reqUni) ||
            reqUni.includes(targetShort);
          if (!matches) {
            return false;
          }
        } else {
          if (!reqUni.includes(selectedUni.toLowerCase())) {
            return false;
          }
        }
      }

      if (selectedMode !== 'ALL' && t.mode !== selectedMode) {
        return false;
      }

      if (activeQuickTab === 'URGENT') {
        if (!t.deadline.includes('06/10') && !t.deadline.includes('07/10')) {
          return false;
        }
      } else if (activeQuickTab === 'HIGH_BUDGET') {
        if (t.budget < 500000) return false;
      } else if (activeQuickTab === 'ONLINE') {
        if (t.mode !== 'ONLINE') return false;
      } else if (activeQuickTab === 'ONSITE') {
        if (t.mode !== 'ONSITE') return false;
      }

      if (priceFilter === 'UNDER_300K' && t.budget > 300000) return false;
      if (priceFilter === '300K_600K' && (t.budget < 300000 || t.budget > 600000)) return false;
      if (priceFilter === 'OVER_600K' && t.budget < 600000) return false;

      // Filter by Time (Thời gian đăng)
      if (timeFilter === 'PAST_24H') {
        if (t.createdTimestamp) {
          if (Date.now() - t.createdTimestamp > 24 * 60 * 60 * 1000) return false;
        } else if (t.createdAt.includes('ngày')) {
          return false;
        }
      } else if (timeFilter === 'PAST_3DAYS') {
        if (t.createdTimestamp) {
          if (Date.now() - t.createdTimestamp > 3 * 24 * 60 * 60 * 1000) return false;
        }
      }

      // Filter by Trust / Verified Requester (Độ tin cậy người yêu cầu - có tick xanh)
      if (trustFilter === 'VERIFIED_ONLY') {
        if (!t.requester.isVerifiedStudent) return false;
      } else if (trustFilter === 'TOP_REPUTATION') {
        if (!t.requester.isVerifiedStudent || t.requester.rating < 4.9) return false;
      }

      return true;
    });

    // Sorting by newest / time when requested or active
    if (timeFilter === 'NEWEST' || timeFilter === 'PAST_24H' || timeFilter === 'PAST_3DAYS') {
      result = [...result].sort((a, b) => (b.createdTimestamp || 0) - (a.createdTimestamp || 0));
    }

    return result;
  }, [tasks, selectedCategoryId, searchQuery, selectedUni, selectedMode, activeQuickTab, priceFilter, timeFilter, trustFilter]);

  const activeCategoryObject = useMemo(() => {
    return CATEGORIES.find((c) => c.id === selectedCategoryId);
  }, [selectedCategoryId]);

  const handleResetFilters = () => {
    setSelectedCategoryId('all');
    setSearchQuery('');
    setSelectedUni('all');
    setSelectedMode('ALL');
    setActiveQuickTab('ALL');
    setPriceFilter('ALL');
    setTimeFilter('ALL');
    setTrustFilter('ALL');
  };

  const handleCategorySelectFromNav = (catId: string) => {
    setSelectedCategoryId(catId);
    if (activeScreen !== 'HOME') {
      setActiveScreen('HOME');
    }
    setTimeout(() => {
      const el = document.getElementById('market-tasks');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  return (
    <div className="min-h-screen bg-[#f7f7f8] text-[#222325] flex flex-col font-sans">
      
      {/* 1. ROLE SIMULATOR BAR (Khách / Sinh viên / Quản trị viên) */}
      <RoleSwitcherBar
        currentRole={currentRole}
        userMode={userMode}
        onSelectRole={handleSelectRole}
        onToggleUserMode={handleToggleMode}
      />

      {/* 2. MVP QUICK ROADMAP BAR (For PO / Founder review) */}
      <MvpScreenBar
        activeScreen={activeScreen}
        onSelectScreen={(screen) => setActiveScreen(screen)}
        openOrderCount={orders.filter((o) => o.status === 'IN_PROGRESS').length}
        unreadNotifsCount={notifications.filter((n) => !n.read).length}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-neutral-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-neutral-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-[#1dbf73] shrink-0" />
          <span className="text-xs font-medium leading-relaxed">{toastMessage}</span>
        </div>
      )}

      {/* Mode Switch Interactive Notification Banner */}
      <ModeSwitchNotification
        isOpen={modeSwitchNotifOpen}
        mode={userMode}
        onClose={() => setModeSwitchNotifOpen(false)}
        onExploreTasks={() => {
          setActiveScreen('HOME');
          setTimeout(() => {
            const el = document.getElementById('market-tasks');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 50);
        }}
        onNavigateToDashboard={() => {
          setActiveScreen(userMode === 'TASKER' ? 'MY_JOBS' : 'MY_TASKS');
        }}
        onNavigateToOrders={() => {
          setActiveScreen('ORDER_MANAGEMENT');
        }}
      />

      {/* Top Navigation */}
      <Navbar
        currentRole={currentRole}
        currentMode={userMode}
        activeScreen={activeScreen}
        onSelectScreen={(s) => setActiveScreen(s)}
        onToggleMode={handleToggleMode}
        onOpenPostTask={() => {
          if (currentRole === 'GUEST') {
            handleTriggerAuth('POST_TASK');
          } else {
            setActiveScreen('CREATE_TASK');
          }
        }}
        onOpenVerify={() => setIsVerifyModalOpen(true)}
        onTriggerAuth={handleTriggerAuth}
        unreadNotifsCount={notifications.filter((n) => !n.read).length}
        recentNotifications={notifications}
        currentUser={currentUser}
      />

      {/* Category Sub-Nav Bar (Synchronized with market-tasks) */}
      <CategoryNav
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={handleCategorySelectFromNav}
        categories={categories}
      />

      <main className="flex-1">
        {/* LOGGED OUT SCREEN */}
        {activeScreen === 'LOGGED_OUT' && (
          <LoggedOutScreen
            lastUserEmail={currentUser.email}
            onLoginAgain={() => handleTriggerAuth('LOGIN')}
            onExploreAsGuest={() => {
              setCurrentRole('GUEST');
              setActiveScreen('HOME');
            }}
          />
        )}

        {/* ROLE 1: GUEST VIEW (If currentRole === 'GUEST' and activeScreen === 'HOME') */}
        {currentRole === 'GUEST' && activeScreen === 'HOME' && (
          <GuestScreen
            tasks={filteredTasks}
            allTasksCount={tasks.length}
            categories={categories}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedUni={selectedUni}
            onSelectUni={setSelectedUni}
            selectedMode={selectedMode}
            onSelectMode={setSelectedMode}
            activeQuickTab={activeQuickTab}
            onSelectQuickTab={setActiveQuickTab}
            priceFilter={priceFilter}
            onSelectPriceFilter={setPriceFilter}
            timeFilter={timeFilter}
            onSelectTimeFilter={setTimeFilter}
            trustFilter={trustFilter}
            onSelectTrustFilter={setTrustFilter}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={handleCategorySelectFromNav}
            onResetFilters={handleResetFilters}
            onTriggerAuth={handleTriggerAuth}
            onSelectTask={(task) => setSelectedTaskForDetail(task)}
          />
        )}

        {/* ROLE 2: USER / STUDENT SCREENS */}
        {currentRole !== 'GUEST' && activeScreen === 'HOME' && (
          <>
            {/* Student Operational Workspace Banner */}
            <StudentHomeBanner
              currentUser={currentUser}
              userMode={userMode}
              onToggleMode={handleToggleMode}
              availableBalance={availableBalance}
              openOrderCount={orders.filter((o) => o.status === 'IN_PROGRESS' || o.status === 'DELIVERED').length}
              myTasksCount={tasks.filter((t) => t.requester.id === currentUser.id || t.requester.displayName === currentUser.displayName).length}
              myOffersCount={offers.filter((o) => o.tasker.id === currentUser.id).length}
              onOpenPostTask={() => setIsPostTaskOpen(true)}
              onOpenVerify={() => setIsVerifyModalOpen(true)}
              onNavigateToScreen={(s) => setActiveScreen(s)}
              selectedUni={selectedUni}
              onSelectUni={setSelectedUni}
              universities={UNIVERSITIES}
            />

            {/* Hero Section */}
            <HeroSection
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedUni={selectedUni}
              onSelectUni={setSelectedUni}
              selectedMode={selectedMode}
              onSelectMode={setSelectedMode}
              userMode={userMode}
              onToggleMode={handleToggleMode}
              onOpenPostTask={() => setIsPostTaskOpen(true)}
              onOpenVerify={() => setIsVerifyModalOpen(true)}
              onNavigateToScreen={(s) => setActiveScreen(s)}
              openTasksCount={tasks.filter((t) => t.status === 'OPEN').length}
              offersCount={offers.length}
            />

            {/* Live Marketplace Tasks Section (CSS Selector 2: #market-tasks) */}
            <section id="market-tasks" className="py-12 sm:py-16 scroll-mt-24">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* DEDICATED SYNCHRONIZATION BANNER: Displays active category selected in CategoryNav */}
                {activeCategoryObject && (
                  <div className="mb-6 p-4 sm:p-5 bg-white rounded-2xl border-2 border-emerald-500/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 font-bold shrink-0">
                        <Grid className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                            Danh mục đang chọn
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                            {filteredTasks.length} Task phù hợp
                          </span>
                        </div>
                        <h3 className="text-lg font-extrabold text-[#222325]">
                          {activeCategoryObject.name}
                        </h3>
                        <p className="text-xs text-[#62646a] mt-0.5">
                          {activeCategoryObject.description}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedCategoryId('all')}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
                    >
                      <X className="w-4 h-4" />
                      <span>Xem tất cả danh mục</span>
                    </button>
                  </div>
                )}

                {/* Section Heading & Mode Context */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
                      <span>Sàn Task trực tiếp</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-normal text-[#62646a]">
                        {userMode === 'TASKER'
                          ? 'Chế độ Người thực hiện: Duyệt Task để gửi báo giá nhận thù lao'
                          : 'Chế độ Người yêu cầu: Tham khảo ngân sách thị trường và đăng Task tuyển người'}
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#222325] tracking-tight">
                      {userMode === 'TASKER'
                        ? 'Việc làm sinh viên đang tuyển (OPEN)'
                        : 'Khám phá các Task đang mở (OPEN)'}
                    </h2>
                  </div>

                  {/* Reset Filters CTA */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-[#62646a]">
                      Hiển thị <strong>{filteredTasks.length}</strong> / {tasks.length} Task
                    </span>
                    {(selectedCategoryId !== 'all' || searchQuery || selectedUni !== 'all' || selectedMode !== 'ALL' || activeQuickTab !== 'ALL' || priceFilter !== 'ALL' || timeFilter !== 'ALL' || trustFilter !== 'ALL') && (
                      <button
                        onClick={handleResetFilters}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-neutral-600 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Đặt lại bộ lọc</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* In-place Quick Search Bar inside #market-tasks */}
                <div className="mb-4 space-y-2">
                  <div className="relative flex items-center">
                    <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 shrink-0 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Tìm nhanh theo từ khóa Task, kỹ năng (Canva, Python, Slide...), môn học, trường đại học..."
                      className="w-full pl-10 pr-24 py-2.5 text-xs sm:text-sm bg-white rounded-xl border border-neutral-200/90 shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#1dbf73] focus:border-[#1dbf73] text-[#222325] placeholder:text-neutral-400"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="p-1 text-neutral-400 hover:text-neutral-700 rounded-md hover:bg-neutral-100 cursor-pointer"
                          title="Xóa tìm kiếm"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <span className="text-[11px] font-semibold text-neutral-400 px-2 py-0.5 bg-neutral-100 rounded-md hidden sm:inline">
                        Lọc ngay
                      </span>
                    </div>
                  </div>

                  {/* Quick keyword chips */}
                  <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 scrollbar-none text-[11px] text-neutral-500">
                    <span className="font-semibold text-neutral-400 shrink-0 flex items-center gap-1 text-[11px]">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      Gợi ý:
                    </span>
                    {['Canva', 'Python', 'Slide Đồ án', 'Gia sư', 'Bách Khoa', 'Tiểu luận', 'Figma'].map((keyword) => (
                      <button
                        key={keyword}
                        type="button"
                        onClick={() => setSearchQuery(keyword)}
                        className={`px-2 py-0.5 rounded-md border text-[11px] transition-colors cursor-pointer shrink-0 ${
                          searchQuery.toLowerCase() === keyword.toLowerCase()
                            ? 'bg-emerald-600 text-white border-emerald-600 font-semibold shadow-2xs'
                            : 'bg-white hover:bg-neutral-100 border-neutral-200 text-neutral-600'
                        }`}
                      >
                        {keyword}
                      </button>
                    ))}
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="text-[11px] text-rose-600 hover:underline cursor-pointer shrink-0 ml-1 font-semibold"
                      >
                        Xóa lọc từ khóa
                      </button>
                    )}
                  </div>
                </div>

                {/* Quick Segmented Filter Tabs & Advanced Controls */}
                <div className="bg-white p-3.5 rounded-2xl border border-neutral-200/90 shadow-xs mb-6 space-y-3">
                  {/* Top Row: Quick Segmented Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none text-xs font-medium">
                    <button
                      onClick={() => {
                        setActiveQuickTab('ALL');
                        setTimeFilter('ALL');
                        setTrustFilter('ALL');
                      }}
                      className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                        activeQuickTab === 'ALL' && timeFilter === 'ALL' && trustFilter === 'ALL'
                          ? 'bg-neutral-900 text-white font-semibold shadow-xs'
                          : 'text-[#62646a] hover:text-[#222325] hover:bg-neutral-100'
                      }`}
                    >
                      Tất cả Task
                    </button>

                    {/* Quick Button: Mới nhất */}
                    <button
                      onClick={() => setTimeFilter(timeFilter === 'NEWEST' ? 'ALL' : 'NEWEST')}
                      className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                        timeFilter === 'NEWEST'
                          ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                          : 'text-emerald-700 bg-emerald-50/80 hover:bg-emerald-100 border border-emerald-200/80'
                      }`}
                      title="Sắp xếp ưu tiên các Task vừa mới đăng"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Mới nhất</span>
                      {timeFilter === 'NEWEST' && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                    </button>

                    {/* Quick Button: Độ tin cậy (Tick xanh) */}
                    <button
                      onClick={() => setTrustFilter(trustFilter === 'VERIFIED_ONLY' ? 'ALL' : 'VERIFIED_ONLY')}
                      className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                        trustFilter === 'VERIFIED_ONLY'
                          ? 'bg-blue-600 text-white font-semibold shadow-xs'
                          : 'text-blue-700 bg-blue-50/80 hover:bg-blue-100 border border-blue-200/80'
                      }`}
                      title="Chỉ hiển thị Task từ Người yêu cầu đã xác minh Thẻ sinh viên (Tick xanh)"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Có Tick xanh SV</span>
                    </button>

                    <button
                      onClick={() => setActiveQuickTab('URGENT')}
                      className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                        activeQuickTab === 'URGENT'
                          ? 'bg-rose-700 text-white font-semibold shadow-xs'
                          : 'text-[#62646a] hover:text-[#222325] hover:bg-neutral-100'
                      }`}
                    >
                      Hạn gấp (&lt; 48h)
                    </button>
                    <button
                      onClick={() => setActiveQuickTab('HIGH_BUDGET')}
                      className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                        activeQuickTab === 'HIGH_BUDGET'
                          ? 'bg-neutral-900 text-white font-semibold shadow-xs'
                          : 'text-[#62646a] hover:text-[#222325] hover:bg-neutral-100'
                      }`}
                    >
                      Ngân sách &ge; 500k
                    </button>
                    <button
                      onClick={() => setActiveQuickTab('ONLINE')}
                      className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                        activeQuickTab === 'ONLINE'
                          ? 'bg-neutral-900 text-white font-semibold shadow-xs'
                          : 'text-[#62646a] hover:text-[#222325] hover:bg-neutral-100'
                      }`}
                    >
                      Làm Online
                    </button>
                    <button
                      onClick={() => setActiveQuickTab('ONSITE')}
                      className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                        activeQuickTab === 'ONSITE'
                          ? 'bg-neutral-900 text-white font-semibold shadow-xs'
                          : 'text-[#62646a] hover:text-[#222325] hover:bg-neutral-100'
                      }`}
                    >
                      Onsite tại trường
                    </button>
                  </div>

                  {/* Secondary Filters Bar: Thời gian đăng, Độ tin cậy tick xanh, Ngân sách */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-neutral-100">
                    <div className="flex flex-wrap items-center gap-3">
                      {/* Filter 1: Thời gian đăng (Mới nhất) */}
                      <div className="flex items-center gap-1.5 text-xs">
                        <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="text-[#62646a] font-medium hidden sm:inline">Thời gian đăng:</span>
                        <select
                          value={timeFilter}
                          onChange={(e) => setTimeFilter(e.target.value as any)}
                          className={`py-1.5 px-2.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                            timeFilter !== 'ALL'
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                              : 'bg-neutral-50 border-neutral-200 text-[#404145]'
                          }`}
                        >
                          <option value="ALL">Mọi thời điểm</option>
                          <option value="NEWEST">⚡ Mới nhất (Vừa đăng)</option>
                          <option value="PAST_24H">24 giờ qua (Hôm nay)</option>
                          <option value="PAST_3DAYS">3 ngày gần đây</option>
                        </select>
                      </div>

                      {/* Filter 2: Độ tin cậy người yêu cầu (Có Tick xanh) */}
                      <div className="flex items-center gap-1.5 text-xs">
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="text-[#62646a] font-medium hidden sm:inline">Độ tin cậy:</span>
                        <select
                          value={trustFilter}
                          onChange={(e) => setTrustFilter(e.target.value as any)}
                          className={`py-1.5 px-2.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                            trustFilter !== 'ALL'
                              ? 'bg-blue-50 border-blue-300 text-blue-800'
                              : 'bg-neutral-50 border-neutral-200 text-[#404145]'
                          }`}
                        >
                          <option value="ALL">Tất cả người yêu cầu</option>
                          <option value="VERIFIED_ONLY">✓ Chỉ người có Tick xanh (Đã xác minh)</option>
                          <option value="TOP_REPUTATION">★ Uy tín cao nhất (Tick xanh &amp; 4.9★+)</option>
                        </select>
                      </div>

                      {/* Filter 3: Mức ngân sách */}
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="text-[#62646a] font-medium hidden sm:inline">Ngân sách:</span>
                        <select
                          value={priceFilter}
                          onChange={(e) => setPriceFilter(e.target.value as any)}
                          className={`py-1.5 px-2.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                            priceFilter !== 'ALL'
                              ? 'bg-amber-50 border-amber-300 text-amber-800'
                              : 'bg-neutral-50 border-neutral-200 text-[#404145]'
                          }`}
                        >
                          <option value="ALL">Mọi mức giá</option>
                          <option value="UNDER_300K">Dưới 300.000 đ</option>
                          <option value="300K_600K">300.000 đ - 600.000 đ</option>
                          <option value="OVER_600K">Trên 600.000 đ</option>
                        </select>
                      </div>

                      {/* Filter 4: Trường Đại học (Dropdown chính thức từ UNIVERSITIES) */}
                      <div className="flex items-center gap-1.5 text-xs">
                        <GraduationCap className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span className="text-[#62646a] font-medium hidden sm:inline">Trường ĐH:</span>
                        <select
                          value={selectedUni}
                          onChange={(e) => setSelectedUni(e.target.value)}
                          className={`py-1.5 px-2.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors max-w-[200px] truncate ${
                            selectedUni !== 'all'
                              ? 'bg-indigo-50 border-indigo-300 text-indigo-800 font-bold'
                              : 'bg-neutral-50 border-neutral-200 text-[#404145]'
                          }`}
                          title="Lọc theo trường đại học"
                        >
                          <option value="all">Tất cả các trường (Toàn quốc)</option>
                          {UNIVERSITIES.filter((u) => u.id !== 'all').map((u) => (
                            <option key={u.id} value={u.id}>
                              {u.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="text-[11px] text-[#62646a]">
                      Đang hiển thị <strong>{filteredTasks.length}</strong> kết quả
                    </div>
                  </div>

                  {/* Quick University Pills Carousel (Chọn nhanh trường) */}
                  <div className="pt-2 border-t border-neutral-100 flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none text-xs">
                    <span className="text-[11px] font-semibold text-neutral-400 shrink-0 flex items-center gap-1 mr-1">
                      <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
                      Chọn nhanh:
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedUni('all')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                        selectedUni === 'all'
                          ? 'bg-neutral-900 text-white shadow-2xs'
                          : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600'
                      }`}
                    >
                      Toàn quốc
                    </button>
                    {UNIVERSITIES.filter((u) => u.id !== 'all').map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => setSelectedUni(u.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                          selectedUni === u.id
                            ? 'bg-indigo-600 text-white font-bold shadow-2xs ring-2 ring-indigo-300'
                            : 'bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/80 text-neutral-700 font-medium'
                        }`}
                      >
                        {u.name}
                      </button>
                    ))}
                  </div>

                  {/* Active Filter Chips with Individual Clear */}
                  {(timeFilter !== 'ALL' || trustFilter !== 'ALL' || priceFilter !== 'ALL' || selectedUni !== 'all') && (
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-neutral-100 text-xs">
                      <span className="text-[#62646a] font-medium flex items-center gap-1">
                        <Filter className="w-3 h-3 text-neutral-400" />
                        Đang chọn lọc:
                      </span>

                      {/* Active Chip: Trường Đại học */}
                      {selectedUni !== 'all' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200 font-medium">
                          <GraduationCap className="w-3 h-3 text-indigo-600" />
                          <span>
                            Trường: {UNIVERSITIES.find((u) => u.id === selectedUni)?.name || selectedUni}
                          </span>
                          <button
                            onClick={() => setSelectedUni('all')}
                            className="hover:text-indigo-950 cursor-pointer ml-0.5 font-bold"
                            title="Bỏ lọc trường"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}

                      {timeFilter !== 'ALL' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
                          <Clock className="w-3 h-3 text-emerald-600" />
                          <span>
                            {timeFilter === 'NEWEST' && 'Mới nhất'}
                            {timeFilter === 'PAST_24H' && '24 giờ qua'}
                            {timeFilter === 'PAST_3DAYS' && '3 ngày qua'}
                          </span>
                          <button
                            onClick={() => setTimeFilter('ALL')}
                            className="hover:text-emerald-950 cursor-pointer ml-0.5"
                            title="Bỏ lọc thời gian"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}

                      {trustFilter !== 'ALL' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 font-medium">
                          <CheckCircle className="w-3 h-3 text-blue-600" />
                          <span>
                            {trustFilter === 'VERIFIED_ONLY' && 'Người yêu cầu có Tick xanh'}
                            {trustFilter === 'TOP_REPUTATION' && 'Tick xanh & Uy tín ≥ 4.9★'}
                          </span>
                          <button
                            onClick={() => setTrustFilter('ALL')}
                            className="hover:text-blue-950 cursor-pointer ml-0.5"
                            title="Bỏ lọc độ tin cậy"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}

                      {priceFilter !== 'ALL' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-medium">
                          <span>
                            {priceFilter === 'UNDER_300K' && '< 300k'}
                            {priceFilter === '300K_600K' && '300k - 600k'}
                            {priceFilter === 'OVER_600K' && '> 600k'}
                          </span>
                          <button
                            onClick={() => setPriceFilter('ALL')}
                            className="hover:text-amber-950 cursor-pointer ml-0.5"
                            title="Bỏ lọc ngân sách"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}

                      <button
                        onClick={handleResetFilters}
                        className="text-[11px] text-neutral-500 hover:text-neutral-900 underline ml-auto cursor-pointer"
                      >
                        Xóa tất cả
                      </button>
                    </div>
                  )}
                </div>

                {/* Trust Guidance Banner when Tick Xanh filter is active */}
                {trustFilter !== 'ALL' && (
                  <div className="mb-6 p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200 text-xs text-blue-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 shrink-0">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-blue-900">Bộ lọc Độ tin cậy kích hoạt:</span>{' '}
                        <span>
                          Chỉ hiển thị các Task từ Người yêu cầu đã có <strong>Tick xanh SV</strong> (xác thực thẻ sinh viên &amp; email trường đại học). Tất cả ngân sách được bảo chứng ký quỹ Escrow 100%!
                        </span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 font-bold shrink-0 self-start sm:self-auto">
                      {filteredTasks.length} Task có Tick xanh
                    </span>
                  </div>
                )}

                {/* Newest Tasks guidance banner */}
                {timeFilter === 'NEWEST' && trustFilter === 'ALL' && (
                  <div className="mb-6 p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between gap-3 animate-in fade-in">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-emerald-900">Đang ưu tiên Task mới nhất:</span>{' '}
                        <span>Sắp xếp các bài đăng vừa tạo từ 10 - 35 phút trước lên đầu trang để bạn nộp báo giá sớm nhất.</span>
                      </div>
                    </div>
                    <span className="text-emerald-700 font-semibold shrink-0 hidden sm:inline">
                      Cơ hội nhận Task cao nhất
                    </span>
                  </div>
                )}

                {/* Task Grid with Bookmark Action */}
                {filteredTasks.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onSelectTask={(t) => setSelectedTaskForDetail(t)}
                        onQuickOffer={(t) => setSelectedTaskForDetail(t)}
                        isSaved={savedTaskIds.includes(task.id)}
                        onToggleSave={handleToggleSaveTask}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl p-12 text-center border border-neutral-200/90 max-w-lg mx-auto space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-neutral-400 mx-auto flex items-center justify-center">
                      <Filter className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#222325]">
                        Không tìm thấy Task nào phù hợp
                      </h3>
                      <p className="text-xs text-[#62646a] mt-1">
                        Hãy thử đổi từ khóa tìm kiếm, chọn lại danh mục hoặc đặt lại bộ lọc.
                      </p>
                    </div>
                    <div className="flex items-center justify-center gap-3 pt-2">
                      <button
                        onClick={handleResetFilters}
                        className="px-4 py-2 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl cursor-pointer"
                      >
                        Xem tất cả Task
                      </button>
                      <button
                        onClick={() => setIsPostTaskOpen(true)}
                        className="px-4 py-2 text-xs font-bold text-white bg-[#1dbf73] hover:bg-[#19a463] rounded-xl cursor-pointer"
                      >
                        + Đăng Task của bạn
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Logged in fast action bar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
              <div className="p-6 bg-linear-to-r from-neutral-900 to-neutral-800 text-white rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm border border-neutral-700/80">
                <div className="space-y-1 text-center md:text-left">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    Cộng đồng học thuật &amp; Thu nhập sinh viên
                  </span>
                  <h4 className="text-base font-extrabold text-white">
                    Cần bạn sinh viên hỗ trợ gấp hoặc muốn nhận thêm Task cùng trường?
                  </h4>
                  <p className="text-xs text-neutral-300">
                    Toàn bộ thù lao được khóa ký quỹ Escrow minh bạch, an toàn và 0% phí sàn cho sinh viên.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    onClick={() => setIsPostTaskOpen(true)}
                    className="px-4 py-2.5 bg-[#1dbf73] hover:bg-[#19a463] text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-colors"
                  >
                    + Đăng Task mới ngay
                  </button>
                  <button
                    onClick={() => setActiveScreen('CAMPUS_HUB')}
                    className="px-4 py-2.5 bg-neutral-700 hover:bg-neutral-600 text-white font-bold text-xs rounded-xl cursor-pointer transition-colors"
                  >
                    Vào Campus Hub
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* SCREEN: FULL PAGE CREATE TASK */}
        {activeScreen === 'CREATE_TASK' && (
          <CreateTaskScreen
            onBack={() => setActiveScreen('HOME')}
            onTaskCreated={handleCreateTaskFromScreen}
            userUniversity={currentUser.university}
          />
        )}

        {/* SCREEN: ESCROW CHECKOUT & PAYMENT */}
        {activeScreen === 'CHECKOUT_ESCROW' && (
          <CheckoutEscrowScreen
            draft={checkoutDraft}
            availableBalance={availableBalance}
            currentUser={currentUser}
            onConfirmPayment={handleConfirmEscrowPayment}
            onCancel={() => setActiveScreen('MY_TASKS')}
          />
        )}

        {/* SCREEN: DIRECT MESSENGER & CHAT */}
        {activeScreen === 'MESSAGES' && (
          <ChatCenterScreen
            threads={chatThreads}
            currentUser={currentUser}
            initialThreadId={selectedChatThreadId}
            onSendMessage={handleSendDirectMessage}
            onSelectTaskDetail={(taskId) => {
              const target = tasks.find((t) => t.id === taskId);
              if (target) {
                setSelectedTaskForDetail(target);
                setActiveScreen('TASK_DETAIL');
              }
            }}
            onBackToHome={() => setActiveScreen('HOME')}
          />
        )}

        {/* SCREEN: SAVED TASKS & WATCHLIST */}
        {activeScreen === 'SAVED_TASKS' && (
          <SavedTasksScreen
            savedTasks={savedTasks}
            onSelectTask={(task) => {
              setSelectedTaskForDetail(task);
              setActiveScreen('TASK_DETAIL');
            }}
            onToggleSaveTask={handleToggleSaveTask}
            onExploreTasks={() => {
              setActiveScreen('HOME');
              setTimeout(() => {
                const el = document.getElementById('market-tasks');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 50);
            }}
          />
        )}

        {/* SCREEN: HELP & STUDENT SAFETY CENTER */}
        {activeScreen === 'HELP_CENTER' && (
          <HelpCenterScreen
            onBackToHome={() => setActiveScreen('HOME')}
            onOpenDispute={() => setActiveScreen('DISPUTES')}
          />
        )}

        {/* SCREEN: TASK DETAIL DEDICATED PAGE */}
        {activeScreen === 'TASK_DETAIL' && (
          <TaskDetailScreen
            task={selectedTaskForDetail || tasks[0]}
            userRole={currentRole}
            userMode={userMode}
            currentUserId={currentUser.id}
            isSaved={selectedTaskForDetail ? savedTaskIds.includes(selectedTaskForDetail.id) : false}
            onToggleSave={handleToggleSaveTask}
            onBack={() => setActiveScreen('HOME')}
            onTriggerAuth={handleTriggerAuth}
            onToggleMode={handleToggleMode}
            onGoToMyTasks={() => setActiveScreen('MY_TASKS')}
            onSubmitOffer={handleSubmitOffer}
            onOpenReport={(t) => {
              showToast(`Đã tiếp nhận báo cáo cho Task #${t.id}. Đội ngũ Kiểm duyệt sẽ xem xét trong 24h.`);
            }}
            relatedTasks={tasks.filter((t) => t.id !== (selectedTaskForDetail?.id || tasks[0].id)).slice(0, 3)}
            onSelectRelatedTask={(t) => setSelectedTaskForDetail(t)}
            onViewPortfolio={(req) => {
              setSelectedStudentForPortfolio(req);
              setActiveScreen('PUBLIC_PORTFOLIO');
            }}
          />
        )}

        {/* SCREEN: MY TASKS (REQUESTER DASHBOARD) */}
        {activeScreen === 'MY_TASKS' && (
          <MyTasksScreen
            tasks={tasks}
            offers={offers}
            onOpenPostTask={() => setIsPostTaskOpen(true)}
            onAcceptOffer={handleAcceptOffer}
            onSelectTaskDetail={(t) => setSelectedTaskForDetail(t)}
            onNavigateToOrders={() => setActiveScreen('ORDER_MANAGEMENT')}
          />
        )}

        {/* SCREEN: MY JOBS (TASKER WORKSPACE) */}
        {activeScreen === 'MY_JOBS' && (
          <MyJobsScreen
            myOffers={offers}
            myOrders={orders}
            onOpenOrder={(order) => {
              setActiveOrder(order);
              setActiveScreen('ORDER_WORKSPACE');
            }}
            onExploreTasks={() => {
              setActiveScreen('HOME');
              setTimeout(() => {
                const el = document.getElementById('market-tasks');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 50);
            }}
            onNavigateToOrders={() => setActiveScreen('ORDER_MANAGEMENT')}
            onNavigateToAnalytics={() => setActiveScreen('STUDENT_ANALYTICS')}
          />
        )}

        {/* SCREEN: UNIFIED ORDER MANAGEMENT (ORDER-01) */}
        {activeScreen === 'ORDER_MANAGEMENT' && (
          <OrderManagementScreen
            orders={orders}
            currentUser={currentUser}
            userMode={userMode}
            onOpenOrderWorkspace={(order) => {
              setActiveOrder(order);
              setActiveScreen('ORDER_WORKSPACE');
            }}
            onOpenDispute={(order) => {
              handleOpenDispute(order.id);
              setActiveScreen('DISPUTES');
            }}
            onNavigateToScreen={(s) => setActiveScreen(s)}
            onExploreTasks={() => {
              setActiveScreen('HOME');
              setTimeout(() => {
                const el = document.getElementById('market-tasks');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 50);
            }}
          />
        )}

        {/* SCREEN: PUBLIC TASKER PORTFOLIO SHOWCASE (PORTFOLIO-01) */}
        {activeScreen === 'PUBLIC_PORTFOLIO' && (
          <PublicPortfolioScreen
            studentProfile={selectedStudentForPortfolio || undefined}
            currentUser={currentUser}
            availableTasks={tasks}
            onSendMessage={(peerUser) => {
              const peerName = peerUser.displayName || 'Bạn Sinh viên';
              const existing = chatThreads.find(
                (t) => t.peerUser.id === peerUser.id || t.peerUser.displayName === peerName
              );
              if (existing) {
                setSelectedChatThreadId(existing.id);
              } else {
                const newThreadId = `ct-${Date.now().toString().slice(-4)}`;
                const newThread: ChatThread = {
                  id: newThreadId,
                  peerUser: peerUser,
                  lastMessage: 'Đã bắt đầu cuộc hội thoại trực tiếp.',
                  lastTimestamp: 'Vừa xong',
                  unreadCount: 0,
                  messages: [
                    {
                      id: `msg-${Date.now()}`,
                      senderId: 'sys-vietvi',
                      content: `Bạn đã kết nối trực tiếp với ${peerName} (${peerUser.university || 'Cộng đồng sinh viên'}). Hãy trao đổi minh bạch và an toàn!`,
                      createdAt: 'Vừa xong',
                      isRead: true,
                    },
                  ],
                };
                setChatThreads((prev) => [newThread, ...prev]);
                setSelectedChatThreadId(newThreadId);
              }
              setActiveScreen('MESSAGES');
            }}
            onInviteToTask={(studentId, taskTitle, budget) => {
              showToast(`Đã gửi lời mời nhận Task "${taskTitle}" (${budget.toLocaleString('vi-VN')} đ) thành công!`);
            }}
            onBackToHome={() => setActiveScreen('HOME')}
            onExploreLeaderboard={() => setActiveScreen('CAMPUS_HUB')}
          />
        )}

        {/* SCREEN: ACADEMIC INTEGRITY & CODE OF CONDUCT (INTEGRITY-01) */}
        {activeScreen === 'INTEGRITY_POLICY' && (
          <IntegrityPolicyScreen
            currentUser={currentUser}
            onBackToHome={() => setActiveScreen('HOME')}
            onExploreTasks={() => {
              setActiveScreen('HOME');
              setTimeout(() => {
                const el = document.getElementById('market-tasks');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 50);
            }}
            onReportViolation={() => setActiveScreen('DISPUTES')}
          />
        )}

        {/* SCREEN: STUDENT EARNINGS & SKILL ANALYTICS (ANALYTICS-01) */}
        {activeScreen === 'STUDENT_ANALYTICS' && (
          <StudentAnalyticsScreen
            currentUser={currentUser}
            orders={orders}
            availableBalance={availableBalance}
            escrowLockedAmount={escrowLockedAmount}
            onNavigateToWallet={() => setActiveScreen('WALLET')}
            onExploreTasks={() => {
              setActiveScreen('HOME');
              setTimeout(() => {
                const el = document.getElementById('market-tasks');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 50);
            }}
            onBackToHome={() => setActiveScreen('HOME')}
          />
        )}

        {/* SCREEN: ORDER WORKSPACE & CHAT */}
        {activeScreen === 'ORDER_WORKSPACE' && (
          <OrderWorkspaceScreen
            order={activeOrder}
            messages={messages.filter((m) => m.orderId === activeOrder.id)}
            userMode={userMode}
            onSendMessage={handleSendMessage}
            onSubmitDelivery={handleSubmitDelivery}
            onAcceptDelivery={handleAcceptDelivery}
            onRequestRevision={handleRequestRevision}
            onBackToJobs={() => setActiveScreen(userMode === 'REQUESTER' ? 'MY_TASKS' : 'MY_JOBS')}
            onOpenDispute={handleOpenDispute}
            onSubmitReview={handleSubmitReview}
          />
        )}

        {/* SCREEN: STUDENT WALLET & ESCROW LEDGER */}
        {activeScreen === 'WALLET' && (
          <WalletScreen
            transactions={transactions}
            availableBalance={availableBalance}
            escrowLockedAmount={escrowLockedAmount}
            userMode={userMode}
            onRequestPayout={handleRequestPayout}
            onDepositFunds={handleDepositFunds}
            onNavigateToAnalytics={() => setActiveScreen('STUDENT_ANALYTICS')}
            onExploreTasks={() => {
              setActiveScreen('HOME');
              setTimeout(() => {
                const el = document.getElementById('market-tasks');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 50);
            }}
          />
        )}

        {/* SCREEN: DISPUTE & MEDIATION CENTER */}
        {activeScreen === 'DISPUTES' && (
          <DisputeCenterScreen
            disputes={disputes}
            orders={orders}
            onOpenDispute={handleOpenDispute}
            onAdminResolveDispute={handleAdminResolveDispute}
            isAdmin={currentRole === 'ADMIN'}
            onBackToOrders={() => setActiveScreen('ORDER_MANAGEMENT')}
          />
        )}

        {/* SCREEN: CAMPUS COMMUNITY HUB & LEADERBOARD */}
        {activeScreen === 'CAMPUS_HUB' && (
          <CampusHubScreen
            leaderboard={campusLeaders}
            onSelectUniversity={(uniName) => {
              const matched = UNIVERSITIES.find((u) => u.shortName.toLowerCase() === uniName.toLowerCase());
              if (matched) setSelectedUni(matched.id);
            }}
            onSelectStudentPortfolio={(student) => {
              setSelectedStudentForPortfolio(student);
              setActiveScreen('PUBLIC_PORTFOLIO');
            }}
            onExploreTasks={() => {
              setActiveScreen('HOME');
              setTimeout(() => {
                const el = document.getElementById('market-tasks');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 50);
            }}
            onOpenVerify={() => setActiveScreen('VERIFICATION_CENTER')}
          />
        )}

        {/* SCREEN: 360° REPUTATION & REVIEWS CENTER */}
        {activeScreen === 'REVIEWS_CENTER' && (
          <ReviewsCenterScreen
            reviews={studentReviews}
            currentUser={currentUser}
            onSubmitReply={handleReplyReview}
            onExploreOrders={() => setActiveScreen('ORDER_MANAGEMENT')}
          />
        )}

        {/* SCREEN: STUDENT IDENTITY KYC CENTER */}
        {activeScreen === 'VERIFICATION_CENTER' && (
          <VerificationCenterScreen
            currentUser={currentUser}
            onVerificationSubmitted={handleVerificationSubmitted}
            onExploreTasks={() => {
              setActiveScreen('HOME');
              setTimeout(() => {
                const el = document.getElementById('market-tasks');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 50);
            }}
          />
        )}

        {/* SCREEN: NOTIFICATION CENTER */}
        {activeScreen === 'NOTIFICATIONS' && (
          <NotificationCenterScreen
            notifications={notifications}
            onMarkAllAsRead={handleMarkAllNotificationsRead}
            onNotificationClick={handleNotificationClick}
          />
        )}

        {/* SCREEN: STUDENT PROFILE & REPUTATION */}
        {activeScreen === 'PROFILE' && (
          <ProfileScreen
            currentUser={currentUser}
            currentMode={userMode}
            onToggleMode={handleToggleMode}
            onOpenVerify={() => setActiveScreen('VERIFICATION_CENTER')}
            onOpenEditProfile={(tab = 'BASIC') => handleOpenEditProfile(tab)}
            onLogout={handleLogout}
            savedTasks={savedTasks}
            onSelectTask={(task) => setSelectedTaskForDetail(task)}
            onToggleSaveTask={handleToggleSaveTask}
            onViewPublicPortfolio={() => {
              setSelectedStudentForPortfolio(currentUser);
              setActiveScreen('PUBLIC_PORTFOLIO');
            }}
            onViewAnalytics={() => setActiveScreen('STUDENT_ANALYTICS')}
          />
        )}

        {/* SCREEN: STAFF OPS & ARBITRATION DESK */}
        {activeScreen === 'STAFF' && (
          <StaffScreen
            verifications={verifications}
            onApproveVerification={handleApproveVerification}
            onRejectVerification={handleRejectVerification}
            onRequestResubmitVerification={handleRequestResubmitVerification}
            disputes={disputes}
            onArbitrateDispute={handleArbitrateDispute}
            reports={reports}
            onModerateReport={handleModerateReport}
            supportTickets={supportTickets}
            onReplyTicket={handleReplyTicket}
            tasks={tasks}
            onBoostUrgentTask={handleBoostUrgentTask}
            onNavigateToScreen={(screen) => setActiveScreen(screen)}
          />
        )}

        {/* SCREEN: ADMIN OPS & SUPREME GOVERNANCE DASHBOARD */}
        {activeScreen === 'ADMIN' && (
          <AdminScreen
            verifications={verifications}
            onApproveVerification={handleApproveVerification}
            onRejectVerification={handleRejectVerification}
            disputes={disputes}
            onFinalRulingDispute={handleFinalRulingDispute}
            reports={reports}
            onConfirmBanUser={handleConfirmBanUser}
            onPardonUser={handlePardonUser}
            categories={categories}
            onAddCategory={handleAddCategory}
            staffMembers={staffMembers}
            auditLogs={auditLogs}
            onAddAuditLog={(entry) => setAuditLogs((prev) => [entry, ...prev])}
            platformConfig={platformConfig}
            onUpdatePlatformConfig={(cfg) => setPlatformConfig((prev) => ({ ...prev, ...cfg }))}
            onNavigateToScreen={(screen) => setActiveScreen(screen)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigateToScreen={(screen) => setActiveScreen(screen)} />

      {/* Task Detail Modal */}
      {selectedTaskForDetail && (
        <TaskDetailModal
          task={selectedTaskForDetail}
          onClose={() => setSelectedTaskForDetail(null)}
          userRole={currentRole}
          userMode={userMode}
          currentUserId={currentUser.id}
          onTriggerAuth={handleTriggerAuth}
          onToggleMode={handleToggleMode}
          onGoToMyTasks={() => {
            setSelectedTaskForDetail(null);
            setActiveScreen('MY_TASKS');
          }}
          onSubmitOffer={handleSubmitOffer}
          onViewFullScreen={handleOpenTaskFullScreen}
          onViewPortfolio={(req) => {
            setSelectedStudentForPortfolio(req);
            setActiveScreen('PUBLIC_PORTFOLIO');
          }}
        />
      )}

      {/* Post Task Modal */}
      <PostTaskModal
        isOpen={isPostTaskOpen}
        onClose={() => setIsPostTaskOpen(false)}
        onTaskCreated={handleTaskCreated}
        currentUser={currentUser}
      />

      {/* Verification Modal */}
      <VerifyModal
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
      />

      {/* Auth Modal with OTP & AuthIntent (AUTH-01, AUTH-02) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccessLogin={handleSuccessLogin}
        authIntent={authIntent}
      />

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        currentUser={currentUser}
        onSaveProfile={handleSaveProfile}
        initialTab={editProfileInitialTab}
      />

      {/* Spring ChatBot AI Assistant */}
      <SpringChatBot
        currentUser={currentUser}
        userMode={userMode}
        onNavigateToScreen={(screen) => setActiveScreen(screen)}
        onOpenPostTask={() => setIsPostTaskOpen(true)}
        onOpenVerify={() => setIsVerifyModalOpen(true)}
        onToggleUserMode={handleToggleMode}
      />
    </div>
  );
}
