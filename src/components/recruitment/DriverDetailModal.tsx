import type { Driver }
from "../../types/driver";

interface Props {
  open: boolean;
  onClose: () => void;
  driver?: Driver | null;
}

export default function DriverDetailModal({
  open,
  onClose,
  driver,
}: Props) {
  if (!open ||
    !driver)
    return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">

      <div className="bg-white w-[720px] rounded-[32px] p-10">

        <div className="flex items-center justify-between mb-8">

          <div>
            <h2 className="text-[34px] font-bold">
              {driver.fullName}
            </h2>

            <p className="text-slate-400 mt-1">
              Chi tiết tài xế
            </p>
          </div>

          <span
            className={`px-5 py-2 rounded-full font-semibold ${
              driver.status ===
              "ACTIVE"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {
              driver.status
            }
          </span>
        </div>

        <div className="grid grid-cols-2 gap-6">

          <Item
            title="Họ tên"
            value={
              driver.fullName
            }
          />

          <Item
            title="SĐT"
            value={
              driver.phone
            }
          />

          <Item
            title="Email"
            value={
              driver.email
            }
          />

          <Item
            title="Địa chỉ"
            value={
              driver.address
            }
          />

          <Item
            title="GPLX"
            value={
              driver.licenseNumber
            }
          />

          <Item
            title="Hạn GPLX"
            value={new Date(
              driver.licenseExpiry
            ).toLocaleDateString(
              "vi-VN"
            )}
          />

          <Item
            title="Ngày tạo"
            value={new Date(
              driver.createdAt
            ).toLocaleDateString(
              "vi-VN"
            )}
          />
        </div>

        <div className="flex justify-end mt-10">

          <button
            onClick={
              onClose
            }
            className="bg-slate-900 text-white px-7 py-4 rounded-2xl font-semibold"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

function Item({
  title,
  value,
}: {
  title: string;
  value?: string;
}) {
  return (
    <div className="bg-slate-50 rounded-2xl p-5">

      <p className="text-slate-400 text-sm">
        {title}
      </p>

      <h3 className="font-semibold text-lg mt-2">
        {value || "-"}
      </h3>
    </div>
  );
}