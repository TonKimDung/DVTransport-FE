import { NavLink, Outlet } from "react-router";
import {
  Truck,
  Users,
  Fuel,
  MapPin,
  FileText,
  ShieldAlert,
  ScrollText,
  BarChart3,
  Bell,
} from "lucide-react";

const menuItems = [
  { path: "/recruitment", label: "Tuyển dụng", icon: Users },
  { path: "/vehicles", label: "Phương tiện", icon: Truck },
  { path: "/fuel", label: "Nhiên liệu", icon: Fuel },
  { path: "/trips", label: "Quản lý chuyến xe", icon: MapPin },
  { path: "/orders", label: "Đơn vận chuyển", icon: FileText },
  { path: "/risks", label: "An toàn & rủi ro", icon: ShieldAlert },
  { path: "/documents", label: "Chứng từ & pháp lý", icon: ScrollText },
  { path: "/reports", label: "Báo cáo và thống kê", icon: BarChart3 },
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex bg-[#f8fafc] text-slate-900">
      {/* SIDEBAR */}
      <aside className="w-[290px] bg-white border-r border-slate-200">
        <div className="h-[90px] flex items-center gap-3 px-8 border-b border-slate-200">
          <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-white">
            <Truck size={28} />
          </div>
          <h1 className="text-2xl font-bold text-orange-600">DVTransport</h1>
        </div>

        <nav className="p-5 space-y-3">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-5 py-4 rounded-xl text-[17px] font-semibold transition
                  ${
                    isActive
                      ? "bg-orange-50 text-orange-600 border border-orange-300"
                      : "text-slate-700 hover:bg-slate-100"
                  }`
                }
              >
                <Icon size={24} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <header className="h-[90px] bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <div>
            <h2 className="text-3xl font-bold">Phương tiện</h2>
            <p className="text-slate-500 mt-1">
              Quản lý đội xe và theo dõi phương tiện
            </p>
          </div>

          <div className="flex items-center gap-7">
            <div className="relative">
              <Bell size={26} className="text-slate-700" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full" />
            </div>

            <div className="w-px h-10 bg-slate-200" />

            <div className="text-right">
              <p className="font-semibold text-slate-900">Nguyễn Thị Vân</p>
              <p className="text-slate-500 text-sm">Admin</p>
            </div>

            <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
              KN
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}