import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Calendar,
  Clock,
  Edit,
  FileText,
  Filter,
  Fuel,
  Plus,
  Search,
  Trash2,
  Truck,
} from "lucide-react";

import { fuelService } from "../services/fuelService";
import { vehicleService } from "../services/vehicleService";
import { driverService } from "../services/driverService";
import { partnerService } from "../services/partnerService";
import { tripService } from "../services/tripService";

import type { Vehicle } from "../types/vehicle";
import type { Driver } from "../types/driver";
import type { Partner } from "../types/partner";
import type { Trip } from "../types/trip";
import type {
  FuelTransaction,
  FuelTransactionRequest,
} from "../types/fuel";

const emptyForm: FuelTransactionRequest = {
  vehicleId: 0,
  tripId: undefined,
  driverId: undefined,
  partnerId: undefined,
  fuelDate: "",
  quantityLiters: 0,
  unitPrice: 0,
  invoiceNumber: "",
};

export default function FuelPage() {
  const [fuels, setFuels] = useState<FuelTransaction[]>([]);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] =
    useState<FuelTransactionRequest>(emptyForm);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
const [drivers, setDrivers] = useState<Driver[]>([]);
const [partners, setPartners] = useState<Partner[]>([]);
const [trips, setTrips] = useState<Trip[]>([]);

  useEffect(() => {
  loadFuels();
  loadDropdownData();
}, []);

const loadDropdownData = async () => {
  try {
    const vehicleData = await vehicleService.getAll();
    setVehicles(Array.isArray(vehicleData) ? vehicleData : []);
  } catch (error) {
    console.error("Lỗi tải vehicles:", error);
  }

  try {
    const driverData = await driverService.getAll();
    setDrivers(Array.isArray(driverData) ? driverData : []);
  } catch (error) {
    console.error("Lỗi tải drivers:", error);
  }

  try {
    const partnerData = await partnerService.getAll();
    setPartners(Array.isArray(partnerData) ? partnerData : []);
  } catch (error) {
    console.error("Lỗi tải partners:", error);
  }

  try {
    const tripData = await tripService.getAll();
    setTrips(Array.isArray(tripData) ? tripData : []);
  } catch (error) {
    console.error("Lỗi tải trips:", error);
  }
};

  const loadFuels = async () => {
    try {
      const data = await fuelService.getAll();
      setFuels(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      alert("Không thể tải danh sách phiếu nhiên liệu");
    }
  };

  const filteredFuels = useMemo(() => {
    return fuels.filter((item) => {
      const text = `${item.invoiceNumber} ${item.plateNumber} ${item.driverName}`
        .toLowerCase()
        .includes(search.toLowerCase());

      const dateOk = dateFilter
        ? item.fuelDate?.slice(0, 10) === dateFilter
        : true;

      return text && dateOk;
    });
  }, [fuels, search, dateFilter]);

  const totalLiters = fuels.reduce(
    (sum, item) => sum + Number(item.quantityLiters || 0),
    0
  );

  const totalCost = fuels.reduce(
    (sum, item) => sum + Number(item.totalAmount || 0),
    0
  );

  const averageLiter =
    fuels.length > 0 ? totalLiters / fuels.length : 0;

  const vehicleConsumption = useMemo(() => {
    const result: Record<string, number> = {};

    fuels.forEach((item) => {
      const plate = item.plateNumber || `Xe ${item.vehicleId}`;
      result[plate] =
        (result[plate] || 0) + Number(item.quantityLiters || 0);
    });

    return Object.entries(result).map(([plateNumber, liters]) => ({
      plateNumber,
      liters,
      percent: totalLiters
        ? Math.round((liters / totalLiters) * 100)
        : 0,
    }));
  }, [fuels, totalLiters]);

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await fuelService.update(editingId, form);
      } else {
        await fuelService.create(form);
      }

      setOpenForm(false);
      setEditingId(null);
      setForm(emptyForm);
      loadFuels();
    } catch (error) {
      console.error(error);
      alert("Lưu phiếu nhiên liệu thất bại");
    }
  };

  const handleEdit = (item: FuelTransaction) => {
    setEditingId(item.id);
    setForm({
      vehicleId: item.vehicleId,
      tripId: item.tripId,
      driverId: item.driverId,
      partnerId: item.partnerId,
      fuelDate: item.fuelDate?.slice(0, 16),
      quantityLiters: item.quantityLiters,
      unitPrice: item.unitPrice,
      invoiceNumber: item.invoiceNumber,
    });
    setOpenForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa phiếu nhiên liệu này không?"))
      return;

    try {
      await fuelService.delete(id);
      loadFuels();
    } catch (error) {
      console.error(error);
      alert("Xóa thất bại");
    }
  };

  return (
    <div className="space-y-7">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          icon={<Fuel />}
          title="Tổng lượng nhiên liệu"
          value={`${totalLiters.toLocaleString("vi-VN")}L`}
          color="purple"
        />

        <StatCard
          icon={<FileText />}
          title="Tổng chi phí"
          value={`${(totalCost / 1000000).toFixed(1)}M`}
          color="orange"
        />

        <StatCard
          icon={<BarChart3 />}
          title="TB tiêu hao/xe"
          value={`${averageLiter.toFixed(1)}L`}
          color="blue"
        />

        <StatCard
          icon={<Clock />}
          title="Phiếu nhiên liệu"
          value={fuels.length}
          color="green"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              className="absolute top-3 left-3 text-slate-400"
              size={19}
            />
            <input
              className="w-[270px] border border-slate-300 rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-orange-300"
              placeholder="Tìm kiếm phiếu nhiên liệu"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Filter className="text-slate-500" size={22} />

          <select className="border border-slate-300 rounded-xl px-5 py-3 outline-none">
            <option>Tất cả</option>
          </select>

          <div className="relative">
            <input
              type="date"
              className="border border-slate-300 rounded-xl px-5 py-3 outline-none"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
            <Calendar
              className="absolute right-3 top-3 text-slate-500"
              size={18}
            />
          </div>
        </div>

        <button
          onClick={() => {
            setOpenForm(true);
            setEditingId(null);
            setForm(emptyForm);
          }}
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"
        >
          <Plus size={20} />
          Ghi nhận đổ nhiên liệu
        </button>
      </div>

      {openForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
          <h2 className="font-bold text-lg mb-4">
            {editingId
              ? "Cập nhật phiếu nhiên liệu"
              : "Ghi nhận đổ nhiên liệu"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select
                label="Phương tiện"
                value={form.vehicleId}
                onChange={(v) =>
                    setForm({ ...form, vehicleId: Number(v) })
                }
                >
                <option value={0}>-- Chọn phương tiện --</option>
                {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.plateNumber} - {vehicle.vehicleType}
                    </option>
                ))}
                </Select>

                <Select
                label="Chuyến xe"
                value={form.tripId || ""}
                onChange={(v) =>
                    setForm({
                    ...form,
                    tripId: v ? Number(v) : undefined,
                    })
                }
                >
                <option value="">-- Không chọn --</option>
                {trips.map((trip) => (
                <option key={trip.id} value={trip.id}>
                    {trip.tripCode} - {trip.plateNumber} - {trip.driverName}
                </option>
                ))}
                </Select>

                <Select
                label="Tài xế"
                value={form.driverId || ""}
                onChange={(v) =>
                    setForm({
                    ...form,
                    driverId: v ? Number(v) : undefined,
                    })
                }
                >
                <option value="">-- Không chọn --</option>
                {drivers.map((driver) => (
                <option key={driver.id} value={driver.id}>
                    {driver.fullName} - {driver.phone}
                </option>
                ))}
                </Select>

                <Select
                label="Đối tác xăng dầu"
                value={form.partnerId || ""}
                onChange={(v) =>
                    setForm({
                    ...form,
                    partnerId: v ? Number(v) : undefined,
                    })
                }
                >
                <option value="">-- Không chọn --</option>
                {partners.map((partner) => (
                    <option key={partner.id} value={partner.id}>
                        {partner.name} - {partner.partnerType}
                    </option>
                    ))}
                </Select>

            <Input
              label="Ngày giờ đổ"
              type="datetime-local"
              value={form.fuelDate}
              onChange={(v) => setForm({ ...form, fuelDate: v })}
            />

            <Input
              label="Số lít"
              type="number"
              value={form.quantityLiters}
              onChange={(v) =>
                setForm({
                  ...form,
                  quantityLiters: Number(v),
                })
              }
            />

            <Input
              label="Đơn giá"
              type="number"
              value={form.unitPrice}
              onChange={(v) =>
                setForm({ ...form, unitPrice: Number(v) })
              }
            />

            <Input
              label="Số hóa đơn"
              value={form.invoiceNumber}
              onChange={(v) =>
                setForm({ ...form, invoiceNumber: v })
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

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr className="text-left text-slate-800">
              <th className="p-5">Mã phiếu</th>
              <th className="p-5">Ngày giờ</th>
              <th className="p-5">Phương tiện</th>
              <th className="p-5">Tài xế</th>
              <th className="p-5">Lượng (L)</th>
              <th className="p-5">Đơn giá</th>
              <th className="p-5">Thành tiền</th>
              <th className="p-5">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {filteredFuels.map((item) => (
              <tr key={item.id} className="border-t border-slate-200">
                <td className="p-5 font-bold text-slate-900">
                  NL-{String(item.id).padStart(3, "0")}
                </td>

                <td className="p-5">
                  <p className="font-semibold">
                    {formatDate(item.fuelDate)}
                  </p>
                  <p className="text-sm text-slate-500">
                    {formatTime(item.fuelDate)}
                  </p>
                </td>

                <td className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-100 text-orange-600 p-2 rounded-lg">
                      <Truck size={18} />
                    </div>
                    <span className="font-bold">
                      {item.plateNumber}
                    </span>
                  </div>
                </td>

                <td className="p-5">
                  {item.driverName || "Chưa có"}
                </td>

                <td className="p-5 font-bold text-purple-600">
                  {item.quantityLiters}L
                </td>

                <td className="p-5">
                  {Number(item.unitPrice).toLocaleString("vi-VN")}đ
                </td>

                <td className="p-5 font-bold text-orange-600">
                  {Number(item.totalAmount).toLocaleString("vi-VN")}đ
                </td>

                <td className="p-5">
                  <div className="flex gap-4 text-slate-600">
                    <button onClick={() => handleEdit(item)}>
                      <Edit size={18} />
                    </button>

                    <button onClick={() => handleDelete(item.id)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredFuels.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="text-center p-6 text-slate-500"
                >
                  Không có phiếu nhiên liệu nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-7">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-7">
          <h2 className="text-xl font-bold mb-6">
            Mức tiêu hao theo xe
          </h2>

          <div className="space-y-5">
            {vehicleConsumption.map((item) => (
              <div key={item.plateNumber}>
                <div className="flex justify-between mb-2">
                  <div className="flex items-center gap-2 font-semibold">
                    <Truck size={16} className="text-orange-600" />
                    {item.plateNumber}
                  </div>

                  <span className="text-purple-600 font-semibold">
                    {item.liters}L ({item.percent}%)
                  </span>
                </div>

                <div className="h-2 bg-slate-200 rounded-full">
                  <div
                    className="h-2 bg-purple-600 rounded-full"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-7">
          <h2 className="text-xl font-bold mb-6">
            Chi phí nhiên liệu gần đây
          </h2>

          <div className="space-y-3">
            {fuels.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className="bg-slate-50 rounded-xl p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-purple-100 text-purple-600 p-3 rounded-xl">
                    <Fuel size={22} />
                  </div>

                  <div>
                    <p className="font-bold">{item.plateNumber}</p>
                    <p className="text-sm text-slate-500">
                      {formatDate(item.fuelDate)} -{" "}
                      {item.quantityLiters}L
                    </p>
                  </div>
                </div>

                <p className="font-bold text-orange-600">
                  {(Number(item.totalAmount) / 1000).toLocaleString(
                    "vi-VN"
                  )}
                  K
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  color: "purple" | "orange" | "blue" | "green";
}) {
  const colorMap = {
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-7">
      <div
        className={`${colorMap[color]} w-14 h-14 rounded-xl flex items-center justify-center mb-6`}
      >
        {icon}
      </div>

      <p className="font-semibold text-slate-700 mb-2">{title}</p>
      <h2 className="text-3xl font-bold text-slate-900">{value}</h2>
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
      <label className="text-sm font-medium">{label}</label>
      <select
        className="w-full border rounded-lg px-3 py-2 mt-1"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {children}
      </select>
    </div>
  );
}

function formatDate(date: string) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("vi-VN");
}

function formatTime(date: string) {
  if (!date) return "";
  return new Date(date).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
