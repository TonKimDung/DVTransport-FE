import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  CheckCircle,
  Clock,
  Edit,
  Eye,
  Trash2,
  FileText,
  Filter,
  MapPin,
  Package,
  Plus,
  Search,
  Truck,
} from "lucide-react";

import StatCard from "../components/StatCard"

import { orderService } from "../services/orderService";
import { customerService } from "../services/customerService";
import { contractService } from "../services/contractService";
import { routeService } from "../services/routeService";

import type { Order, OrderRequest } from "../types/order";
import type { Customer } from "../types/customer";
import type { Contract } from "../types/contract";
import type { RouteItem } from "../types/route";
import type { Vehicle } from "../types/vehicle";

const emptyForm: OrderRequest = {
  orderCode: "",
  customerId: 0,
  contractId: null,
  routeId: null,
  cargoType: "",
  weight: 0,
  quantity: 0,
  pickupAddress: "",
  deliveryAddress: "",
  totalAmount: 0,
  status: "CREATED",
};

export default function OrderPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [routes, setRoutes] = useState<RouteItem[]>([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Tất cả");

  const [openPlan, setOpenPlan] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<OrderRequest>(emptyForm);

  useEffect(() => {
    loadOrders();
    loadFormData();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await orderService.getAll();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      alert("Không thể tải danh sách đơn vận chuyển");
    }
  };

  const loadFormData = async () => {
    try {
      const [customerData, contractData, routeData] = await Promise.all([
        customerService.getAll(),
        contractService.getAll(),
        routeService.getAll(),
      ]);

      setCustomers(Array.isArray(customerData) ? customerData : []);
      setContracts(Array.isArray(contractData) ? contractData : []);
      setRoutes(Array.isArray(routeData) ? routeData : []);
    } catch (error) {
      console.error("Lỗi tải dữ liệu form tạo đơn:", error);
    }
  };

  const handleCreateOrder = async () => {
  try {
    if (!form.orderCode.trim()) {
      alert("Vui lòng nhập mã đơn hàng");
      return;
    }

    if (!form.customerId) {
      alert("Vui lòng chọn khách hàng");
      return;
    }

    if (editingId) {
      await orderService.update(editingId, form);
    } else {
      await orderService.create(form);
    }

    setOpenCreate(false);
    setEditingId(null);
    setForm(emptyForm);
    loadOrders();
  } catch (error) {
    console.error(error);
    alert(editingId ? "Cập nhật đơn thất bại" : "Tạo đơn vận chuyển thất bại");
  }
};

  const handleEdit = (order: Order) => {
  setEditingId(order.id);

  setForm({
    orderCode: order.orderCode,
    customerId: order.customerId,
    contractId: order.contractId ?? null,
    routeId: order.routeId ?? null,
    cargoType: order.cargoType,
    weight: order.weight,
    quantity: order.quantity,
    pickupAddress: order.pickupAddress,
    deliveryAddress: order.deliveryAddress,
    totalAmount: order.totalAmount,
    status: order.status,
  });

  setOpenCreate(true);
};

const handleDelete = async (id: number) => {
  if (!confirm("Bạn có chắc muốn xóa đơn vận chuyển này không?")) return;

  try {
    await orderService.delete(id);
    loadOrders();
  } catch (error) {
    console.error(error);
    alert("Xóa đơn vận chuyển thất bại");
  }
};

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchSearch = `${order.orderCode} ${order.customerName} ${order.cargoType}`
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchStatus =
        status === "Tất cả" ? true : order.status === status;

      return matchSearch && matchStatus;
    });
  }, [orders, search, status]);

  const pendingCount = orders.filter((o) =>
    ["Chưa phân công", "PENDING", "CREATED"].includes(o.status)
  ).length;

  const transportingCount = orders.filter((o) =>
    ["Đã phân công", "DELIVERING", "ASSIGNED"].includes(o.status)
  ).length;

  const completedCount = orders.filter((o) =>
    ["Hoàn thành", "COMPLETED"].includes(o.status)
  ).length;

  return (
    <div className="space-y-7">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard icon={<FileText />} title="Tổng đơn hàng" value={orders.length} color="blue" />
        <StatCard icon={<Clock />} title="Chưa phân công" value={pendingCount} color="yellow" />
        <StatCard icon={<Truck />} title="Đã phân công" value={transportingCount} color="orange" />
        <StatCard icon={<CheckCircle />} title="Hoàn thành" value={completedCount} color="green" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute top-3 left-3 text-slate-400" size={19} />
            <input
              className="w-[270px] border border-slate-300 rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-orange-300"
              placeholder="Tìm kiếm đơn hàng..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Filter className="text-slate-500" size={22} />

          <select
            className="border border-slate-300 rounded-xl px-5 py-3 outline-none w-[200px]"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option>Tất cả</option>
            <option value="CREATED">Chưa phân công</option>
            <option value="ASSIGNED">Đã phân công</option>
            <option value="COMPLETED">Hoàn thành</option>
          </select>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setOpenPlan(true)}
            className="border border-orange-600 text-orange-600 px-6 py-3 rounded-xl font-bold flex items-center gap-2"
          >
            <Calendar size={20} />
            Lập kế hoạch
          </button>

          <button
            onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
                setOpenCreate(true);
            }}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"
            >
            <Plus size={20} />
            Tạo đơn mới
            </button>
        </div>
      </div>

      <div className="space-y-5">
        {filteredOrders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onEdit={handleEdit}
            onDelete={handleDelete}
            />
        ))}

        {filteredOrders.length === 0 && (
          <div className="bg-white rounded-2xl border p-8 text-center text-slate-500">
            Không có đơn vận chuyển nào
          </div>
        )}
      </div>

      {openPlan && <PlanModal onClose={() => setOpenPlan(false)} />}

      {openCreate && (
        <CreateOrderModal
          form={form}
          setForm={setForm}
          customers={customers}
          contracts={contracts}
          routes={routes}
          onClose={() => setOpenCreate(false)}
          onSubmit={handleCreateOrder}
        />
      )}
    </div>
  );
}

function OrderCard({
  order,
  onEdit,
  onDelete,
}: {
  order: Order;
  onEdit: (order: Order) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-7 flex justify-between gap-8">
      <div className="flex gap-5">
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${getStatusIconBg(order.status)}`}>
          {getStatusIcon(order.status)}
        </div>

        <div>
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-xl font-bold text-slate-900">{order.orderCode}</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusStyle(order.status)}`}>
              {formatStatus(order.status)}
            </span>
          </div>

          <p className="font-semibold mb-3">{order.customerName}</p>

          <div className="space-y-2 text-slate-600">
            <p className="flex items-center gap-2">
              <MapPin size={17} className="text-green-600" />
              {order.pickupAddress}
            </p>

            <p className="flex items-center gap-2">
              <MapPin size={17} className="text-red-600" />
              {order.deliveryAddress}
            </p>
          </div>

          <div className="flex flex-wrap gap-6 mt-5 text-slate-600">
            <span className="flex items-center gap-2">
              <Package size={17} />
              {order.cargoType || "Hàng hóa"}
            </span>

            <span>
              Trọng lượng: <b className="text-slate-900">{order.weight} tấn</b>
            </span>

            <span>
              Tuyến: <b className="text-slate-900">{order.routeName || "Chưa có tuyến"}</b>
            </span>
          </div>
        </div>
      </div>

      <div className="min-w-[190px] text-right flex flex-col justify-between">
        <div>
          <p className="text-slate-500">Ngày tạo</p>
          <p className="font-bold mb-4">{formatDate(order.createdAt)}</p>

          <p className="text-slate-500">Mã tuyến</p>
          <p className="font-bold">{order.routeId ? `#${order.routeId}` : "Chưa có"}</p>
        </div>

        <div>
          <p className="text-xl font-bold text-orange-600 mb-6">
            {formatMoney(order.totalAmount)}
          </p>

          <div className="flex justify-end gap-5 text-slate-600">
            <button onClick={() => onEdit(order)}>
            <Edit size={21} />
            </button>

            <button onClick={() => onDelete(order.id)} className="text-red-500">
            <Trash2 size={21} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CreateOrderModal({
  form,
  setForm,
  customers,
  contracts,
  routes,
  onClose,
  onSubmit,
}: {
  form: OrderRequest;
  setForm: React.Dispatch<React.SetStateAction<OrderRequest>>;
  customers: Customer[];
  contracts: Contract[];
  routes: RouteItem[];
  onClose: () => void;
  onSubmit: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-start pt-10">
      <div className="bg-white w-[900px] max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-3">
            <Plus className="text-orange-600" />
            Tạo đơn vận chuyển mới
          </h2>

          <button onClick={onClose} className="text-2xl text-slate-500">
            ×
          </button>
        </div>

        <div className="p-6 grid grid-cols-2 gap-5">
          <Input
            label="Mã đơn hàng"
            value={form.orderCode}
            onChange={(v) => setForm({ ...form, orderCode: v })}
          />

          <Select
            label="Khách hàng"
            value={form.customerId}
            onChange={(v) => setForm({ ...form, customerId: Number(v) })}
          >
            <option value={0}>-- Chọn khách hàng --</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name} - {customer.phone}
              </option>
            ))}
          </Select>

          <Select
            label="Hợp đồng"
            value={form.contractId || ""}
            onChange={(v) =>
              setForm({
                ...form,
                contractId: v ? Number(v) : null,
              })
            }
          >
            <option value="">-- Không chọn --</option>
            {contracts.map((contract) => (
              <option key={contract.id} value={contract.id}>
                {contract.contractNumber} -{" "}
                {contract.customerName || contract.partnerName || "N/A"}
              </option>
            ))}
          </Select>

          <Select
            label="Tuyến đường"
            value={form.routeId || ""}
            onChange={(v) =>
              setForm({
                ...form,
                routeId: v ? Number(v) : null,
              })
            }
          >
            <option value="">-- Không chọn --</option>
            {routes.map((route) => (
              <option key={route.id} value={route.id}>
                {route.routeName} - {route.distanceKm} km
              </option>
            ))}
          </Select>

          <Input
            label="Loại hàng"
            value={form.cargoType}
            onChange={(v) => setForm({ ...form, cargoType: v })}
          />

          <Input
            label="Trọng lượng"
            type="number"
            value={form.weight}
            onChange={(v) => setForm({ ...form, weight: Number(v) })}
          />

          <Input
            label="Số lượng"
            type="number"
            value={form.quantity}
            onChange={(v) => setForm({ ...form, quantity: Number(v) })}
          />

          <Input
            label="Tổng tiền"
            type="number"
            value={form.totalAmount}
            onChange={(v) => setForm({ ...form, totalAmount: Number(v) })}
          />

          <div className="col-span-2">
            <Input
              label="Địa chỉ lấy hàng"
              value={form.pickupAddress}
              onChange={(v) => setForm({ ...form, pickupAddress: v })}
            />
          </div>

          <div className="col-span-2">
            <Input
              label="Địa chỉ giao hàng"
              value={form.deliveryAddress}
              onChange={(v) => setForm({ ...form, deliveryAddress: v })}
            />
          </div>

          <Select
            label="Trạng thái"
            value={form.status}
            onChange={(v) => setForm({ ...form, status: v })}
          >
            <option value="CREATED">Chưa phân công</option>
            <option value="ASSIGNED">Đã phân công</option>
            <option value="COMPLETED">Hoàn thành</option>
          </Select>
        </div>

        <div className="p-6 border-t flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-3 rounded-xl border">
            Hủy
          </button>

          <button
            onClick={onSubmit}
            className="px-6 py-3 rounded-xl bg-orange-600 text-white font-bold"
          >
            Tạo đơn
          </button>
        </div>
      </div>
    </div>
  );
}

function PlanModal({ onClose }: { onClose: () => void }) {
  const today = new Date().toISOString().slice(0, 10);

  const [mode, setMode] = useState<"day" | "week">("day");
  const [date, setDate] = useState(today);
  const [planOrders, setPlanOrders] = useState<Order[]>([]);
  const [suggestedVehicles, setSuggestedVehicles] = useState<Vehicle[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPlan();
  }, [mode, date]);

  const loadPlan = async () => {
    try {
      setLoading(true);

      const data =
        mode === "day"
          ? await orderService.getDailyPlan(date)
          : await orderService.getWeeklyPlan(date);

      setPlanOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      alert("Không thể tải kế hoạch vận tải");
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestVehicles = async (order: Order) => {
    try {
      setSelectedOrder(order);

      const data = await orderService.suggestVehicles(order.id);
      setSuggestedVehicles(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      alert("Không thể gợi ý xe cho đơn này");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-start pt-10">
      <div className="bg-white w-[1100px] max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-3">
            <Calendar className="text-orange-600" />
            Lập kế hoạch vận tải
          </h2>

          <button onClick={onClose} className="text-2xl text-slate-500">
            ×
          </button>
        </div>

        <div className="p-6">
          <div className="flex justify-between mb-6">
            <div className="flex">
              <button
                onClick={() => setMode("day")}
                className={`px-5 py-2 rounded-l-xl font-bold ${
                  mode === "day"
                    ? "bg-orange-600 text-white"
                    : "border text-slate-700"
                }`}
              >
                Theo ngày
              </button>

              <button
                onClick={() => setMode("week")}
                className={`px-5 py-2 rounded-r-xl font-bold ${
                  mode === "week"
                    ? "bg-orange-600 text-white"
                    : "border text-slate-700"
                }`}
              >
                Theo tuần
              </button>
            </div>

            <input
              type="date"
              className="border rounded-xl px-5 py-2"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold mb-4">
                Đơn hàng trong kế hoạch
              </h3>

              {loading && (
                <div className="border rounded-xl p-5 text-slate-500">
                  Đang tải...
                </div>
              )}

              {!loading && planOrders.length === 0 && (
                <div className="border rounded-xl p-5 text-slate-500">
                  Không có đơn hàng nào trong khoảng thời gian này
                </div>
              )}

              {!loading &&
                planOrders.map((order) => (
                  <div key={order.id} className="border rounded-xl p-4 mb-4">
                    <div className="flex justify-between">
                      <h4 className="font-bold">{order.orderCode}</h4>

                      <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-lg text-sm">
                        {formatStatus(order.status)}
                      </span>
                    </div>

                    <p className="mt-2">{order.customerName}</p>
                    <p className="text-sm text-slate-600 mt-2">
                      📦 {order.cargoType} - {order.weight} tấn
                    </p>
                    <p className="text-sm text-slate-600">
                      📍 {order.pickupAddress}
                    </p>
                    <p className="text-sm text-slate-600">
                      🎯 {order.deliveryAddress}
                    </p>
                    <p className="text-sm text-slate-600">
                      💰 {formatMoney(order.totalAmount)}
                    </p>

                    <button
                      onClick={() => handleSuggestVehicles(order)}
                      className="w-full mt-4 bg-orange-600 text-white rounded-xl py-3 font-bold"
                    >
                      Gợi ý xe phù hợp
                    </button>
                  </div>
                ))}
            </div>

            <div>
              <h3 className="font-bold mb-4">
                Xe gợi ý{" "}
                {selectedOrder ? `cho ${selectedOrder.orderCode}` : ""}
              </h3>

              {!selectedOrder && (
                <div className="border rounded-xl p-5 text-slate-500">
                  Chọn một đơn hàng bên trái để xem xe phù hợp
                </div>
              )}

              {selectedOrder && suggestedVehicles.length === 0 && (
                <div className="border rounded-xl p-5 text-slate-500">
                  Không có xe phù hợp hoặc chưa có dữ liệu gợi ý
                </div>
              )}

              {suggestedVehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="border rounded-xl p-4 mb-4 flex gap-4"
                >
                  <div className="bg-orange-100 text-orange-600 p-3 rounded-xl h-fit">
                    <Truck size={22} />
                  </div>

                  <div>
                    <h4 className="font-bold">{vehicle.plateNumber}</h4>
                    <p>{vehicle.vehicleType}</p>
                    <p>Tải trọng: {vehicle.capacity} tấn</p>
                    <p>Năm SX: {vehicle.manufactureYear}</p>

                    <span className="inline-block mt-2 bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm">
                      {vehicle.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t flex gap-3">
          <button onClick={onClose} className="px-6 py-3 rounded-xl border">
            Đóng
          </button>

          <button className="flex-1 bg-orange-600 text-white rounded-xl font-bold">
            Lưu kế hoạch
          </button>
        </div>
      </div>
    </div>
  );
}

function PlanOrderCard({ code }: { code: string }) {
  return (
    <div className="border rounded-xl p-4 mb-4">
      <div className="flex justify-between">
        <h4 className="font-bold">{code}</h4>
        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-lg text-sm">
          Chờ nhận
        </span>
      </div>

      <p className="mt-2">Công ty TNHH ABC</p>
      <p className="text-sm text-slate-600 mt-2">📦 Thiết bị điện tử - 15 tấn</p>
      <p className="text-sm text-slate-600">📍 Kho hàng Cầu Giấy, Hà Nội</p>
      <p className="text-sm text-slate-600">🎯 Kho Liên Chiểu, Đà Nẵng</p>
      <p className="text-sm text-slate-600">🗓 Giao: 08/05/2026</p>

      <button className="w-full mt-4 bg-orange-600 text-white rounded-xl py-3 font-bold">
        Phân công xe
      </button>
    </div>
  );
}

function PlanVehicleCard({
  plate,
  name,
}: {
  plate: string;
  name: string;
}) {
  return (
    <div className="border rounded-xl p-4 mb-4 flex gap-4">
      <div className="bg-orange-100 text-orange-600 p-3 rounded-xl h-fit">
        <Truck size={22} />
      </div>

      <div>
        <h4 className="font-bold">{plate}</h4>
        <p>{name}</p>
        <p>Tải trọng: 20 tấn</p>
        <p>Tài xế: Nguyễn Văn A</p>

        <span className="inline-block mt-2 bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm">
          Sẵn sàng
        </span>
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
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      <input
        type={type}
        className="w-full border border-slate-300 rounded-xl px-4 py-3 mt-1 outline-none focus:ring-2 focus:ring-orange-300"
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
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      <select
        className="w-full border border-slate-300 rounded-xl px-4 py-3 mt-1 outline-none focus:ring-2 focus:ring-orange-300"
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

function formatMoney(value: number) {
  return Number(value || 0).toLocaleString("vi-VN") + " VNĐ";
}

function formatStatus(status: string) {
  if (status === "CREATED" || status === "string") return "Chưa phân công";
  if (status === "ASSIGNED") return "Đã phân công";
  if (status === "COMPLETED") return "Hoàn thành";
  return status;
}

function getStatusStyle(status: string) {
  if (status === "COMPLETED") return "bg-green-100 text-green-700";
  if (status === "ASSIGNED") return "bg-orange-100 text-orange-700";
  return "bg-yellow-100 text-yellow-700";
}

function getStatusIconBg(status: string) {
  if (status === "COMPLETED") return "bg-green-100 text-green-600";
  if (status === "ASSIGNED") return "bg-orange-100 text-orange-600";
  return "bg-yellow-100 text-yellow-600";
}

function getStatusIcon(status: string) {
  if (status === "COMPLETED") return <CheckCircle size={24} />;
  if (status === "ASSIGNED") return <Truck size={24} />;
  return <Clock size={24} />;
}