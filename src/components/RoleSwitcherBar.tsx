import React from 'react';
import { Shield, User, Eye, ArrowRightLeft, Headphones } from 'lucide-react';
import { UserMode, UserRole } from '../types';

export type { UserRole };

interface RoleSwitcherBarProps {
  currentRole: UserRole;
  userMode: UserMode;
  onSelectRole: (role: UserRole) => void;
  onToggleUserMode: () => void;
}

export const RoleSwitcherBar: React.FC<RoleSwitcherBarProps> = ({
  currentRole,
  userMode,
  onSelectRole,
  onToggleUserMode,
}) => {
  return (
    <aside aria-label="Bộ chọn vai trò" className="bg-[#18181b] text-neutral-300 border-b border-neutral-800 text-xs px-4 py-2">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <span className="font-bold uppercase tracking-wider text-[11px] text-neutral-400">
            Chuyển đổi Vai trò (Role Simulation):
          </span>
        </div>

        <nav aria-label="Vai trò hệ thống" className="flex items-center gap-2">
          {/* Guest Role */}
          <button
            onClick={() => onSelectRole('GUEST')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              currentRole === 'GUEST'
                ? 'bg-amber-500 text-neutral-950 font-bold shadow-xs'
                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>1. Khách (Guest)</span>
          </button>

          {/* User / Student Role */}
          <button
            onClick={() => onSelectRole('USER')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              currentRole === 'USER'
                ? 'bg-emerald-500 text-neutral-950 font-bold shadow-xs'
                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>2. Sinh viên / User</span>
            {currentRole === 'USER' && (
              <span className="text-[10px] px-1 rounded bg-emerald-950 text-emerald-200">
                {userMode === 'REQUESTER' ? 'Người yêu cầu' : 'Người thực hiện'}
              </span>
            )}
          </button>

          {/* Staff Role */}
          <button
            onClick={() => onSelectRole('STAFF')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              currentRole === 'STAFF'
                ? 'bg-indigo-600 text-white font-bold shadow-xs'
                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
            }`}
          >
            <Headphones className="w-3.5 h-3.5" />
            <span>3. Nhân viên (Staff)</span>
            <span className="text-[10px] px-1 rounded bg-indigo-950 text-indigo-200">
              Vận hành &amp; CSKH
            </span>
          </button>

          {/* Admin Role */}
          <button
            onClick={() => onSelectRole('ADMIN')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              currentRole === 'ADMIN'
                ? 'bg-purple-500 text-white font-bold shadow-xs'
                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>4. Quản trị viên (Admin)</span>
          </button>

          {/* Capability toggle when in USER role */}
          {currentRole === 'USER' && (
            <div className="ml-2 pl-2 border-l border-neutral-700 flex items-center gap-1.5">
              <span className="text-[10px] text-neutral-400 hidden lg:inline">Chế độ:</span>
              <button
                onClick={() => {
                  if (userMode !== 'REQUESTER') onToggleUserMode();
                }}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  userMode === 'REQUESTER'
                    ? 'bg-indigo-600 text-white shadow-xs ring-1 ring-indigo-400'
                    : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700'
                }`}
                title="Chế độ Người yêu cầu: Đăng Task, duyệt báo giá ứng viên, giải ngân thù lao"
              >
                {userMode === 'REQUESTER' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )}
                <span>Bên yêu cầu (Thuê)</span>
              </button>

              <button
                onClick={() => {
                  if (userMode !== 'TASKER') onToggleUserMode();
                }}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  userMode === 'TASKER'
                    ? 'bg-emerald-600 text-white shadow-xs ring-1 ring-emerald-400'
                    : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700'
                }`}
                title="Chế độ Người thực hiện: Tìm việc, gửi báo giá, nộp sản phẩm, nhận tiền"
              >
                {userMode === 'TASKER' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )}
                <span>Bên thực hiện (Làm việc)</span>
              </button>
            </div>
          )}
        </nav>
      </div>
    </aside>
  );
};
