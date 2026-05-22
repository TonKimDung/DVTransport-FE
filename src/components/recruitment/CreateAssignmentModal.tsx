import { useState } from "react";
import { X } from "lucide-react";
import { assignmentService } from "../../services/assignmentService";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  drivers: any[];
  vehicles: any[];
}

export default function CreateAssignmentModal({
  open,
  onClose,
  onSuccess,
  drivers,
  vehicles,
}: Props) {
  const [driverId, setDriverId] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [assignedDate, setAssignedDate] = useState("");

  const handleSubmit = async () => {
    try {
      if (!driverId || !vehicleId || !assignedDate) {
        alert("Vui lòng nhập đầy đủ thông tin");
        return;
      }

      const payload = {
        driverId: Number(driverId),
        vehicleId: Number(vehicleId),
        assignedDate,
      };

      console.log("CREATE ASSIGNMENT:", payload);

      const res = await assignmentService.create(payload);

      console.log("CREATE RESPONSE:", res);

      alert("Tạo phân công thành công");

      onSuccess();
      onClose();

      // reset form
      setDriverId("");
      setVehicleId("");
      setAssignedDate("");
    } catch (err: any) {
      console.error(
        "CREATE ASSIGNMENT ERROR:",
        err
      );

      alert(
        err?.response?.data?.message ||
          "Không thể tạo phân công"
      );
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl p-8 w-[500px] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* BUTTON CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4"
        >
          <X size={22} />
        </button>

        <h2 className="text-2xl font-bold mb-6">
          Phân công tài xế
        </h2>

        <div className="space-y-5">
          {/* DRIVER */}
          <select
            value={driverId}
            onChange={(e) =>
              setDriverId(e.target.value)
            }
            className="w-full border p-4 rounded-xl"
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
          </select>

          {/* VEHICLE */}
          <select
            value={vehicleId}
            onChange={(e) =>
              setVehicleId(e.target.value)
            }
            className="w-full border p-4 rounded-xl"
          >
            <option value="">
              Chọn xe
            </option>

            {vehicles.map((v) => (
              <option
                key={v.id}
                value={v.id}
              >
                {v.plateNumber}
              </option>
            ))}
          </select>

          {/* DATE */}
          <input
            type="date"
            value={assignedDate}
            onChange={(e) =>
              setAssignedDate(e.target.value)
            }
            className="w-full border p-4 rounded-xl"
          />

          {/* SUBMIT */}
          <button
            onClick={handleSubmit}
            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-4 rounded-xl w-full"
          >
            Tạo phân công
          </button>
        </div>
      </div>
    </div>
  );
}