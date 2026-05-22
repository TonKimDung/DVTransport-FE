import { useState } from "react";
import { X } from "lucide-react";

import { recruitmentService } from "../../services/recruitmentService";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateCampaignModal({
  open,
  onClose,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "ACTIVE",
  });

  if (!open) return null;

  const handleSubmit = async () => {
    try {
      setLoading(true);

      await recruitmentService.createCampaign(form);

      alert("Tạo đợt tuyển dụng thành công");

      onSuccess();
      onClose();

      setForm({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        status: "ACTIVE",
      });
    } catch (e) {
      console.error(e);
      alert("Tạo đợt tuyển dụng thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-[32px] w-[700px] p-8 relative">

        <button
          onClick={onClose}
          className="absolute right-6 top-6"
        >
          <X />
        </button>

        <h2 className="text-[32px] font-bold mb-8">
          Tạo đợt tuyển dụng
        </h2>

        <div className="space-y-5">

          <Input
            label="Tên đợt tuyển dụng"
            value={form.title}
            onChange={(v: any) =>
              setForm({ ...form, title: v })
            }
          />

          <TextArea
            label="Mô tả"
            value={form.description}
            onChange={(v: any) =>
              setForm({
                ...form,
                description: v,
              })
            }
          />

          <div className="grid grid-cols-2 gap-5">

            <Input
              label="Ngày bắt đầu"
              type="date"
              value={form.startDate}
              onChange={(v: any) =>
                setForm({
                  ...form,
                  startDate: v,
                })
              }
            />

            <Input
              label="Ngày kết thúc"
              type="date"
              value={form.endDate}
              onChange={(v: any) =>
                setForm({
                  ...form,
                  endDate: v,
                })
              }
            />
          </div>

          <select
            value={form.status}
            onChange={(e) =>
              setForm({
                ...form,
                status: e.target.value,
              })
            }
            className="w-full border rounded-2xl p-4"
          >
            <option value="ACTIVE">
              ACTIVE
            </option>

            <option value="INACTIVE">
              INACTIVE
            </option>
          </select>
        </div>

        <button
          disabled={loading}
          onClick={handleSubmit}
          className="mt-8 w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-bold"
        >
          {loading
            ? "Đang tạo..."
            : "Tạo đợt tuyển dụng"}
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
      <p className="font-medium mb-2">
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

function TextArea({
  label,
  value,
  onChange,
}: any) {
  return (
    <div>
      <p className="font-medium mb-2">
        {label}
      </p>

      <textarea
        rows={4}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full border rounded-2xl p-4 resize-none"
      />
    </div>
  );
}