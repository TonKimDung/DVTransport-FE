import { Mail, Lock, Truck } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 px-4">
      <div className="w-full max-w-[560px] bg-white rounded-3xl shadow-sm px-10 py-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 rounded-2xl bg-orange-500 flex items-center justify-center mb-6">
            <Truck className="text-white" size={40} strokeWidth={2.5} />
          </div>

          <h1 className="text-4xl font-bold text-[#10294a]">
            DVTransport
          </h1>

          <p className="mt-3 text-lg text-gray-600">
            Hệ thống quản lý vận tải
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6">
          {/* Email */}
          <div>
            <label className="block mb-3 text-[#10294a] font-semibold">
              Email
            </label>

            <div className="relative">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={24}
              />

              <input
                type="email"
                placeholder="email@example.com"
                className="w-full h-[62px] pl-14 pr-4 border border-gray-300 rounded-xl text-lg outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block mb-3 text-[#10294a] font-semibold">
              Mật khẩu
            </label>

            <div className="relative">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={24}
              />

              <input
                type="password"
                placeholder="••••••••"
                className="w-full h-[62px] pl-14 pr-4 border border-gray-300 rounded-xl text-lg outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-3 text-gray-700 font-medium">
              <input
                type="checkbox"
                className="w-5 h-5 accent-orange-500"
              />
              Ghi nhớ đăng nhập
            </label>

            <button
              type="button"
              className="text-orange-600 hover:underline"
            >
              Quên mật khẩu?
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full h-[60px] bg-orange-500 hover:bg-orange-600 text-white text-lg font-bold rounded-xl transition"
          >
            Đăng nhập
          </button>
        </form>

        {/* Register */}
        <p className="text-center mt-9 text-lg text-gray-600">
          Chưa có tài khoản?{" "}
          <span className="text-orange-600 font-semibold cursor-pointer hover:underline">
            Đăng ký ngay
          </span>
        </p>
      </div>
    </div>
  );
}