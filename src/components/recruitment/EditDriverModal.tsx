import { useEffect, useState } from "react";
import type {
  Driver,
  UpdateDriverRequest,
} from "../../types/driver";
import { driverService } from "../../services/driverService";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  driver?: Driver | null;
}

export default function EditDriverModal({
  open,
  onClose,
  onSuccess,
  driver,
}: Props) {
  const [loading,
    setLoading] =
    useState(false);

  const [form,
    setForm] =
    useState<UpdateDriverRequest>(
      {
        fullName: "",
        phone: "",
        email: "",
        address: "",
        licenseExpiry: "",
        status: "ACTIVE",
      }
    );

  useEffect(() => {
    if (driver) {
      setForm({
        fullName:
          driver.fullName,
        phone:
          driver.phone,
        email:
          driver.email,
        address:
          driver.address,
        licenseExpiry:
          driver.licenseExpiry?.slice(
            0,
            10
          ),
        status:
          driver.status,
      });
    }
  }, [driver]);

  if (!open)
    return null;

  const handleSubmit =
    async () => {
      if (!driver)
        return;

      try {
        setLoading(true);

        await driverService.update(
          driver.id,
          form
        );

        alert(
          "Cập nhật tài xế thành công"
        );

        onSuccess();
        onClose();
      } catch (error) {
        console.error(
          error
        );

        alert(
          "Không thể cập nhật tài xế"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">

      <div className="bg-white w-[700px] rounded-[32px] p-10">

        <h2 className="text-[32px] font-bold mb-8">
          Chỉnh sửa tài xế
        </h2>

        <div className="grid grid-cols-2 gap-5">

          <Input
            label="Họ tên"
            value={
              form.fullName
            }
            onChange={(
              v
            ) =>
              setForm({
                ...form,
                fullName:
                  v,
              })
            }
          />

          <Input
            label="Số điện thoại"
            value={
              form.phone
            }
            onChange={(
              v
            ) =>
              setForm({
                ...form,
                phone: v,
              })
            }
          />

          <Input
            label="Email"
            value={
              form.email
            }
            onChange={(
              v
            ) =>
              setForm({
                ...form,
                email: v,
              })
            }
          />

          <Input
            label="Địa chỉ"
            value={
              form.address
            }
            onChange={(
              v
            ) =>
              setForm({
                ...form,
                address:
                  v,
              })
            }
          />

          <Input
            type="date"
            label="Hạn GPLX"
            value={
              form.licenseExpiry
            }
            onChange={(
              v
            ) =>
              setForm({
                ...form,
                licenseExpiry:
                  v,
              })
            }
          />

          <div>
            <label className="text-[15px] text-slate-500">
              Trạng thái
            </label>

            <select
              value={
                form.status
              }
              onChange={(
                e
              ) =>
                setForm({
                  ...form,
                  status:
                    e
                      .target
                      .value,
                })
              }
              className="w-full border border-slate-300 rounded-2xl p-4 mt-2"
            >
              <option value="ACTIVE">
                ACTIVE
              </option>

              <option value="INACTIVE">
                INACTIVE
              </option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-10">

          <button
            onClick={
              onClose
            }
            className="px-7 py-4 rounded-2xl border border-slate-300 font-semibold"
          >
            Hủy
          </button>

          <button
            disabled={
              loading
            }
            onClick={
              handleSubmit
            }
            className="px-7 py-4 rounded-2xl bg-orange-500 text-white font-semibold"
          >
            {loading
              ? "Đang lưu..."
              : "Cập nhật"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value?: string;
  type?: string;
  onChange: (
    value: string
  ) => void;
}) {
  return (
    <div>
      <label className="text-[15px] text-slate-500">
        {label}
      </label>

      <input
        type={type}
        value={
          value || ""
        }
        onChange={(
          e
        ) =>
          onChange(
            e.target
              .value
          )
        }
        className="w-full border border-slate-300 rounded-2xl p-4 mt-2"
      />
    </div>
  );
}