import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  Clock,
  Award,
  Calendar,
  Layers,
  ArrowUpRight,
  Download,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  BarChart3,
  PieChart,
  Briefcase,
  Zap,
} from 'lucide-react';
import { UserProfile, OrderItem } from '../../types';

interface StudentAnalyticsScreenProps {
  currentUser: UserProfile;
  orders: OrderItem[];
  availableBalance: number;
  escrowLockedAmount: number;
  onNavigateToWallet: () => void;
  onExploreTasks: () => void;
  onBackToHome: () => void;
}

export const StudentAnalyticsScreen: React.FC<StudentAnalyticsScreenProps> = ({
  currentUser,
  orders,
  availableBalance,
  escrowLockedAmount,
  onNavigateToWallet,
  onExploreTasks,
  onBackToHome,
}) => {
  const [timeRange, setTimeRange] = useState<'WEEK' | 'MONTH' | 'ALL'>('MONTH');
  const [exportToast, setExportToast] = useState(false);

  // Weekly data for interactive bar chart
  const weeklyData = [
    { label: 'Tuần 1 (01-07/10)', amount: 2400000, tasks: 4, height: '45%' },
    { label: 'Tuần 2 (08-14/10)', amount: 3800000, tasks: 6, height: '70%' },
    { label: 'Tuần 3 (15-21/10)', amount: 4600000, tasks: 8, height: '85%' },
    { label: 'Tuần 4 (22-28/10)', amount: 5400000, tasks: 9, height: '100%' },
  ];

  // Category breakdown
  const categoryBreakdown = [
    { name: 'Lập trình & Crawl Dữ liệu', percent: 45, amount: 8302500, color: 'bg-emerald-500' },
    { name: 'Thiết kế Slide & Pitch Deck', percent: 30, amount: 5535000, color: 'bg-indigo-500' },
    { name: 'Gia sư & Ôn tập Toán', percent: 15, amount: 2767500, color: 'bg-amber-500' },
    { name: 'Dịch thuật IEEE & Báo cáo', percent: 10, amount: 1845000, color: 'bg-sky-500' },
  ];

  // Campus market demand trends
  const highDemandSkills = [
    { skill: 'Python Selenium / Scraper', demand: 'Cực cao', avgPrice: '450.000 - 800.000 đ / task', growth: '+28%' },
    { skill: 'Canva Pro Slide Thuyết trình', demand: 'Rất cao', avgPrice: '300.000 - 550.000 đ / task', growth: '+35%' },
    { skill: 'Gia sư Toán Giải Tích 2 / Xác suất', demand: 'Cao', avgPrice: '200.000 - 250.000 đ / giờ', growth: '+19%' },
    { skill: 'Dịch thuật bài báo khoa học', demand: 'Ổn định', avgPrice: '25.000 đ / trang', growth: '+12%' },
  ];

  const handleExportStatement = () => {
    setExportToast(true);
    setTimeout(() => setExportToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Header Breadcrumbs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#62646a] mb-1">
              <button onClick={onBackToHome} className="hover:text-emerald-600 cursor-pointer">
                Trang chủ
              </button>
              <span>/</span>
              <span>Tài chính &amp; Năng lực</span>
              <span>/</span>
              <span className="font-bold text-[#222325]">Mã màn: ANALYTICS-01</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-600">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-[#222325] tracking-tight">
                  Thống kê Thu nhập &amp; Hiệu suất Sinh viên
                </h1>
                <p className="text-xs text-[#62646a]">
                  Báo cáo thu nhập minh bạch, chỉ số giao hàng đúng hạn SLA và phân tích xu hướng kỹ năng hot.
                </p>
              </div>
            </div>
          </div>

          {/* Time Filter & Export */}
          <div className="flex items-center gap-2.5">
            <div className="p-1 bg-white border border-neutral-200 rounded-xl text-xs font-semibold flex items-center">
              <button
                onClick={() => setTimeRange('WEEK')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  timeRange === 'WEEK' ? 'bg-emerald-600 text-white' : 'text-neutral-600 hover:text-black'
                }`}
              >
                Tuần này
              </button>
              <button
                onClick={() => setTimeRange('MONTH')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  timeRange === 'MONTH' ? 'bg-emerald-600 text-white' : 'text-neutral-600 hover:text-black'
                }`}
              >
                Tháng này
              </button>
              <button
                onClick={() => setTimeRange('ALL')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  timeRange === 'ALL' ? 'bg-emerald-600 text-white' : 'text-neutral-600 hover:text-black'
                }`}
              >
                Toàn thời gian
              </button>
            </div>

            <button
              onClick={handleExportStatement}
              className="px-3.5 py-2 bg-white hover:bg-neutral-100 text-neutral-700 text-xs font-bold rounded-xl border border-neutral-200 flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Xuất sao kê</span>
            </button>
          </div>
        </div>

        {exportToast && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-800 font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              ✓ Đã xuất thành công Báo cáo Thu nhập Sinh viên (PDF / CSV) có chữ ký số xác thực của VIETVI!
            </span>
          </div>
        )}

        {/* 4 Primary KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-neutral-200/90 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-neutral-400">
              <span className="text-xs font-semibold text-neutral-600">Tổng Thu Nhập Đã Nhận</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#222325]">
              18.450.000 đ
            </div>
            <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 pt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+24.5% so với tháng trước</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-neutral-200/90 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-neutral-400">
              <span className="text-xs font-semibold text-neutral-600">Thù Lao TB / Task</span>
              <Layers className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-indigo-700">
              485.500 đ
            </div>
            <div className="text-[11px] text-neutral-500 pt-1">
              Mức trung bình toàn sàn: 350.000 đ
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-neutral-200/90 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-neutral-400">
              <span className="text-xs font-semibold text-neutral-600">Tỷ Lệ Đúng Hạn SLA</span>
              <Clock className="w-4 h-4 text-sky-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-sky-700">
              98.8%
            </div>
            <div className="text-[11px] text-sky-600 font-semibold pt-1">
              37/38 Task giao trước hạn
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-neutral-200/90 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-neutral-400">
              <span className="text-xs font-semibold text-neutral-600">Điểm Uy Tín &amp; CSAT</span>
              <Award className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-500">
              4.98 / 5.0
            </div>
            <div className="text-[11px] text-amber-700 font-bold pt-1">
              Top 1% Sinh viên Bách Khoa
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Chart 1: Weekly Earnings Bar Chart (Takes 2 cols) */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-7 shadow-2xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-[#222325]">
                  Biểu Đồ Doanh Thu Theo Tuần
                </h3>
                <p className="text-xs text-neutral-500">
                  Số tiền đã giải ngân từ két Escrow vào Ví sinh viên trong tháng này
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-black border border-emerald-200">
                Tổng: 16.200.000 đ
              </span>
            </div>

            {/* Visual Bar Canvas */}
            <div className="h-56 pt-8 pb-4 flex items-end justify-between gap-4 border-b border-neutral-100">
              {weeklyData.map((w, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[11px] font-bold text-neutral-700 opacity-0 group-hover:opacity-100 transition-opacity">
                    {w.amount.toLocaleString('vi-VN')} đ
                  </span>
                  <div
                    style={{ height: w.height }}
                    className="w-full max-w-[56px] bg-linear-to-t from-emerald-600 to-emerald-400 rounded-2xl group-hover:from-emerald-500 group-hover:to-emerald-300 transition-all shadow-xs relative"
                  >
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white border border-emerald-500" />
                  </div>
                  <span className="text-[10px] text-neutral-500 font-medium text-center truncate max-w-[80px]">
                    Tuần {idx + 1}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-neutral-500 pt-1">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                Thù lao thực nhận (0% phí hoa hồng sàn)
              </span>
              <button
                onClick={onNavigateToWallet}
                className="font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
              >
                <span>Xem lịch sử Ví</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Chart 2: Income by Category (Takes 1 col) */}
          <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-7 shadow-2xs space-y-6 flex flex-col justify-between">
            <div>
              <h3 className="font-extrabold text-base text-[#222325]">
                Cơ Cấu Nguồn Thu
              </h3>
              <p className="text-xs text-neutral-500">
                Tỷ trọng thù lao theo từng nhóm danh mục Task
              </p>
            </div>

            <div className="space-y-4 my-2">
              {categoryBreakdown.map((cat, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-neutral-700">
                    <span className="truncate pr-2">{cat.name}</span>
                    <span className="font-bold text-[#222325] shrink-0">{cat.percent}%</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${cat.percent}%` }}
                      className={`h-full ${cat.color} rounded-full`}
                    />
                  </div>
                  <div className="text-[10px] text-neutral-400 text-right">
                    {cat.amount.toLocaleString('vi-VN')} đ
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200 text-[11px] text-neutral-600">
              💡 <strong>Gợi ý:</strong> Lập trình và Thiết kế Slide đang là 2 mảng mang lại doanh thu cao nhất cho bạn.
            </div>
          </div>
        </div>

        {/* Section: Campus Market Insights & In-Demand Skills */}
        <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-[#222325]">
                  Xu Hướng Kỹ Năng Hot Tại Các Trường Đại Học
                </h3>
                <p className="text-xs text-[#62646a]">
                  Dữ liệu phân tích thời gian thực từ nhu cầu đăng Task tại Bách Khoa, Kinh Tế, Ngoại Thương.
                </p>
              </div>
            </div>

            <button
              onClick={onExploreTasks}
              className="px-4 py-2 bg-[#1dbf73] hover:bg-[#19a463] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Xem Task Đang Mở
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {highDemandSkills.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-neutral-50/70 border border-neutral-200 hover:border-emerald-500/80 transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#222325]">{item.skill}</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                    {item.demand}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-neutral-500 pt-1">
                  <span>Mức thù lao phổ biến: <strong className="text-neutral-700">{item.avgPrice}</strong></span>
                  <span className="text-emerald-600 font-bold">{item.growth} tuần qua</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between text-xs text-emerald-800 gap-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                <strong>0% Phí Nền Tảng:</strong> Toàn bộ 100% số tiền thù lao từ bên thuê được giải ngân nguyên vẹn cho sinh viên.
              </span>
            </div>
            <button
              onClick={onNavigateToWallet}
              className="font-bold underline text-emerald-900 shrink-0 cursor-pointer"
            >
              Quản lý Ví rút tiền →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
