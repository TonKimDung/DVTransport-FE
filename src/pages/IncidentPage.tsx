import {
  AlertTriangle,
  Clock,
  MapPin,
  Truck,
} from "lucide-react";

import { useEffect, useState } from "react";

type IncidentDTO = {
  id: number;
  tripId: number;
  type: string;
  message: string;
  location: string;
  createdAt: string;
};

export default function IncidentPage() {
  const [incidents, setIncidents] = useState<IncidentDTO[]>([]);

  // demo load (sau này thay bằng API)
  useEffect(() => {
    const mock: IncidentDTO[] = [
      {
        id: 1,
        tripId: 101,
        type: "BROKEN_TRUCK",
        message: "Xe bị hỏng giữa đường",
        location: "Q.12 - TP.HCM",
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        tripId: 102,
        type: "TRAFFIC_ACCIDENT",
        message: "Tai nạn nhẹ, kẹt xe",
        location: "Xa lộ Hà Nội",
        createdAt: new Date().toISOString(),
      },
    ];

    setIncidents(mock);
  }, []);

  return (
    <div className="space-y-6">

      {/* TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">

        <div className="p-5 border-b border-slate-200 flex items-center gap-2">
          <AlertTriangle />
          <h2 className="font-bold text-lg">
            Danh sách sự cố
          </h2>
        </div>

        <table className="w-full">
          <thead className="bg-slate-50">
            <tr className="text-left">
              <th className="p-4">Thời gian</th>
              <th className="p-4">Trip</th>
              <th className="p-4">Loại</th>
              <th className="p-4">Nội dung</th>
              <th className="p-4">Vị trí</th>
            </tr>
          </thead>

          <tbody>
            {incidents.map((item) => (
              <tr
                key={item.id}
                className="border-t border-slate-100 hover:bg-slate-50"
              >
                <td className="p-4 text-sm">
                  {new Date(item.createdAt).toLocaleString("vi-VN")}
                </td>

                <td className="p-4 flex items-center gap-1">
                  <Truck size={16} />
                  #{item.tripId}
                </td>

                <td className="p-4">
                  <span className="px-3 py-1 rounded-full bg-red-100 text-red-600 text-xs font-semibold">
                    {item.type}
                  </span>
                </td>

                <td className="p-4">{item.message}</td>

                <td className="p-4 flex items-center gap-1 text-slate-600">
                  <MapPin size={16} />
                  {item.location}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ClipboardList,
  Edit,
  FileText,
  MapPin,
  Plus,
  X,
} from "lucide-react";

import { incidentService } from "../services/incidentService";
import { assignmentService } from "../services/assignmentService";

import type { Incident, IncidentRequest } from "../types/incident";
import type { Assignment } from "../types/assignment";

import { tripService } from "../services/tripService";
import type { Trip } from "../types/trip";

const emptyForm: IncidentRequest = {
  tripId: null,
  vehicleId: 0,
  driverId: 0,
  incidentType: "Tai nạn",
  description: "",
  incidentTime: new Date().toISOString().slice(0, 16),
  status: "PENDING",
};

export default function IncidentPage() {
  const [activeTab, setActiveTab] = useState<"tracking" | "safety">("safety");
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  const [openForm, setOpenForm] = useState(false);
  const [openStatusId, setOpenStatusId] = useState<number | null>(null);
  const [form, setForm] = useState<IncidentRequest>(emptyForm);
  const [trips, setTrips] = useState<Trip[]>([]);

  useEffect(() => {
  loadIncidents();
  loadAssignments();
  loadTrips();
}, []);

    const loadTrips = async () => {
  try {
    const data = await tripService.getAll();
    setTrips(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error("Lỗi tải chuyến xe:", error);
  }
};

  const loadIncidents = async () => {
    try {
      const data = await incidentService.getAll();
      setIncidents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      alert("Không thể tải danh sách sự cố");
    }
  };

  const loadAssignments = async () => {
    try {
      const data = await assignmentService.getAll();
      setAssignments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      alert("Không thể tải danh sách xe và tài xế");
    }
  };

  const selectedAssignment = useMemo(() => {
    return assignments.find((item) => item.vehicleId === form.vehicleId);
  }, [assignments, form.vehicleId]);

  const handleChooseVehicle = (vehicleId: number) => {
  const assignment = assignments.find((item) => item.vehicleId === vehicleId);

  setForm({
    ...form,
    vehicleId,
    driverId: assignment?.driverId || 0,
    tripId: null,
  });
};

  const handleSubmit = async () => {
    try {
      if (!form.vehicleId) {
        alert("Vui lòng chọn biển số xe");
        return;
      }

      if (!form.driverId) {
        alert("Vui lòng chọn tài xế");
        return;
      }

      if (!form.description.trim()) {
        alert("Vui lòng nhập mô tả sự cố");
        return;
      }

      await incidentService.create({
        ...form,
        incidentTime: new Date(form.incidentTime).toISOString(),
      });

      setOpenForm(false);
      setForm(emptyForm);
      loadIncidents();
    } catch (error) {
      console.error(error);
      alert("Ghi nhận sự cố thất bại");
    }
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await incidentService.updateStatus(id, status);
      setOpenStatusId(null);
      loadIncidents();
    } catch (error) {
      console.error(error);
      alert("BE chưa có API cập nhật trạng thái sự cố");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-8 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("tracking")}
          className={`pb-4 flex items-center gap-2 font-semibold ${
            activeTab === "tracking"
              ? "text-orange-600 border-b-2 border-orange-600"
              : "text-slate-400"
          }`}
        >
          <MapPin size={20} />
          Theo dõi & giám sát vận tải
        </button>

        <button
          onClick={() => setActiveTab("safety")}
          className={`pb-4 flex items-center gap-2 font-semibold ${
            activeTab === "safety"
              ? "text-orange-600 border-b-2 border-orange-600"
              : "text-slate-400"
          }`}
        >
          <FileText size={20} />
          Quản lý an toàn & rủi ro
        </button>
      </div>

      {activeTab === "tracking" && (
        <div className="bg-white rounded-2xl border p-8 text-slate-500">
          Chưa có nội dung theo dõi & giám sát vận tải.
        </div>
      )}

      {activeTab === "safety" && (
        <>
          <div className="flex justify-between items-center">
            <p className="text-slate-400">
              Tổng số:{" "}
              <span className="text-slate-900 font-bold">
                {incidents.length}
              </span>{" "}
              sự cố
            </p>

            <button
              onClick={() => {
                setForm(emptyForm);
                setOpenForm(true);
              }}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"
            >
              <Plus size={20} />
              Ghi nhận sự cố
            </button>
          </div>

          <div className="space-y-5">
            {incidents.map((item) => (
              <IncidentCard
                key={item.id}
                incident={item}
                openStatusId={openStatusId}
                setOpenStatusId={setOpenStatusId}
                onUpdateStatus={handleUpdateStatus}
              />
            ))}

            {incidents.length === 0 && (
              <div className="bg-white rounded-2xl border p-8 text-center text-slate-500">
                Chưa có sự cố nào
              </div>
            )}
          </div>
        </>
      )}

      {openForm && (
        <IncidentFormModal
            form={form}
            setForm={setForm}
            assignments={assignments}
            trips={trips}
            selectedAssignment={selectedAssignment}
            onChooseVehicle={handleChooseVehicle}
            onClose={() => setOpenForm(false)}
            onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

function IncidentCard({
  incident,
  openStatusId,
  setOpenStatusId,
  onUpdateStatus,
}: {
  incident: Incident;
  openStatusId: number | null;
  setOpenStatusId: React.Dispatch<React.SetStateAction<number | null>>;
  onUpdateStatus: (id: number, status: string) => void;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-7">
      <div className="flex justify-between gap-5">
        <div className="flex gap-4">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center ${getIncidentIconBg(
              incident.incidentType
            )}`}
          >
            <AlertTriangle size={22} />
          </div>

          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-bold">{incident.incidentType}</h2>

              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                {formatStatus(incident.status)}
              </span>
            </div>

            <p className="text-slate-400 mb-4">
              {incident.plateNumber || `Xe #${incident.vehicleId}`} -{" "}
              {incident.driverName || `Tài xế #${incident.driverId}`}
            </p>

            <p className="mb-4">{incident.description}</p>

            <p className="text-slate-500 mb-3">
              Mã chuyến:{" "}
              <span className="text-slate-900">
                {incident.tripId ? `${incident.tripId}` : "Chưa rõ"}
              </span>
            </p>

            <p className="text-sm text-slate-400">
              Báo cáo lúc {formatDateTime(incident.incidentTime)}
            </p>

            <div className="border-t mt-4 pt-4">
              <p className="font-bold mb-2">Giải quyết:</p>
              <p className="text-slate-400">
                {incident.status === "RESOLVED"
                  ? "Sự cố đã được xử lý"
                  : "Đang chờ xử lý hoặc đang xử lý"}
              </p>
            </div>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() =>
              setOpenStatusId(openStatusId === incident.id ? null : incident.id)
            }
            className="border rounded-xl px-4 py-2 hover:bg-slate-50 flex items-center gap-2"
          >
            <Edit size={18} />
            Sửa trạng thái
          </button>

          {openStatusId === incident.id && (
            <div className="absolute right-0 top-12 w-48 bg-white border rounded-xl shadow-lg p-2 z-20">
              <button
                onClick={() => onUpdateStatus(incident.id, "PENDING")}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50"
              >
                Chờ xử lý
              </button>

              <button
                onClick={() => onUpdateStatus(incident.id, "PROCESSING")}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50"
              >
                Đang xử lý
              </button>

              <button
                onClick={() => onUpdateStatus(incident.id, "RESOLVED")}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50"
              >
                Đã giải quyết
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function IncidentFormModal({
  form,
  setForm,
  assignments,
  trips,
  selectedAssignment,
  onChooseVehicle,
  onClose,
  onSubmit,
  
}: {
    
  form: IncidentRequest;
  setForm: React.Dispatch<React.SetStateAction<IncidentRequest>>;
  assignments: Assignment[];
  trips: Trip[];
  selectedAssignment?: Assignment;
  onChooseVehicle: (vehicleId: number) => void;
  onClose: () => void;
  onSubmit: () => void;
}) {
    const filteredTrips = trips.filter(
  (trip) => trip.vehicleId === form.vehicleId
);
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-start pt-8">
      <div className="bg-white rounded-2xl shadow-xl w-[1180px] max-h-[90vh] overflow-y-auto">
        <div className="p-7 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Ghi nhận sự cố mới</h2>

          <button onClick={onClose} className="text-slate-400">
            <X size={28} />
          </button>
        </div>

        <div className="px-7 pb-7 grid grid-cols-2 gap-5">
          <Select
            label="Loại sự cố *"
            value={form.incidentType}
            onChange={(v) => setForm({ ...form, incidentType: v })}
          >
            <option value="Tai nạn">Tai nạn</option>
            <option value="Hỏng hóc">Hỏng hóc</option>
            <option value="Trễ chuyến">Trễ chuyến</option>
            <option value="Rủi ro khác">Rủi ro khác</option>
          </Select>

          <Select
            label="Trạng thái sự cố *"
            value={form.status}
            onChange={(v) => setForm({ ...form, status: v })}
          >
            <option value="PENDING">Chờ xử lý</option>
            <option value="PROCESSING">Đang xử lý</option>
            <option value="RESOLVED">Đã xử lý</option>
          </Select>

          <Select
            label="Biển số xe *"
            value={form.vehicleId}
            onChange={(v) => onChooseVehicle(Number(v))}
          >
            <option value={0}>-- Chọn xe --</option>
            {assignments.map((item) => (
              <option key={item.id} value={item.vehicleId}>
                {item.plateNumber}
              </option>
            ))}
          </Select>

          <Select
            label="Tài xế *"
            value={form.driverId}
            onChange={(v) => setForm({ ...form, driverId: Number(v) })}
          >
            <option value={0}>-- Chọn tài xế --</option>
            {assignments.map((item) => (
              <option key={item.id} value={item.driverId}>
                {item.driverName}
              </option>
            ))}
          </Select>

          <Input
            label="Thời gian xảy ra sự cố"
            type="datetime-local"
            value={form.incidentTime}
            onChange={(v) => setForm({ ...form, incidentTime: v })}
          />

          <Select
            label="Chuyến xe"
            value={form.tripId || ""}
            onChange={(v) =>
                setForm({ ...form, tripId: v ? Number(v) : null })
            }
            >
            <option value="">-- Không chọn chuyến --</option>

            {filteredTrips.map((trip) => (
                <option key={trip.id} value={trip.id}>
                {trip.tripCode} - {trip.status}
                </option>
            ))}
            </Select>

          <div className="col-span-2">
            <Input
              label="Xe & tài xế đang chọn"
              value={
                selectedAssignment
                  ? `${selectedAssignment.plateNumber} - ${selectedAssignment.driverName}`
                  : ""
              }
              onChange={() => {}}
            />
          </div>

          <div className="col-span-2">
            <label className="text-sm font-semibold text-slate-400">
              Mô tả chi tiết *
            </label>
            <textarea
              className="w-full border border-slate-200 rounded-xl px-4 py-3 mt-2 min-h-[130px] outline-none focus:ring-2 focus:ring-orange-300"
              placeholder="Mô tả chi tiết về sự cố..."
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>
        </div>

        <div className="border-t px-7 py-5 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-3 rounded-xl border">
            Hủy
          </button>

          <button
            onClick={onSubmit}
            className="px-6 py-3 rounded-xl bg-orange-600 text-white font-bold"
          >
            Ghi nhận sự cố
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
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-slate-400">{label}</label>
      <input
        type={type}
        className="w-full border border-slate-200 rounded-xl px-4 py-3 mt-2 outline-none focus:ring-2 focus:ring-orange-300"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-slate-400">{label}</label>
      <select
        className="w-full border border-slate-200 rounded-xl px-4 py-3 mt-2 outline-none focus:ring-2 focus:ring-orange-300"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {children}
      </select>
    </div>
  );
}

function formatDateTime(date: string) {
  if (!date) return "";
  return new Date(date).toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatStatus(status: string) {
  if (status === "PENDING") return "Chờ xử lý";
  if (status === "PROCESSING") return "Đang xử lý";
  if (status === "RESOLVED") return "Đã giải quyết";
  if (status === "LOW") return "Thấp";
  if (status === "MEDIUM") return "Trung bình";
  if (status === "HIGH") return "Cao";
  return status;
}

function formatLevel(status: string) {
  if (status === "HIGH") return "Cao";
  if (status === "MEDIUM") return "Trung bình";
  if (status === "LOW") return "Thấp";
  return "Trung bình";
}

function getIncidentIconBg(type: string) {
  if (type === "Tai nạn") return "bg-red-100 text-red-600";
  if (type === "Hỏng hóc") return "bg-yellow-100 text-yellow-600";
  return "bg-orange-100 text-orange-600";
}