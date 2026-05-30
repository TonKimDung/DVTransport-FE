import {
  X,
  FileText,
  CalendarDays,
  User,
  BadgeDollarSign,
  Building2,
  Truck,
  ShieldCheck,
} from "lucide-react";

type Props = {
  item: any;
  onClose: () => void;
};

export default function ContractDetailModal({
  item,
  onClose,
}: Props) {
  const getTypeLabel = () => {
    switch (item.contractType) {
      case "KH":
        return "Khách hàng";

      case "DT":
        return "Đối tác";

      case "TX":
        return "Tài xế";

      default:
        return item.contractType;
    }
  };

  const getOwnerName = () => {
    return (
      item.customerName ||
      item.partnerName ||
      item.driverName ||
      "---"
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      
      {/* MODAL */}
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden my-10">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 md:px-8 py-6 text-white relative">
          
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
          >
            <X size={20} />
          </button>

          <div className="flex flex-col md:flex-row md:items-center gap-5">
            
            <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <FileText size={38} />
            </div>

            <div className="min-w-0">
              <h2 className="text-2xl md:text-3xl font-bold break-words">
                Hợp đồng {getTypeLabel()}
              </h2>

              <p className="mt-2 text-orange-100 text-sm md:text-base break-all">
                #{item.contractNumber || "---"}
              </p>

              <div className="mt-4">
                <span className="px-4 py-1.5 rounded-full bg-white text-orange-600 text-sm font-bold inline-block">
                  {item.status || "---"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="p-5 md:p-8 overflow-y-auto max-h-[70vh]">

          {/* GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {/* LEFT */}
            <div className="space-y-5">

              {/* OWNER */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                    <User size={20} />
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      Người liên quan
                    </p>

                    <h3 className="font-bold text-slate-900 text-lg break-words">
                      {getOwnerName()}
                    </h3>
                  </div>
                </div>

                <div className="space-y-3 text-sm text-slate-600">
                  <div className="flex justify-between gap-3">
                    <span>Loại hợp đồng</span>

                    <span className="font-semibold text-slate-900">
                      {getTypeLabel()}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span>Trạng thái</span>

                    <span className="font-semibold text-orange-600">
                      {item.status || "---"}
                    </span>
                  </div>
                </div>
              </div>

              {/* DATE */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                    <CalendarDays size={20} />
                  </div>

                  <h3 className="font-bold text-slate-900 text-lg">
                    Thời gian hợp đồng
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between gap-3 text-sm">
                    <span className="text-slate-500">
                      Ngày bắt đầu
                    </span>

                    <span className="font-semibold text-slate-900">
                      {item.startDate || "---"}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3 text-sm">
                    <span className="text-slate-500">
                      Ngày kết thúc
                    </span>

                    <span className="font-semibold text-slate-900">
                      {item.endDate || "---"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="space-y-5">

              {/* VALUE */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <BadgeDollarSign size={20} />
                  </div>

                  <h3 className="font-bold text-slate-900 text-lg">
                    Thông tin tài chính
                  </h3>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500">
                      Giá trị hợp đồng
                    </span>

                    <span className="font-bold text-emerald-600 break-words text-right">
                      {item.totalValue
                        ? Number(
                            item.totalValue
                          ).toLocaleString(
                            "vi-VN"
                          ) + " VNĐ"
                        : "---"}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500">
                      Lương cơ bản
                    </span>

                    <span className="font-semibold text-slate-900 break-words text-right">
                      {item.baseSalary
                        ? Number(
                            item.baseSalary
                          ).toLocaleString(
                            "vi-VN"
                          ) + " VNĐ"
                        : "---"}
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

                  {item.customerName && (
                    <div className="flex items-start gap-3">
                      <Building2
                        size={18}
                        className="mt-0.5 shrink-0"
                      />

                      <div className="min-w-0">
                        <p className="text-slate-500">
                          Khách hàng
                        </p>

                        <p className="font-semibold text-slate-900 break-words">
                          {item.customerName}
                        </p>
                      </div>
                    </div>
                  )}

                  {item.partnerName && (
                    <div className="flex items-start gap-3">
                      <Building2
                        size={18}
                        className="mt-0.5 shrink-0"
                      />

                      <div className="min-w-0">
                        <p className="text-slate-500">
                          Đối tác
                        </p>

                        <p className="font-semibold text-slate-900 break-words">
                          {item.partnerName}
                        </p>
                      </div>
                    </div>
                  )}

                  {item.driverName && (
                    <div className="flex items-start gap-3">
                      <Truck
                        size={18}
                        className="mt-0.5 shrink-0"
                      />

                      <div className="min-w-0">
                        <p className="text-slate-500">
                          Tài xế
                        </p>

                        <p className="font-semibold text-slate-900 break-words">
                          {item.driverName}
                        </p>
                      </div>
                    </div>
                  )}
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