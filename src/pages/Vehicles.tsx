import { useEffect, useMemo, useState } from "react";
import {
  Eye,
  Pencil,
  Trash2,
  Plus,
  Search,
  Truck,
  Settings,
  Fuel,
} from "lucide-react";
import { vehicleService } from "../services/vehicleService";
import type {
  Vehicle,
  VehicleRequest,
} from "../types/vehicle";

const emptyForm: VehicleRequest = {
  plateNumber: "",
  vehicleType: "",
  capacity: 0,
  status: "Hoạt động",
  manufactureYear: new Date().getFullYear(),
  inspectionExpiry: "",
  insuranceExpiry: "",
};

export default function Vehicle() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [search, setSearch] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<VehicleRequest>(emptyForm);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const data = await vehicleService.getAll();
      setVehicles(data);
    } catch (error) {
      console.error(error);
      alert("Không thể tải danh sách phương tiện");
    }
  };

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) =>
      `${v.plateNumber} ${v.vehicleType} ${v.status}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [vehicles, search]);

  const totalVehicles = vehicles.length;
  const activeVehicles = vehicles.filter((v) => v.status === "Hoạt động").length;
  const maintenanceVehicles = vehicles.filter(
    (v) => v.status === "Bảo trì"
  ).length;

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await vehicleService.update(editingId, form);
      } else {
        await vehicleService.create(form);
      }

      setOpenForm(false);
      setEditingId(null);
      setForm(emptyForm);
      fetchVehicles();
    } catch (error) {
      console.error(error);
      alert("Lưu phương tiện thất bại");
    }
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingId(vehicle.id);
    setForm({
      plateNumber: vehicle.plateNumber,
      vehicleType: vehicle.vehicleType,
      capacity: vehicle.capacity,
      status: vehicle.status,
      manufactureYear: vehicle.manufactureYear,
      inspectionExpiry: vehicle.inspectionExpiry,
      insuranceExpiry: vehicle.insuranceExpiry,
    });
    setOpenForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa phương tiện này không?")) return;

    try {
      await vehicleService.delete(id);
      fetchVehicles();
    } catch (error) {
      console.error(error);
      alert("Xóa phương tiện thất bại");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 text-slate-800">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <StatCard
          icon={<Truck />}
          title="Tổng số xe"
          value={totalVehicles}
          note="+12%"
          color="orange"
        />
        <StatCard
          icon={<Settings />}
          title="Đang hoạt động"
          value={activeVehicles}
          note="Tốt"
          color="green"
        />
        <StatCard
          icon={<Settings />}
          title="Đang bảo trì"
          value={maintenanceVehicles}
          note="Cảnh báo"
          color="yellow"
        />
        <StatCard
          icon={<Fuel />}
          title="Mức tiêu hao"
          value="8.5L"
          note="Trung bình"
          color="purple"
        />
      </div>

      <div className="bg-white rounded-2xl shadow border p-4 mb-6 flex items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute top-3 left-3 text-slate-400" size={18} />
          <input
            className="w-full border rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-orange-300"
            placeholder="Tìm kiếm theo biển số, loại xe, trạng thái..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button
          onClick={() => {
            setOpenForm(true);
            setEditingId(null);
            setForm(emptyForm);
          }}
          className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-3 rounded-xl font-semibold flex items-center gap-2"
        >
          <Plus size={18} />
          Thêm phương tiện
        </button>
      </div>

      {openForm && (
        <div className="bg-white rounded-2xl shadow border p-5 mb-6">
          <h2 className="font-bold text-lg mb-4">
            {editingId ? "Cập nhật phương tiện" : "Thêm phương tiện"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              label="Biển số xe"
              value={form.plateNumber}
              onChange={(value) => setForm({ ...form, plateNumber: value })}
            />

            <Input
              label="Loại xe"
              value={form.vehicleType}
              onChange={(value) => setForm({ ...form, vehicleType: value })}
            />

            <Input
              label="Tải trọng"
              type="number"
              value={form.capacity}
              onChange={(value) =>
                setForm({ ...form, capacity: Number(value) })
              }
            />

            <Input
              label="Năm sản xuất"
              type="number"
              value={form.manufactureYear}
              onChange={(value) =>
                setForm({ ...form, manufactureYear: Number(value) })
              }
            />

            <div>
              <label className="text-sm font-medium">Trạng thái</label>
              <select
                className="w-full border rounded-lg px-3 py-2 mt-1"
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value })
                }
              >
                <option value="Hoạt động">Hoạt động</option>
                <option value="Bảo trì">Bảo trì</option>
                <option value="Ngưng hoạt động">Ngưng hoạt động</option>
              </select>
            </div>

            <Input
              label="Hạn đăng kiểm"
              type="date"
              value={form.inspectionExpiry}
              onChange={(value) =>
                setForm({ ...form, inspectionExpiry: value })
              }
            />

            <Input
              label="Hạn bảo hiểm"
              type="date"
              value={form.insuranceExpiry}
              onChange={(value) =>
                setForm({ ...form, insuranceExpiry: value })
              }
            />
          </div>

          <div className="flex justify-end gap-3 mt-5">
            <button
              onClick={() => setOpenForm(false)}
              className="px-5 py-2 rounded-lg border"
            >
              Hủy
            </button>

            <button
              onClick={handleSubmit}
              className="px-5 py-2 rounded-lg bg-orange-600 text-white font-semibold"
            >
              Lưu
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow border overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr className="text-left text-sm text-slate-700">
              <th className="p-4">Biển số xe</th>
              <th className="p-4">Loại xe</th>
              <th className="p-4">Tải trọng</th>
              <th className="p-4">Năm SX</th>
              <th className="p-4">Đăng kiểm</th>
              <th className="p-4">Bảo hiểm</th>
              <th className="p-4">Trạng thái</th>
              <th className="p-4">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {filteredVehicles.map((vehicle) => (
              <tr key={vehicle.id} className="border-t">
                <td className="p-4 font-bold text-slate-900 flex items-center gap-3">
                  <div className="bg-orange-100 text-orange-600 p-3 rounded-xl">
                    <Truck size={18} />
                  </div>
                  {vehicle.plateNumber}
                </td>

                <td className="p-4">{vehicle.vehicleType}</td>
                <td className="p-4">{vehicle.capacity} tấn</td>
                <td className="p-4">{vehicle.manufactureYear}</td>
                <td className="p-4">{vehicle.inspectionExpiry}</td>
                <td className="p-4">{vehicle.insuranceExpiry}</td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      vehicle.status === "Hoạt động"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {vehicle.status}
                  </span>
                </td>

                <td className="p-4">
                  <div className="flex gap-3 text-slate-600">
                    <button title="Xem">
                      <Eye size={18} />
                    </button>

                    <button onClick={() => handleEdit(vehicle)} title="Sửa">
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => handleDelete(vehicle.id)}
                      title="Xóa"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredVehicles.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center p-6 text-slate-500">
                  Không có phương tiện nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  note,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  note: string;
  color: "orange" | "green" | "yellow" | "purple";
}) {
  const colorMap = {
    orange: "bg-orange-100 text-orange-600",
    green: "bg-green-100 text-green-600",
    yellow: "bg-yellow-100 text-yellow-600",
    purple: "bg-purple-100 text-purple-600",
  };

  return (
    <div className="bg-white rounded-2xl shadow border p-6">
      <div className="flex justify-between items-start">
        <div className={`${colorMap[color]} p-3 rounded-xl`}>{icon}</div>
        <span className="text-sm font-semibold">{note}</span>
      </div>

      <p className="mt-5 text-sm font-medium">{title}</p>
      <h2 className="text-3xl font-bold mt-2">{value}</h2>
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
      <label className="text-sm font-medium">{label}</label>
      <input
        type={type}
        className="w-full border rounded-lg px-3 py-2 mt-1"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}