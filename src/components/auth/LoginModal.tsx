import { useState } from "react";
import { Mail, Lock, Truck, X } from "lucide-react";
import { authService } from "../../services/authService";

export default function LoginModal({
  onClose,
  onLoginSuccess,
}: {
  onClose: () => void;
  onLoginSuccess: () => void;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await authService.login({ username, password });

        localStorage.setItem("token", res.token);

        localStorage.setItem(
        "user",
        JSON.stringify({
            id: res.userId,
            username: res.username,
            fullName: res.fullName,
            email: res.email,
            roleName: res.roleName,
        })
        );

        onLoginSuccess();
        onClose();
    } catch (error) {
      console.error(error);
      alert("Đăng nhập thất bại");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <div className="w-full max-w-[560px] bg-white rounded-3xl shadow-lg px-10 py-10 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-black"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 rounded-2xl bg-orange-500 flex items-center justify-center mb-6">
            <Truck className="text-white" size={40} />
          </div>

          <h1 className="text-3xl font-bold text-[#10294a]">DVTransport</h1>
          <p className="mt-2 text-gray-600">Hệ thống quản lý vận tải</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block mb-2 text-[#10294a] font-semibold">
              Tên đăng nhập
            </label>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Nhập tên đăng nhập"
                className="w-full h-[56px] pl-12 pr-4 border border-gray-300 rounded-xl outline-none focus:border-orange-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-[#10294a] font-semibold">
              Mật khẩu
            </label>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full h-[56px] pl-12 pr-4 border border-gray-300 rounded-xl outline-none focus:border-orange-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-[56px] bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl"
          >
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
}