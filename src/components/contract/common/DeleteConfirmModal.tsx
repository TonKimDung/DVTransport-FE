// components/common/DeleteConfirmModal.tsx

import { AlertTriangle, Loader2, X } from "lucide-react";

type Props = {
  open: boolean;
  title?: string;
  description?: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function DeleteConfirmModal({
  open,
  title = "Xác nhận xóa",
  description = "Bạn có chắc chắn muốn xóa dữ liệu này?",
  loading = false,
  onClose,
  onConfirm,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* HEADER */}
        <div className="relative px-6 pt-6 pb-4 border-b border-slate-100">

          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-xl hover:bg-slate-100 flex items-center justify-center transition"
          >
            <X size={18} />
          </button>

          <div className="flex flex-col items-center text-center">
            
            <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-4">
              <AlertTriangle size={30} />
            </div>

            <h2 className="text-2xl font-bold text-slate-900">
              {title}
            </h2>

            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-5 bg-slate-50 flex gap-3">
          
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 h-12 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-semibold transition disabled:opacity-50"
          >
            Hủy
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 h-12 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && (
              <Loader2
                size={18}
                className="animate-spin"
              />
            )}

            {loading
              ? "Đang xóa..."
              : "Xóa"}
          </button>
        </div>
      </div>
    </div>
  );
}