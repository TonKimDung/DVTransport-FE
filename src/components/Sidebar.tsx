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

const ROLE = {
  ADMIN: "Admin",
  DIEU_PHOI_VIEN: "Điều phối viên",
  HR: "HR",
  LAI_XE: "Lái xe",
  KE_TOAN: "Kế toán",
};

const menuItems = [
  {
    label: "Dashboard",
    path: "/",
    icon: Home,
    roles: [ROLE.ADMIN, ROLE.DIEU_PHOI_VIEN, ROLE.HR, ROLE.LAI_XE, ROLE.KE_TOAN],
  },
  {
    label: "Tuyển dụng",
    path: "/admin/recruitment",
    icon: Users,
    roles: [ROLE.ADMIN, ROLE.HR],
  },
  {
    label: "Phương tiện",
    path: "/admin/vehicles",
    icon: Truck,
    roles: [ROLE.ADMIN, ROLE.DIEU_PHOI_VIEN],
  },
  {
    label: "Nhiên liệu",
    path: "/admin/fuels",
    icon: Fuel,
    roles: [ROLE.ADMIN, ROLE.DIEU_PHOI_VIEN, ROLE.LAI_XE, ROLE.KE_TOAN],
  },
  {
    label: "Phân công",
    path: "/admin/trips",
    icon: MapPin,
    roles: [ROLE.ADMIN, ROLE.DIEU_PHOI_VIEN],
  },
  {
    label: "Đơn vận chuyển",
    path: "/admin/orders",
    icon: ClipboardList,
    roles: [ROLE.ADMIN, ROLE.DIEU_PHOI_VIEN, ROLE.LAI_XE, ROLE.KE_TOAN],
  },
  {
    label: "Chi phí",
    path: "/admin/cost",
    icon: DollarSign,
    roles: [ROLE.ADMIN, ROLE.DIEU_PHOI_VIEN, ROLE.KE_TOAN],
  },
  {
    label: "An toàn & rủi ro",
    path: "/admin/incidents",
    icon: ShieldCheck,
    roles: [ROLE.ADMIN, ROLE.DIEU_PHOI_VIEN, ROLE.LAI_XE],
  },
  {
    label: "Chứng từ & pháp lý",
    path: "/admin/documents",
    icon: FileText,
    roles: [ROLE.ADMIN, ROLE.DIEU_PHOI_VIEN, ROLE.KE_TOAN],
  },
  {
    label: "Báo cáo và thống kê",
    path: "/admin/reports",
    icon: BarChart3,
    roles: [ROLE.ADMIN, ROLE.KE_TOAN],
  },
  {
    label: "Quản trị hệ thống",
    path: "/admin/system",
    icon: Settings,
    roles: [ROLE.ADMIN],
  },
];

function getCurrentUserRole() {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user.roleName || "";
  } catch {
    return "";
  }
}

export default function Sidebar() {
  const currentRole = getCurrentUserRole();

  const allowedMenuItems = menuItems.filter((item) =>
    item.roles.includes(currentRole)
  );

  return (
    <aside className="w-[260px] min-h-screen bg-white border-r border-slate-200 px-4 py-5">
      <nav className="space-y-2">
        {allowedMenuItems.map((item) => {
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