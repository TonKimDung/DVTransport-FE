import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const pageConfig: Record<
  string,
  { title: string; subtitle: string }
> = {
  "/admin/dashboard": {
    title: "Dashboard",
    subtitle: "Tổng quan và thống kê hoạt động hệ thống",
  },

  "/admin/vehicles": {
    title: "Phương tiện",
    subtitle: "Quản lý danh sách phương tiện vận chuyển",
  },

  "/admin/orders": {
    title: "Đơn vận chuyển",
    subtitle: "Quản lý đơn hàng vận chuyển",
  },

  "/admin/trips": {
    title: "Phân công",
    subtitle: "Theo dõi và điều phối chuyến xe",
  },

  "/admin/fuels": {
    title: "Nhiên liệu",
    subtitle: "Theo dõi chi phí nhiên liệu",
  },

  "/admin/incidents": {
    title: "An toàn & rủi ro",
    subtitle: "Quản lý sự cố và rủi ro vận hành",
  },

  "/admin/documents": {
    title: "Chứng từ & pháp lý",
    subtitle: "Quản lý hồ sơ và giấy tờ pháp lý",
  },

  "/admin/reports": {
    title: "Báo cáo & thống kê",
    subtitle: "Theo dõi số liệu và hiệu suất hệ thống",
  },

  "/admin/recruitment": {
    title: "Tuyển dụng",
    subtitle: "Quản lý chiến dịch tuyển dụng",
  },

  "/admin/system": {
  title: "Quản trị hệ thống",
  subtitle: "Quản lý tài khoản, vai trò và nhật ký hệ thống",
},

"/admin/cost": {
  title: "Chi phí",
  subtitle: "Quản lý chi phí, tiền lương",
},
};

export default function AdminLayout() {
  const location = useLocation();

  const currentPage =
    pageConfig[location.pathname] || {
      title: "DVTransport",
      subtitle: "Hệ thống quản lý vận tải",
    };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        title={currentPage.title}
        subtitle={currentPage.subtitle}
      />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}