import { useState } from "react";
import { Bell, LogOut, Settings, Truck, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

type HeaderProps = {
  title?: string;
  subtitle?: string;
};

export default function Header({
  title,
  subtitle,
}: HeaderProps) {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(-2)
      .toUpperCase();
  };

  return (
    <header className="h-[88px] bg-white border-b border-slate-200 flex items-center">
      {/* Logo cố định */}
      <div className="w-[260px] h-full border-r border-slate-200 flex items-center px-6 gap-3">
        <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white">
          <Truck size={22} />
        </div>

        <span className="text-xl font-bold text-orange-600">
          DVTransport
        </span>
      </div>

      {/* Phần thay đổi theo trang */}
      <div className="flex-1 h-full flex items-center justify-between px-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          <p className="text-sm text-slate-500">{subtitle}</p>
        </div>

        <div className="flex items-center gap-5">
          <button className="relative text-slate-600 hover:text-orange-600">
            <Bell size={22} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-600 rounded-full"></span>
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setOpenMenu(!openMenu)}
                className="flex items-center gap-3"
              >
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">
                    {user.fullName}
                  </p>
                  <p className="text-sm text-slate-500">
                    {user.roleName || "Admin"}
                  </p>
                </div>

                <div className="w-10 h-10 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold">
                  {getInitials(user.fullName)}
                </div>
              </button>

              {openMenu && (
                <div className="absolute right-0 top-14 w-56 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50">
                  <button
                    onClick={() => navigate("/admin/profile")}
                    className="w-full px-4 py-3 text-left text-sm hover:bg-slate-50 flex items-center gap-3"
                  >
                    <User size={17} />
                    Thông tin cá nhân
                  </button>

                  <button
                    onClick={() => navigate("/admin/settings")}
                    className="w-full px-4 py-3 text-left text-sm hover:bg-slate-50 flex items-center gap-3"
                  >
                    <Settings size={17} />
                    Cài đặt
                  </button>

                  <hr className="my-1" />

                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
                  >
                    <LogOut size={17} />
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-semibold"
            >
              Đăng nhập
            </button>
          )}
        </div>
      </div>
    </header>
  );
}