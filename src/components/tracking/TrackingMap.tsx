// src/pages/TransportTrackingPage.tsx

import {
  Bell,
  Clock3,
  Map,
  Navigation,
  Route,
  Truck,
} from "lucide-react";

import {
  Circle,
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
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

import { gpsService } from "../../services/gpsService";
import { tripService } from "../../services/tripService";

import type {
  AlertDTO,
  GpsDTO,
  GpsHistoryDTO,
} from "../../types/gps";

import type {
  Trip,
} from "../../types/trip";

import FlyToVehicle from "../../components/tracking/FlyToVehicle";
import StatCard from "../../components/tracking/StatCard";
import AlertPanel from "../../components/tracking/AlertSidebar";
import HistoryTable from "../../components/tracking/HistoryTable";
import IncidentTab from "../../components/tracking/IncidentTab";

/* ========================= */
/* FIX LEAFLET */
/* ========================= */

delete (L.Icon.Default.prototype as any)
  ._getIconUrl;

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

const activeVehicleIcon =
  new L.Icon({
    iconUrl:
      "https://cdn-icons-png.flaticon.com/512/3448/3448339.png",

    iconSize: [52, 52],

    iconAnchor: [26, 52],

    popupAnchor: [0, -40],
  });

export default function TransportTrackingPage() {

  /* ========================= */
  /* STATES */
  /* ========================= */

  const [activeTab,
    setActiveTab] =
    useState<
      "gps" | "incident"
    >("gps");

  const [trips,
    setTrips] =
    useState<Trip[]>([]);

  const [tripId,
    setTripId] =
    useState<number>(0);

  const [gps,
    setGps] =
    useState<GpsDTO | null>(
      null
    );

  const [history,
    setHistory] =
    useState<
      GpsHistoryDTO[]
    >([]);

  const [alerts,
    setAlerts] =
    useState<
      AlertDTO[]
    >([]);

  const [loading,
    setLoading] =
    useState(false);

  const [showAlerts,
    setShowAlerts] =
    useState(false);

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

  const loadTrips =
    async () => {

      try {

        setLoading(
          true
        );

        const data =
          await tripService.getAll();

        setTrips(data);

        if (
          data &&
          data.length > 0
        ) {

          setTripId(
            data[0].id
          );
        }

      } catch (err) {

        console.error(
          "Load trips error:",
          err
        );

      } finally {

        setLoading(
          false
        );
      }
    };

  useEffect(() => {

    loadTrips();

  }, []);

  /* ========================= */
  /* LOAD HISTORY */
  /* ========================= */

  const loadHistory =
    async () => {

      if (!tripId)
        return;

      try {

        const data =
          await gpsService.getHistory(
            tripId
          );

        setHistory(
          data
        );

        if (
          data.length > 0
        ) {

          const latest =
            data[
              data.length - 1
            ];

          if (
            latest.lat &&
            latest.lng &&
            latest.lat !== 0 &&
            latest.lng !== 0
          ) {

            setGps({
              tripId:
                latest.tripId,

              vehicleId:
                latest.vehicleId,

              lat:
                latest.lat,

              lng:
                latest.lng,

              time:
                latest.recordedAt,

              distanceKm:
                0,

              speed:
                0,
            });
          }
        }

      } catch (err) {

        console.error(
          "Load history error:",
          err
        );
      }
    };

  useEffect(() => {

    loadHistory();

  }, [tripId]);

  /* ========================= */
  /* WEBSOCKET */
  /* ========================= */

  useEffect(() => {

    if (!tripId)
      return;

    const client =
      new Client({

        webSocketFactory:
          () =>
            new SockJS(
              "http://localhost:8080/ws"
            ),

        reconnectDelay:
          5000,

        onConnect:
          () => {

            console.log(
              "WebSocket connected"
            );

            /* GPS */

            client.subscribe(
              `/topic/gps/${tripId}`,

              (
                message
              ) => {

                const data: GpsDTO =
                  JSON.parse(
                    message.body
                  );

                console.log(
                  "GPS realtime:",
                  data
                );

                if (
                  !data.lat ||
                  !data.lng ||
                  data.lat === 0 ||
                  data.lng === 0
                ) {
                  return;
                }

                setGps(
                  data
                );

                setHistory(
                  (
                    prev
                  ) => [

                    ...prev,

                    {
                      id:
                        Date.now(),

                      tripId:
                        data.tripId,

                      vehicleId:
                        data.vehicleId,

                      lat:
                        data.lat,

                      lng:
                        data.lng,

                      recordedAt:
                        data.time,
                    },
                  ]
                );
              }
            );

            /* ALERT */

            client.subscribe(
              "/topic/alerts",

              (
                message
              ) => {

                const alert: AlertDTO =
                  JSON.parse(
                    message.body
                  );

                if (
                  alert.tripId !==
                  tripId
                ) {
                  return;
                }

                setAlerts(
                  (
                    prev
                  ) => [
                    alert,
                    ...prev,
                  ]
                );
              }
            );
          },
      });

    client.activate();

    return () => {

      if (
        client.active
      ) {

        client.deactivate();
      }
    };

  }, [tripId]);

  /* ========================= */
  /* POLYLINE */
  /* ========================= */

  const polyline =
    useMemo(() => {

      return history
        .filter(
          (
            item
          ) =>
            item.lat !== 0 &&
            item.lng !== 0
        )
        .map(
          (
            item
          ) => [

            item.lat,
            item.lng,

          ] as [
            number,
            number
          ]
        );

    }, [history]);

  /* ========================= */
  /* CENTER */
  /* ========================= */

  const center: [
    number,
    number
  ] =
    hasValidGps
      ? [
          gps!.lat,
          gps!.lng,
        ]
      : [
          10.7769,
          106.7009,
        ];

  /* ========================= */
  /* CURRENT TRIP */
  /* ========================= */

  const selectedTrip =
    trips.find(
      (
        item
      ) =>
        item.id ===
        tripId
    );

  return (

    <div className="space-y-6 relative">

      {/* HEADER */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold text-slate-900">
            Theo dõi vận tải
          </h1>

          <p className="text-slate-500 mt-1">
            GPS realtime & lịch sử hành trình
          </p>

        </div>

        <div className="flex items-center gap-4">

          {/* TAB */}

          <div className="bg-white border border-slate-200 rounded-2xl p-1 flex">

            <button
              onClick={() =>
                setActiveTab(
                  "gps"
                )
              }
              className={`px-5 py-2 rounded-xl font-medium transition ${
                activeTab ===
                "gps"
                  ? "bg-blue-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >

              GPS

            </button>

            <button
              onClick={() =>
                setActiveTab(
                  "incident"
                )
              }
              className={`px-5 py-2 rounded-xl font-medium transition ${
                activeTab ===
                "incident"
                  ? "bg-red-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >

              Sự cố

            </button>

          </div>

          {/* ALERT */}

          <button
            onClick={() =>
              setShowAlerts(
                true
              )
            }
            className="relative w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50"
          >

            <Bell />

            {alerts.length >
              0 && (

              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">

                {
                  alerts.length
                }

              </div>
            )}

          </button>

          {/* TRIP SELECT */}

          <select
            value={tripId}
            onChange={(
              e
            ) =>
              setTripId(
                Number(
                  e.target
                    .value
                )
              )
            }
            className="border border-slate-300 rounded-xl px-4 py-3 min-w-[320px] bg-white"
          >

            {loading && (
              <option>
                Loading...
              </option>
            )}

            {!loading &&
              trips.map(
                (
                  trip
                ) => (

                  <option
                    key={
                      trip.id
                    }
                    value={
                      trip.id
                    }
                  >

                    {
                      trip.tripCode
                    }
                    {" | "}
                    {
                      trip.plateNumber
                    }

                  </option>
                )
              )}

          </select>

        </div>

      </div>

      {/* INCIDENT TAB */}

      {activeTab ===
        "incident" && (
        <IncidentTab />
      )}

      {/* GPS TAB */}

      {activeTab ===
        "gps" && (

        <>

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
              value={
                gps?.distanceKm?.toFixed(
                  2
                ) || 0
              }
              icon={<Route />}
              color="bg-orange-100 text-orange-600"
            />

            <StatCard
              title="Cảnh báo"
              value={
                alerts.length
              }
              icon={<Bell />}
              color="bg-red-100 text-red-600"
            />

            <StatCard
              title="GPS records"
              value={
                history.length
              }
              icon={<Clock3 />}
              color="bg-green-100 text-green-600"
            />

          </div>

          {/* MAP + HISTORY */}

          <div className="grid grid-cols-2 gap-6">

            {/* MAP */}

            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">

              <div className="p-5 border-b border-slate-200 flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <Map />

                  <h2 className="font-bold text-lg">
                    GPS realtime
                  </h2>

                </div>

                {selectedTrip && (

                  <div className="text-sm text-slate-500 flex items-center gap-2">

                    <Navigation size={16} />

                    <span>
                      {
                        selectedTrip.tripCode
                      }
                    </span>

                  </div>
                )}

              </div>

              <div className="h-[700px]">

                {!hasValidGps && (

                  <div className="h-full flex items-center justify-center text-slate-400 text-lg">

                    Chưa có dữ liệu GPS hợp lệ

                  </div>
                )}

                {hasValidGps && (

                  <MapContainer
                    center={center}
                    zoom={13}
                    minZoom={11}
                    maxZoom={18}
                    scrollWheelZoom={false}
                    wheelPxPerZoomLevel={999999}
                    doubleClickZoom={false}
                    dragging={true}
                    zoomControl={true}
                    style={{
                      height:
                        "100%",
                      width:
                        "100%",
                    }}
                  >

                    <TileLayer
                      attribution="&copy; OpenStreetMap"
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <FlyToVehicle
                      lat={
                        gps!.lat
                      }
                      lng={
                        gps!.lng
                      }
                    />

                    {/* 5KM */}

                    <Circle
                      center={[
                        gps!.lat,
                        gps!.lng,
                      ]}
                      radius={5000}
                      pathOptions={{
                        color:
                          "#2563eb",
                        fillColor:
                          "#60a5fa",
                        fillOpacity:
                          0.12,
                        weight: 2,
                      }}
                    />

                    {/* VEHICLE */}

                    <Marker
                      position={[
                        gps!.lat,
                        gps!.lng,
                      ]}
                      icon={
                        activeVehicleIcon
                      }
                    >

                      <Popup>

                        <div className="space-y-2 min-w-[220px]">

                          <p className="font-bold text-lg">

                            🚚 Xe #
                            {
                              gps!.vehicleId
                            }

                          </p>

                          <p>

                            Trip:
                            {" "}
                            {
                              selectedTrip?.tripCode
                            }

                          </p>

                          <p>

                            Biển số:
                            {" "}
                            {
                              selectedTrip?.plateNumber
                            }

                          </p>

                          <p>

                            Tài xế:
                            {" "}
                            {
                              selectedTrip?.driverName
                            }

                          </p>

                        </div>

                      </Popup>

                    </Marker>

                    {/* PATH */}

                    {polyline.length >
                      0 && (

                      <Polyline
                        positions={
                          polyline
                        }
                        pathOptions={{
                          color:
                            "#2563eb",
                          weight: 4,
                        }}
                      />
                    )}

                  </MapContainer>
                )}

              </div>

            </div>

            {/* HISTORY */}

            <HistoryTable
              history={
                history
              }
            />

          </div>

        </>
      )}

      {/* ALERT PANEL */}

      <AlertPanel
        open={
          showAlerts
        }
        onClose={() =>
          setShowAlerts(
            false
          )
        }
        alerts={alerts}
      />

    </div>
  );
}