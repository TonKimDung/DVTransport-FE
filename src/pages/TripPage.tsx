// src/pages/TripPage.tsx

import { useEffect, useMemo, useState } from "react";

import {
  CheckCircle,
  Clock,
  Eye,
  Filter,
  MapPin,
  Plus,
  Search,
  Truck,
  User,
} from "lucide-react";

import StatCard from "../components/StatCard";

import { tripService } from "../services/tripService";
import { routeService } from "../services/routeService";

import type { RouteItem } from "../types/route";
import type {
  CreateTripRequest,
  Trip,
  VehicleSuggestion,
} from "../types/trip";

const emptyForm: CreateTripRequest = {
  routeId: 0,
  vehicleId: 0,
  orderIds: [],
  departureTime: "",
};

export default function TripPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [routes, setRoutes] = useState<RouteItem[]>([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Tất cả");

  const [openCreate, setOpenCreate] = useState(false);

  const [form, setForm] =
    useState<CreateTripRequest>(emptyForm);

  useEffect(() => {
    loadTrips();
    loadRoutes();
  }, []);

  const loadTrips = async () => {
    try {
      const data = await tripService.getAll();
      setTrips(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      alert("Không thể tải danh sách chuyến xe");
    }
  };

  const loadRoutes = async () => {
    try {
      const data = await routeService.getAll();
      setRoutes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateTrip = async () => {
    try {
      if (!form.routeId) {
        alert("Vui lòng chọn tuyến đường");
        return;
      }

      if (!form.vehicleId) {
        alert("Vui lòng chọn xe");
        return;
      }

      if (form.orderIds.length === 0) {
        alert("Vui lòng chọn đơn hàng");
        return;
      }

      const payload = {
        ...form,
        departureTime:
          form.departureTime + ":00",
      };

      console.log(
        "CREATE PAYLOAD:",
        payload
      );

      const res =
        await tripService.create(payload);

      console.log(
        "CREATE RESPONSE:",
        res
      );

      alert("Tạo chuyến xe thành công");

      setOpenCreate(false);
      setForm(emptyForm);

      await loadTrips();
    } catch (error: any) {
      console.error(error);

      console.error(
        "SERVER RESPONSE:",
        error?.response?.data
      );

      alert(
        error?.response?.data?.message ||
          JSON.stringify(
            error?.response?.data
          ) ||
          "Tạo chuyến xe thất bại"
      );
    }
  };
  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      const keyword =
        `${trip.tripCode} ${trip.plateNumber} ${trip.driverName}`
          .toLowerCase();

      const matchSearch =
        keyword.includes(search.toLowerCase());

      const matchStatus =
        status === "Tất cả"
          ? true
          : trip.status === status;

      return matchSearch && matchStatus;
    });
  }, [trips, search, status]);

  const completedCount = trips.filter(
    (t) => t.status === "COMPLETED"
  ).length;

  const runningCount = trips.filter(
    (t) =>
      t.status === "RUNNING" ||
      t.status === "DELIVERING"
  ).length;

  const createdCount = trips.filter(
    (t) =>
      t.status === "CREATED" ||
      t.status === "ASSIGNED"
  ).length;

  return (
    <div className="space-y-7">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          icon={<Truck />}
          title="Tổng chuyến xe"
          value={trips.length}
          color="blue"
        />

        <StatCard
          icon={<Clock />}
          title="Đang chuẩn bị"
          value={createdCount}
          color="yellow"
        />

        <StatCard
          icon={<Truck />}
          title="Đang vận chuyển"
          value={runningCount}
          color="orange"
        />

        <StatCard
          icon={<CheckCircle />}
          title="Hoàn thành"
          value={completedCount}
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
              placeholder="Tìm kiếm chuyến xe..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

          <Filter
            className="text-slate-500"
            size={22}
          />

          <select
            className="border border-slate-300 rounded-xl px-5 py-3 outline-none w-[220px]"
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
          >
            <option>Tất cả</option>
            <option value="CREATED">
              Đang chuẩn bị
            </option>
            <option value="RUNNING">
              Đang vận chuyển
            </option>
            <option value="COMPLETED">
              Hoàn thành
            </option>
          </select>
        </div>

        <button
          onClick={() => {
            setForm(emptyForm);
            setOpenCreate(true);
          }}
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"
        >
          <Plus size={20} />
          Tạo chuyến mới
        </button>
      </div>

      <div className="space-y-5">
        {filteredTrips.map((trip) => (
          <TripCard key={trip.id} trip={trip} />
        ))}

        {filteredTrips.length === 0 && (
          <div className="bg-white rounded-2xl border p-8 text-center text-slate-500">
            Không có chuyến xe nào
          </div>
        )}
      </div>

      {openCreate && (
        <CreateTripModal
          form={form}
          setForm={setForm}
          routes={routes}
          onClose={() => setOpenCreate(false)}
          onSubmit={handleCreateTrip}
        />
      )}
    </div>
  );
}

function TripCard({
  trip,
}: {
  trip: Trip;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-7 flex justify-between gap-8">
      <div className="flex gap-5">
        <div
          className={`w-14 h-14 rounded-xl flex items-center justify-center ${getStatusIconBg(
            trip.status
          )}`}
        >
          {getStatusIcon(trip.status)}
        </div>

        <div>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-2xl font-bold text-slate-900">
              {trip.tripCode}
            </h2>

            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusStyle(
                trip.status
              )}`}
            >
              {formatStatus(trip.status)}
            </span>
          </div>

          <div className="space-y-3 text-slate-700">
            <p className="flex items-center gap-2">
              <Truck
                size={18}
                className="text-slate-500"
              />

              Xe:
              <b className="text-slate-900">
                {trip.plateNumber}
              </b>
            </p>

            <p className="flex items-center gap-2">
              <MapPin
                size={18}
                className="text-slate-500"
              />

              {trip.routeName || "Chưa có tuyến"}
            </p>

            <p className="flex items-center gap-2">
              <User
                size={18}
                className="text-slate-500"
              />

              Tài xế:
              <b>{trip.driverName}</b>
            </p>

            <p className="flex items-center gap-2">
              <Clock
                size={18}
                className="text-slate-500"
              />

              Khởi hành:
              {formatDateTime(
                trip.departureTime
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between items-end">
        <button className="text-slate-500">
          <Eye size={22} />
        </button>

        <div className="text-right">
          <p className="text-slate-500 text-sm">
            Trạng thái
          </p>

          <p className="font-bold text-lg">
            {formatStatus(trip.status)}
          </p>
        </div>
      </div>
    </div>
  );
}

function CreateTripModal({
  form,
  setForm,
  routes,
  onClose,
  onSubmit,
}: {
  form: CreateTripRequest;

  setForm: React.Dispatch<
    React.SetStateAction<CreateTripRequest>
  >;

  routes: RouteItem[];

  onClose: () => void;

  onSubmit: () => void;
}) {
  const [orders, setOrders] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<
    VehicleSuggestion[]
  >([]);

  useEffect(() => {
    if (form.routeId) {
      loadOrders();
      loadVehicles();
    }
  }, [form.routeId]);

  const loadOrders = async () => {
    try {
      const data =
        await tripService.getPendingOrders(
          form.routeId
        );

      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  };

  const loadVehicles = async () => {
    try {
      const data =
        await tripService.suggestVehicles(
          form.routeId
        );

      setVehicles(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleOrder = (id: number) => {
    const exists = form.orderIds.includes(id);

    if (exists) {
      setForm({
        ...form,
        orderIds: form.orderIds.filter(
          (x) => x !== id
        ),
      });
    } else {
      setForm({
        ...form,
        orderIds: [...form.orderIds, id],
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-start pt-10">
      <div className="bg-white w-[1200px] max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Truck className="text-orange-600" />

            Tạo chuyến xe mới
          </h2>

          <button
            onClick={onClose}
            className="text-3xl text-slate-500"
          >
            ×
          </button>
        </div>

        <div className="p-6 grid grid-cols-2 gap-8">
          <div>
            <Select
              label="Tuyến đường"
              value={form.routeId}
              onChange={(v) =>
                setForm({
                  ...form,
                  routeId: Number(v),
                })
              }
            >
              <option value={0}>
                -- Chọn tuyến --
              </option>

              {routes.map((route) => (
                <option
                  key={route.id}
                  value={route.id}
                >
                  {route.routeName}
                </option>
              ))}
            </Select>

            <div className="mt-6">
              <label className="text-sm font-semibold text-slate-700">
                Thời gian khởi hành
              </label>

              <input
                type="datetime-local"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 mt-1 outline-none focus:ring-2 focus:ring-orange-300"
                value={form.departureTime}
                onChange={(e) =>
                  setForm({
                    ...form,
                    departureTime:
                      e.target.value,
                  })
                }
              />
            </div>

            <div className="mt-8">
              <h3 className="font-bold text-lg mb-4">
                Đơn hàng phù hợp
              </h3>

              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {orders.map((order) => {
                  const checked =
                    form.orderIds.includes(
                      order.id
                    );

                  return (
                    <label
                      key={order.id}
                      className={`border rounded-xl p-4 flex gap-4 cursor-pointer ${
                        checked
                          ? "border-orange-500 bg-orange-50"
                          : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() =>
                          toggleOrder(order.id)
                        }
                      />

                      <div>
                        <p className="font-bold">
                          {order.orderCode}
                        </p>

                        <p className="text-sm text-slate-600">
                          📦 {order.cargoType}
                        </p>

                        <p className="text-sm text-slate-600">
                          ⚖ {order.weight} tấn
                        </p>

                        <p className="text-sm text-slate-600">
                          📍 {order.pickupAddress}
                        </p>

                        <p className="text-sm text-slate-600">
                          🎯{" "}
                          {order.deliveryAddress}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">
              Xe phù hợp
            </h3>

            <div className="space-y-4">
              {vehicles.map((vehicle) => {
                const active =
                  form.vehicleId ===
                  vehicle.vehicleId;

                return (
                  <div
                    key={vehicle.vehicleId}
                    onClick={() =>
                      setForm({
                        ...form,
                        vehicleId:
                          vehicle.vehicleId,
                      })
                    }
                    className={`border rounded-2xl p-5 cursor-pointer transition ${
                      active
                        ? "border-orange-500 bg-orange-50"
                        : "hover:border-orange-300"
                    }`}
                  >
                    <div className="flex gap-4">
                      <div className="bg-orange-100 text-orange-600 p-3 rounded-xl h-fit">
                        <Truck size={22} />
                      </div>

                      <div>
                        <h4 className="font-bold text-lg">
                          {
                            vehicle.plateNumber
                          }
                        </h4>

                        <p className="text-slate-600">
                          {
                            vehicle.vehicleType
                          }
                        </p>

                        <p className="text-slate-600">
                          Tải trọng:{" "}
                          {
                            vehicle.capacity
                          }{" "}
                          tấn
                        </p>

                        <p className="text-slate-600">
                          Tài xế:{" "}
                          {
                            vehicle.driverName
                          }
                        </p>

                        <p className="text-slate-600">
                          Vị trí:
                          {" "}
                          {
                            vehicle.currentLocation
                          }
                        </p>

                        <span className="inline-block mt-3 bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm">
                          Sẵn sàng
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {vehicles.length === 0 && (
                <div className="border rounded-2xl p-6 text-slate-500">
                  Không có xe phù hợp
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl border"
          >
            Hủy
          </button>

          <button
            onClick={onSubmit}
            className="px-6 py-3 rounded-xl bg-orange-600 text-white font-bold"
          >
            Tạo chuyến xe
          </button>
        </div>
      </div>
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
      <label className="text-sm font-semibold text-slate-700">
        {label}
      </label>

      <select
        className="w-full border border-slate-300 rounded-xl px-4 py-3 mt-1 outline-none focus:ring-2 focus:ring-orange-300"
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
      >
        {children}
      </select>
    </div>
  );
}

function formatDateTime(date: string) {
  if (!date) return "";

  return new Date(date).toLocaleString(
    "vi-VN"
  );
}

function formatStatus(status: string) {
  if (
    status === "CREATED" ||
    status === "ASSIGNED"
  )
    return "Đang chuẩn bị";

  if (
    status === "RUNNING" ||
    status === "DELIVERING"
  )
    return "Đang vận chuyển";

  if (status === "COMPLETED")
    return "Hoàn thành";

  return status;
}

function getStatusStyle(status: string) {
  if (status === "COMPLETED")
    return "bg-green-100 text-green-700";

  if (
    status === "RUNNING" ||
    status === "DELIVERING"
  )
    return "bg-orange-100 text-orange-700";

  return "bg-yellow-100 text-yellow-700";
}

function getStatusIconBg(status: string) {
  if (status === "COMPLETED")
    return "bg-green-100 text-green-600";

  if (
    status === "RUNNING" ||
    status === "DELIVERING"
  )
    return "bg-orange-100 text-orange-600";

  return "bg-yellow-100 text-yellow-600";
}

function getStatusIcon(status: string) {
  if (status === "COMPLETED")
    return <CheckCircle size={24} />;

  if (
    status === "RUNNING" ||
    status === "DELIVERING"
  )
    return <Truck size={24} />;

  return <Clock size={24} />;
}