import React from 'react';
import { CATEGORIES } from '../data/mockData';

interface FooterProps {
  onNavigateToScreen?: (screen: any) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateToScreen }) => {
  return (
    <footer className="bg-white border-t border-neutral-200 pt-12 pb-8 text-xs text-[#62646a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          
          {/* Brand Col */}
          <div className="col-span-2 space-y-3">
            <a href="/" className="flex items-center gap-1.5 focus-visible:outline-none">
              <span className="text-2xl font-bold tracking-tight text-[#222325]">
                VIET<span className="text-[#1dbf73]">VI</span>
              </span>
              <span className="h-2 w-2 rounded-full bg-[#1dbf73]" aria-hidden="true" />
            </a>
            <p className="text-xs text-[#62646a] max-w-sm leading-relaxed">
              Nền tảng việc làm và kết nối Task hai phía linh hoạt, ưu tiên sinh viên Việt Nam. Biến nhu cầu thực tế thành cơ hội thu nhập minh bạch và an toàn.
            </p>
            <div className="text-[11px] text-neutral-400">
              Định hướng sản phẩm: MVP v0.1 · Phục vụ cộng đồng ĐHQG, ĐHBK, NEU, FTU và các trường toàn quốc.
            </div>
          </div>

          {/* Col 1: Categories */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-[#222325] text-xs uppercase tracking-wider">
              Danh mục Task
            </h4>
            <ul className="space-y-2">
              {CATEGORIES.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <a href="#market-tasks" className="hover:text-[#222325] transition-colors">
                    {cat.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 2: For Students */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-[#222325] text-xs uppercase tracking-wider">
              Dành cho Sinh viên
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigateToScreen?.('ORDER_MANAGEMENT')}
                  className="hover:text-emerald-600 transition-colors cursor-pointer text-left"
                >
                  Quản lý đơn hàng (ORDER-01)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToScreen?.('STUDENT_ANALYTICS')}
                  className="hover:text-emerald-600 transition-colors cursor-pointer text-left"
                >
                  Thống kê thu nhập (ANALYTICS-01)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToScreen?.('PUBLIC_PORTFOLIO')}
                  className="hover:text-emerald-600 transition-colors cursor-pointer text-left"
                >
                  Hồ sơ năng lực (PORTFOLIO-01)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToScreen?.('VERIFICATION_CENTER')}
                  className="hover:text-emerald-600 transition-colors cursor-pointer text-left"
                >
                  Huy hiệu xác minh SV
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Policy & Community */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-[#222325] text-xs uppercase tracking-wider">
              Quy định &amp; An toàn
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigateToScreen?.('INTEGRITY_POLICY')}
                  className="hover:text-amber-600 font-bold text-amber-700 transition-colors cursor-pointer text-left"
                >
                  Liêm chính học thuật (INTEGRITY-01)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToScreen?.('HELP_CENTER')}
                  className="hover:text-[#222325] transition-colors cursor-pointer text-left"
                >
                  Tiêu chuẩn cộng đồng
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToScreen?.('DISPUTES')}
                  className="hover:text-rose-600 transition-colors cursor-pointer text-left"
                >
                  Quy trình giải quyết tranh chấp
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToScreen?.('HELP_CENTER')}
                  className="hover:text-[#222325] transition-colors cursor-pointer text-left"
                >
                  Bảo mật thông tin sinh viên
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-400">
          <p>© 2026 VIETVI Marketplace. Tất cả các quyền được bảo lưu.</p>
          <div className="flex items-center gap-4">
            <span>Bảo chứng giao dịch sinh viên</span>
            <span aria-hidden="true">·</span>
            <span>Hỗ trợ: support@vietvi.vn</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
