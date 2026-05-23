import {
  Bell,
  Clock3,
  Map,
  Route,
  Truck,
  X,
  Navigation,
} from "lucide-react";

import {
  Circle,
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import L from "leaflet";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

import { gpsService } from "../services/gpsService";
import { tripService } from "../services/tripService";

import type {
  AlertDTO,
  GpsDTO,
  GpsHistoryDTO,
} from "../types/gps";

import type { Trip } from "../types/trip";

import IncidentPage from "./IncidentPage";

/* ========================= */
/* FIX LEAFLET */
/* ========================= */

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* ========================= */
/* VEHICLE ICON */
/* ========================= */

const activeVehicleIcon = new L.Icon({
  iconUrl:
    "https://cdn-icons-png.flaticon.com/512/3448/3448339.png",
  iconSize: [52, 52],
  iconAnchor: [26, 52],
  popupAnchor: [0, -40],
});

/* ========================= */
/* AUTO FLY MAP */
/* ========================= */

function FlyToVehicle({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();

  useEffect(() => {
    if (!lat || !lng || lat === 0 || lng === 0) return;

    map.flyTo([lat, lng], 13, { duration: 1.5 });
  }, [lat, lng, map]);

  return null;
}

/* ========================= */
/* MAIN PAGE */
/* ========================= */

export default function TransportTrackingPage() {
  /* ========================= */
  /* TAB STATE */
  /* ========================= */

  const [tab, setTab] = useState<"tracking" | "incident">("tracking");

  /* ========================= */
  /* STATES */
  /* ========================= */

  const [trips, setTrips] = useState<Trip[]>([]);
  const [tripId, setTripId] = useState<number>(0);

  const [gps, setGps] = useState<GpsDTO | null>(null);
  const [history, setHistory] = useState<GpsHistoryDTO[]>([]);
  const [alerts, setAlerts] = useState<AlertDTO[]>([]);

  const [loading, setLoading] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);

  /* ========================= */
  /* VALID GPS */
  /* ========================= */

  const hasValidGps =
    gps &&
    gps.lat &&
    gps.lng &&
    gps.lat !== 0 &&
    gps.lng !== 0;

  /* ========================= */
  /* LOAD TRIPS */
  /* ========================= */

  const loadTrips = async () => {
    try {
      setLoading(true);

      const data = await tripService.getAll();
      setTrips(data);

      if (data?.length > 0) {
        setTripId(data[0].id);
      }
    } catch (err) {
      console.error("Load trips error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrips();
  }, []);

  /* ========================= */
  /* LOAD HISTORY */
  /* ========================= */

  const loadHistory = async () => {
    if (!tripId) return;

    try {
      const data = await gpsService.getHistory(tripId);
      setHistory(data);

      if (data?.length > 0) {
        const latest = data[data.length - 1];

        if (latest.lat && latest.lng) {
          setGps({
            tripId: latest.tripId,
            vehicleId: latest.vehicleId,
            lat: latest.lat,
            lng: latest.lng,
            time: latest.recordedAt,
            distanceKm: 0,
            speed: 0,
          });
        }
      }
    } catch (err) {
      console.error("Load history error:", err);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [tripId]);

  /* ========================= */
  /* WEBSOCKET */
  /* ========================= */

  useEffect(() => {
    if (!tripId) return;

    const client = new Client({
      webSocketFactory: () =>
        new SockJS("http://localhost:8080/ws"),

      reconnectDelay: 5000,

      onConnect: () => {
        console.log("WebSocket connected");

        /* GPS */
        client.subscribe(`/topic/gps/${tripId}`, (message) => {
          const data: GpsDTO = JSON.parse(message.body);

          if (!data.lat || !data.lng) return;

          setGps(data);

          setHistory((prev) => [
            ...prev,
            {
              id: Date.now(),
              tripId: data.tripId,
              vehicleId: data.vehicleId,
              lat: data.lat,
              lng: data.lng,
              recordedAt: data.time,
            },
          ]);
        });

        /* ALERTS */
        client.subscribe("/topic/alerts", (message) => {
          const alert: AlertDTO = JSON.parse(message.body);

          if (alert.tripId !== tripId) return;

          setAlerts((prev) => [alert, ...prev]);
        });
      },
    });

    client.activate();

    return () => {
      if (client.active) client.deactivate();
    };
  }, [tripId]);

  /* ========================= */
  /* POLYLINE */
  /* ========================= */

  const polyline = useMemo(() => {
    return history
      .filter((i) => i.lat !== 0 && i.lng !== 0)
      .map((i) => [i.lat, i.lng] as [number, number]);
  }, [history]);

  /* ========================= */
  /* CENTER MAP */
  /* ========================= */

  const center: [number, number] =
    hasValidGps ? [gps!.lat, gps!.lng] : [10.7769, 106.7009];

  /* ========================= */
  /* SELECTED TRIP */
  /* ========================= */

  const selectedTrip = trips.find((t) => t.id === tripId);

  /* ========================= */
  /* RENDER */
  /* ========================= */

  return (
    <div className="space-y-6 relative">

      {/* HEADER + TAB */}
      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {tab === "tracking"
              ? "Theo dõi vận tải"
              : "Ghi nhận sự cố"}
          </h1>

          <p className="text-slate-500 mt-1">
            {tab === "tracking"
              ? "GPS realtime & lịch sử hành trình"
              : "Quản lý sự cố chuyến đi"}
          </p>
        </div>

        <div className="flex items-center gap-3">

          {/* TAB SWITCH */}
          <div className="flex bg-slate-100 rounded-xl p-1">

            <button
              onClick={() => setTab("tracking")}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                tab === "tracking"
                  ? "bg-white shadow"
                  : "text-slate-500"
              }`}
            >
              Theo dõi
            </button>

            <button
              onClick={() => setTab("incident")}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                tab === "incident"
                  ? "bg-white shadow"
                  : "text-slate-500"
              }`}
            >
              Sự cố
            </button>

          </div>

        </div>

      </div>

      {/* ========================= */}
      {/* TAB 1: TRACKING */}
      {/* ========================= */}

      {tab === "tracking" && (
        <>
        
        {/* TRIP SELECT */}
            <div className="flex items-center justify-end mb-4">

            <select
                value={tripId}
                onChange={(e) => setTripId(Number(e.target.value))}
                className="border border-slate-300 rounded-xl px-4 py-3 min-w-[320px] bg-white"
            >

                {loading && (
                <option>Loading...</option>
                )}

                {!loading &&
                trips.map((trip) => (
                    <option key={trip.id} value={trip.id}>
                    {trip.tripCode} | {trip.plateNumber}
                    </option>
                ))
                }

            </select>

            </div>
          {/* STATS */}
          <div className="grid grid-cols-4 gap-5">

            <StatCard
              title="Xe theo dõi"
              value={gps ? 1 : 0}
              icon={<Truck />}
              color="bg-blue-100 text-blue-600"
            />

            <StatCard
              title="Tổng km"
              value={gps?.distanceKm?.toFixed(2) || 0}
              icon={<Route />}
              color="bg-orange-100 text-orange-600"
            />

            <StatCard
              title="Cảnh báo"
              value={alerts.length}
              icon={<Bell />}
              color="bg-red-100 text-red-600"
            />

            <StatCard
              title="GPS records"
              value={history.length}
              icon={<Clock3 />}
              color="bg-green-100 text-green-600"
            />

          </div>

          {/* MAP + HISTORY */}
          <div className="grid grid-cols-2 gap-6">

            {/* MAP */}
            <div className="bg-white rounded-3xl border overflow-hidden">

              <div className="p-5 border-b flex justify-between">
                <div className="flex items-center gap-2">
                  <Map />
                  <h2 className="font-bold">GPS realtime</h2>
                </div>

                {selectedTrip && (
                  <span className="text-sm text-slate-500 flex items-center gap-2">
                    <Navigation size={16} />
                    {selectedTrip.tripCode}
                  </span>
                )}
              </div>

              <div className="h-[700px]">

                {!hasValidGps && (
                  <div className="h-full flex items-center justify-center text-slate-400">
                    Chưa có GPS
                  </div>
                )}

                {hasValidGps && (
                  <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }}>

                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                    <FlyToVehicle lat={gps!.lat} lng={gps!.lng} />

                    <Circle
                      center={[gps!.lat, gps!.lng]}
                      radius={5000}
                    />

                    <Marker position={[gps!.lat, gps!.lng]} icon={activeVehicleIcon}>
                      <Popup>
                        Xe #{gps!.vehicleId}
                      </Popup>
                    </Marker>

                    {polyline.length > 0 && (
                      <Polyline positions={polyline} />
                    )}

                  </MapContainer>
                )}

              </div>
            </div>

            {/* HISTORY */}
            <div className="bg-white rounded-3xl border overflow-hidden">

              <div className="p-5 border-b">
                <h2 className="font-bold">Lịch sử</h2>
              </div>

              <div className="h-[700px] overflow-auto">

                <table className="w-full">

                  <thead className="bg-slate-50 sticky top-0">
                    <tr>
                      <th className="p-4">Time</th>
                      <th className="p-4">Lat</th>
                      <th className="p-4">Lng</th>
                      <th className="p-4">Vehicle</th>
                    </tr>
                  </thead>

                  <tbody>
                    {history.map((h) => (
                      <tr key={h.id} className="border-t">
                        <td className="p-4">
                          {new Date(h.recordedAt).toLocaleString("vi-VN")}
                        </td>
                        <td className="p-4">{h.lat}</td>
                        <td className="p-4">{h.lng}</td>
                        <td className="p-4">#{h.vehicleId}</td>
                      </tr>
                    ))}
                  </tbody>

                </table>

              </div>

            </div>

          </div>
        </>
      )}

      {/* ========================= */}
      {/* TAB 2: INCIDENT */}
      {/* ========================= */}

      {tab === "incident" && <IncidentPage />}

    </div>
  );
}

/* ========================= */
/* COMPONENTS */
/* ========================= */

function StatCard({
  title,
  value,
  icon,
  color,
}: any) {
  return (
    <div className="bg-white rounded-3xl border p-6">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        {icon}
      </div>

      <h2 className="text-2xl font-bold mt-3">{value}</h2>
      <p className="text-sm text-slate-500">{title}</p>
    </div>
  );
}