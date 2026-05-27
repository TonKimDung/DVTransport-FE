import { NavLink } from "react-router-dom";
import {
  BarChart3,
  ClipboardList,
  FileText,
  Fuel,
  Home,
  ShieldCheck,
  Truck,
  Users,
  MapPin,
  DollarSign,
  Settings,
} from "lucide-react";

const menuItems = [
  {
    label: "Dashboard",
    path: "/",
    icon: Home,
  },
  {
    label: "Tuyển dụng",
    path: "/admin/recruitment",
    icon: Users,
  },
  {
    label: "Phương tiện",
    path: "/admin/vehicles",
    icon: Truck,
  },
  {
    label: "Nhiên liệu",
    path: "/admin/fuels",
    icon: Fuel,
  },
  {
    label: "Phân công",
    path: "/admin/trips",
    icon: MapPin,
  },
  {
    label: "Đơn vận chuyển",
    path: "/admin/orders",
    icon: ClipboardList,
  },

  {
    label: "Chi phí",
    path: "/admin/cost",
    icon: DollarSign,
  },
  {
    label: "An toàn & rủi ro",
    path: "/admin/incidents",
    icon: ShieldCheck,
  },
  {
    label: "Chứng từ & pháp lý",
    path: "/admin/documents",
    icon: FileText,
  },
  {
    label: "Báo cáo và thống kê",
    path: "/admin/reports",
    icon: BarChart3,
  },
  {
  label: "Quản trị hệ thống",
  path: "/admin/system",
  icon: Settings,
}
];

export default function Sidebar() {
  return (
    <aside className="w-[260px] min-h-screen bg-white border-r border-slate-200 px-4 py-5">
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-[15px] font-semibold transition
                ${
                  isActive
                    ? "bg-orange-50 text-orange-600 border border-orange-200"
                    : "text-slate-700 hover:bg-slate-50 hover:text-orange-600"
                }`
              }
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}