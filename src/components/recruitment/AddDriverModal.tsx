import { useState } from "react";
import { X } from "lucide-react";

import { driverService } from "../../services/driverService";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddDriverModal({
  open,
  onClose,
  onSuccess,
}: Props) {
  const [loading, setLoading] =
    useState(false);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    licenseNumber: "",
    licenseExpiry: "",
  });

  if (!open) return null;

  const submit = async () => {
    try {
      setLoading(true);

      await driverService.create(form);

      alert("Thêm tài xế thành công");

      onSuccess();
      onClose();
    } catch (e) {
      console.error(e);
      alert("Không thể thêm tài xế");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[700px] rounded-[32px] p-8 relative">

        <button
          onClick={onClose}
          className="absolute top-6 right-6"
        >
          <X />
        </button>

        <h2 className="text-[32px] font-bold mb-8">
          Thêm tài xế
        </h2>

        <div className="space-y-4">

          <Input
            label="Họ tên"
            value={form.fullName}
            onChange={(v: string) =>
              setForm({
                ...form,
                fullName: v,
              })
            }
          />

          <div className="grid grid-cols-2 gap-4">
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
          </div>

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

          <div className="grid grid-cols-2 gap-4">

            <Input
              label="Số GPLX"
              value={form.licenseNumber}
              onChange={(v: string) =>
                setForm({
                  ...form,
                  licenseNumber: v,
                })
              }
            />

            <Input
              type="date"
              label="Ngày hết hạn"
              value={form.licenseExpiry}
              onChange={(v: string) =>
                setForm({
                  ...form,
                  licenseExpiry: v,
                })
              }
            />
          </div>
        </div>

        <button
          disabled={loading}
          onClick={submit}
          className="w-full mt-8 bg-orange-500 text-white py-4 rounded-2xl font-bold"
        >
          {loading
            ? "Đang thêm..."
            : "Thêm tài xế"}
        </button>
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}: any) {
  return (
    <div>
      <p className="mb-2 font-medium">
        {label}
      </p>

      <input
        type={type}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full border rounded-2xl p-4"
      />
    </div>
  );
}