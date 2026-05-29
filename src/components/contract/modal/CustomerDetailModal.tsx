import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Receipt,
  ShieldCheck,
  Building2,
} from "lucide-react";

type Props = {
  item: any;
  onClose: () => void;
};

export default function CustomerDetailModal({
  item,
  onClose,
}: Props) {

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">

      {/* MODAL */}
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden my-10">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-600 px-6 md:px-8 py-6 text-white relative">

          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
          >
            <X size={20} />
          </button>

          <div className="flex flex-col md:flex-row md:items-center gap-5">

            <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <User size={38} />
            </div>

            <div className="min-w-0">

              <h2 className="text-2xl md:text-3xl font-bold break-words">
                Chi tiết khách hàng
              </h2>

              <p className="text-sm md:text-base break-all">
                Name: {item.name || "---"}
              </p>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="p-5 md:p-8 overflow-y-auto max-h-[70vh]">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {/* LEFT */}
            <div className="space-y-5">

              {/* BASIC */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">

                <div className="flex items-center gap-3 mb-4">

                  <div className="w-11 h-11 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                    <Building2 size={20} />
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      Khách hàng
                    </p>

                    <h3 className="font-bold text-slate-900 text-lg break-words">
                      {item.name || "---"}
                    </h3>
                  </div>
                </div>

                <div className="space-y-3 text-sm text-slate-600">

                  <div className="flex justify-between gap-3">
                    <span>Loại</span>

                    <span className="font-semibold text-slate-900">
                      Customer
                    </span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span>ID</span>

                    <span className="font-semibold text-orange-600">
                      #{item.id || "---"}
                    </span>
                  </div>
                </div>
              </div>

              {/* CONTACT */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">

                <div className="flex items-center gap-3 mb-4">

                  <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                    <Phone size={20} />
                  </div>

                  <h3 className="font-bold text-slate-900 text-lg">
                    Thông tin liên hệ
                  </h3>
                </div>

                <div className="space-y-4 text-sm gap-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* PHONE */}
                    <div className="flex items-start gap-3">
                        <Phone
                        size={18}
                        className="text-slate-400 mt-0.5 shrink-0"
                        />

                        <div className="min-w-0">
                        <p className="text-slate-500">
                            Số điện thoại
                        </p>

                        <p className="font-semibold text-slate-900 break-words">
                            {item.phone || "---"}
                        </p>
                        </div>
                    </div>

                    {/* EMAIL */}
                    <div className="flex items-start gap-3">
                        <Mail
                        size={18}
                        className="text-slate-400 mt-0.5 shrink-0"
                        />

                        <div className="min-w-0">
                        <p className="text-slate-500">
                            Email
                        </p>

                        <p className="font-semibold text-slate-900 break-all">
                            {item.email || "---"}
                        </p>
                        </div>
                    </div>

                    </div>

                  

                  <div className="flex items-start gap-3">
                    <MapPin
                      size={18}
                      className="text-slate-400 mt-0.5"
                    />

                    <div>
                      <p className="text-slate-500">
                        Địa chỉ
                      </p>

                      <p className="font-semibold text-slate-900 break-words">
                        {item.address || "---"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="space-y-5">

              {/* TAX */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">

                <div className="flex items-center gap-3 mb-4">

                  <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                    <Receipt size={20} />
                  </div>

                  <h3 className="font-bold text-slate-900 text-lg">
                    Thông tin doanh nghiệp
                  </h3>
                </div>

                <div className="space-y-4 text-sm">

                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500">
                      Mã số thuế
                    </span>

                    <span className="font-semibold text-slate-900 break-all text-right">
                      {item.taxCode || "---"}
                    </span>
                  </div>
                </div>
              </div>

              {/* EXTRA */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">

                <div className="flex items-center gap-3 mb-5">

                  <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                    <ShieldCheck size={20} />
                  </div>

                  <h3 className="font-bold text-slate-900 text-lg">
                    Thông tin thêm
                  </h3>
                </div>

                <div className="space-y-4 text-sm text-slate-600">

                  <div className="flex justify-between">
                    <span>Trạng thái</span>

                    <span className="font-semibold text-emerald-600">
                      ACTIVE
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Hệ thống</span>

                    <span className="font-semibold text-slate-900">
                      Customer Management
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-5 md:px-8 py-4 border-t bg-slate-50 flex justify-end sticky bottom-0">

          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}