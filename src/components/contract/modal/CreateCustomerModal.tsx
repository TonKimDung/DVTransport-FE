import { useState } from "react";
import { X, UserPlus } from "lucide-react";

import Input from "../common/InputField";

type Props = {
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
};

export default function CreateCustomerModal({
  onClose,
  onSubmit,
}: Props) {

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    taxCode: "",
  });

  const handleSubmit = async () => {

    try {

      setLoading(true);

      await onSubmit(form);

      alert(
        "Tạo khách hàng thành công"
      );

      onClose();

    } catch (err) {

      console.error(err);

      alert(
        "Tạo khách hàng thất bại"
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">

      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* HEADER */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <UserPlus size={22} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Tạo khách hàng
              </h2>

              <p className="text-sm text-slate-500">
                Nhập thông tin khách hàng mới
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center"
          >
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">

          <Input
            label="Tên khách hàng"
            value={form.name}
            onChange={(v: string) =>
              setForm({
                ...form,
                name: v,
              })
            }
          />

          <Input
            label="Số điện thoại"
            value={form.phone}
            onChange={(v: string) =>
              setForm({
                ...form,
                phone: v,
              })
            }
          />

          <Input
            label="Email"
            value={form.email}
            onChange={(v: string) =>
              setForm({
                ...form,
                email: v,
              })
            }
          />

          <Input
            label="Mã số thuế"
            value={form.taxCode}
            onChange={(v: string) =>
              setForm({
                ...form,
                taxCode: v,
              })
            }
          />

          <div className="md:col-span-2">
            <Input
              label="Địa chỉ"
              value={form.address}
              onChange={(v: string) =>
                setForm({
                  ...form,
                  address: v,
                })
              }
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-5 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="px-5 py-3 rounded-xl border border-slate-300 font-semibold hover:bg-slate-100"
          >
            Hủy
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold disabled:opacity-50"
          >
            {loading
              ? "Đang tạo..."
              : "Tạo khách hàng"}
          </button>
        </div>
      </div>
    </div>
  );
}