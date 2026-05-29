import { FileText, X } from "lucide-react";
import { useEffect, useState } from "react";

import { contractService } from "../../../services/contractService";
import { driverService } from "../../../services/driverService";
import Input from "../common/InputField";

type Props = {
  customers: any[];
  partners: any[];
  onClose: () => void;
  onCreated?: () => void;
};

function Select({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: any;
  onChange: (v: any) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-slate-700">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-11 rounded-xl border border-slate-300 px-4 text-sm outline-none focus:ring-2 focus:ring-orange-200"
      >
        {children}
      </select>
    </div>
  );
}

export default function CreateContractModal({
  customers,
  partners,
  onClose,
  onCreated,
}: Props) {
  const [drivers, setDrivers] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    contractNumber: "",
    contractType: "KH",

    customerId: "",
    partnerId: "",

    driverId: "",

    startDate: "",
    endDate: "",

    totalValue: "",
    baseSalary: "",

    status: "ACTIVE",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [driverData] =
        await Promise.all([
          driverService.getAvailableContract()
        ]);

      setDrivers(driverData || []);

    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      await contractService.create({
        contractNumber: form.contractNumber,
        contractType: form.contractType,

        customerId:
          form.contractType === "KH"
            ? Number(form.customerId)
            : undefined,

        partnerId:
          form.contractType === "DT"
            ? Number(form.partnerId)
            : undefined,

        driverId:
          form.contractType === "TX"
            ? Number(form.driverId)
            :undefined,

        startDate: form.startDate,
        endDate: form.endDate,

        totalValue: form.totalValue
          ? Number(form.totalValue)
          : null,

        status: form.status,
      });

      alert("Tạo hợp đồng thành công");

      onCreated?.();
      onClose();

    } catch (err) {
      console.error(err);

      alert("Tạo hợp đồng thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-5">
      
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex items-start justify-between gap-4 p-5">
            {/* LEFT */}
            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                <FileText size={22} />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Tạo hợp đồng
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Nhập thông tin để tạo hợp đồng mới
                </p>
              </div>
            </div>

            {/* CLOSE BUTTON */}
            <button
              onClick={onClose}
              className="w-11 h-11 rounded-xl hover:bg-slate-100 flex items-center justify-center transition shrink-0"
            >
              <X size={20} />
            </button>
        </div>

        {/* BODY */}
        <div className="p-7 grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* CONTRACT NUMBER */}
          <Input
            label="Mã hợp đồng"
            value={form.contractNumber}
            onChange={(v: string) =>
              setForm({
                ...form,
                contractNumber: v,
              })
            }
          />

          {/* CONTRACT TYPE */}
          <Select
            label="Loại hợp đồng"
            value={form.contractType}
            onChange={(v) =>
              setForm({
                ...form,
                contractType: v,

                customerId: "",
                partnerId: "",
                driverId: "",
              })
            }
          >
            <option value="KH">
              KH - Khách hàng
            </option>

            <option value="DT">
              DT - Đối tác
            </option>

            <option value="TX">
              TX - Tài xế
            </option>
          </Select>

          {/* CUSTOMER */}
          {form.contractType === "KH" && (
            <Select
              label="Khách hàng"
              value={form.customerId}
              onChange={(v) =>
                setForm({
                  ...form,
                  customerId: v,
                })
              }
            >
              <option value="">
                Chọn khách hàng
              </option>

              {customers.map((c) => (
                <option
                  key={c.id}
                  value={c.id}
                >
                  {c.name}
                </option>
              ))}
            </Select>
          )}

          {/* PARTNER */}
          {form.contractType === "DT" && (
            <Select
              label="Đối tác"
              value={form.partnerId}
              onChange={(v) =>
                setForm({
                  ...form,
                  partnerId: v,
                })
              }
            >
              <option value="">
                Chọn đối tác
              </option>

              {partners.map((p) => (
                <option
                  key={p.id}
                  value={p.id}
                >
                  {p.name}
                </option>
              ))}
            </Select>
          )}

          {/* DRIVER */}
          {form.contractType === "TX" && (
            <>
              <Select
                label="Tài xế"
                value={form.driverId}
                onChange={(v) =>
                  setForm({
                    ...form,
                    driverId: v,
                  })
                }
              >
                <option value="">
                  Chọn tài xế
                </option>

                {drivers.map((d) => (
                  <option
                    key={d.id}
                    value={d.id}
                  >
                    {d.fullName}
                  </option>
                ))}
              </Select>
            </>
          )}

          {/* START DATE */}
          <Input
            type="date"
            label="Ngày bắt đầu"
            value={form.startDate}
            onChange={(v: string) =>
              setForm({
                ...form,
                startDate: v,
              })
            }
          />

          {/* END DATE */}
          <Input
            type="date"
            label="Ngày kết thúc"
            value={form.endDate}
            onChange={(v: string) =>
              setForm({
                ...form,
                endDate: v,
              })
            }
          />

          {/* TOTAL VALUE */}
          <Input
            type="number"
            label="Giá trị hợp đồng"
            value={form.totalValue}
            onChange={(v: string) =>
              setForm({
                ...form,
                totalValue: v,
              })
            }
          />

          {/* STATUS */}
          <Select
            label="Trạng thái"
            value={form.status}
            onChange={(v) =>
              setForm({
                ...form,
                status: v,
              })
            }
          >
            <option value="ACTIVE">
              ACTIVE
            </option>

            <option value="EXPIRED">
              EXPIRED
            </option>
          </Select>
        </div>

        {/* FOOTER */}
        <div className="px-7 py-5 border-t border-slate-200 flex justify-end gap-3 bg-slate-50">
          
          <button
            onClick={onClose}
            className="px-5 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition"
          >
            Hủy
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-semibold transition"
          >
            {loading
              ? "Đang tạo..."
              : "Tạo hợp đồng"}
          </button>
        </div>
      </div>
    </div>
  );
}