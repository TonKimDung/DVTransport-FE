import { Mail, Lock, Truck, X } from "lucide-react";

export default function LoginModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <div className="w-full max-w-[560px] bg-white rounded-3xl shadow-lg px-10 py-10 relative">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-black"
        >
          <X size={24} />
        </button>

        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 rounded-2xl bg-orange-500 flex items-center justify-center mb-6">
            <Truck className="text-white" size={40} strokeWidth={2.5} />
          </div>

          <h1 className="text-3xl font-bold text-[#10294a]">
            DVTransport
          </h1>

          <p className="mt-2 text-gray-600">
            Hệ thống quản lý vận tải
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6">
          <div>
            <label className="block mb-2 text-[#10294a] font-semibold">
              Email
            </label>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
              <input
                type="email"
                placeholder="email@example.com"
                className="w-full h-[56px] pl-12 pr-4 border border-gray-300 rounded-xl outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-[#10294a] font-semibold">
              Mật khẩu
            </label>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full h-[56px] pl-12 pr-4 border border-gray-300 rounded-xl outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-600">
              <input type="checkbox" className="accent-orange-500" />
              Ghi nhớ
            </label>

            <button type="button" className="text-orange-600 hover:underline">
              Quên mật khẩu?
            </button>
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