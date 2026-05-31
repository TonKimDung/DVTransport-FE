import { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { useNavigate } from "react-router-dom";

import {
  Network,
  Activity,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  BrainCircuit,
  LineChart,
  DollarSign,
} from "lucide-react";

import { useSemAnalytics } from "../hooks/useSemAnalytics";

const labelMap: Record<
  string,
  string
> = {
  new_vehicle_ratio:
    "Tỷ lệ xe mới",

  fuel_efficiency:
    "Hiệu suất nhiên liệu",

  maintenance_cost:
    "Chi phí bảo trì",

  ontime_rate:
    "Tỷ lệ đúng giờ",

  completed_trip_rate:
    "Tỷ lệ hoàn thành chuyến",

  empty_miles:
    "Quãng đường rỗng",

  incident_rate:
    "Tỷ lệ sự cố",

  driver_performance:
    "Hiệu suất tài xế",

  retention_rate:
    "Tỷ lệ giữ chân khách hàng",

  new_contracts:
    "Hợp đồng mới",

  avg_revenue:
    "Doanh thu trung bình",

  net_profit:
    "Lợi nhuận ròng",

  revenue_growth:
    "Tăng trưởng doanh thu",
};
const getLabel = (
  v: string
) => labelMap[v] || v;

export default function SemReport() {
  const {
    loading,
    data,
  } = useSemAnalytics();

  const navigate = useNavigate();
  const paths = useMemo(() => {
    if (!data?.estimates)
      return [];

    return data.estimates
      .filter(
        (e) => e.op === "~"
      )
      .map((e) => ({
        source: e.rval,
        target: e.lval,

        sourceLabel:
          getLabel(e.rval),

        targetLabel:
          getLabel(e.lval),

        effect: Number(
          Number(
            e.Estimate
          ).toFixed(3)
        ),

        pValue:
          e["p-value"] || 0,
      }));
  }, [data]);

  const positive =
    paths.filter(
      (p) => p.effect > 0
    ).length;

  const negative =
    paths.filter(
      (p) => p.effect < 0
    ).length;

  const significant =
    paths.filter(
      (p) => p.pValue < 0.05
    ).length;

  const lineOption = {
    tooltip: {
      trigger: "axis",
    },

    grid: {
      left: 50,
      right: 20,
      top: 40,
      bottom: 90,
    },

    xAxis: {
      type: "category",

      data:
        paths.map(
          (p) =>
            p.sourceLabel
        ),

      axisLabel: {
        rotate: 20,
      },
    },

    yAxis: {
      type: "value",
    },

    series: [
      {
        type: "line",

        smooth: true,

        symbolSize: 12,

        data:
          paths.map(
            (p) => p.effect
          ),

        lineStyle: {
          width: 4,
        },

        areaStyle: {},

        label: {
          show: true,
        },
      },
    ],
  };

  const graphOption = useMemo(() => {
  return {
    tooltip: {
      formatter: (
        params: any
      ) => {
        if (
          params.dataType ===
          "edge"
        ) {
          return `
            <div>
              <b>${getLabel(
                params.data.source
              )}</b>
              →
              <b>${getLabel(
                params.data.target
              )}</b>
              <br/>
              Hệ số:
              <b>${params.data.value.toFixed(
                3
              )}</b>
            </div>
          `;
        }

        return `
          <b>${getLabel(
            params.data.name
          )}</b>
        `;
      },
    },

    animation: true,

    series: [
      {
        type: "graph",

        layout: "none",

        // FIX 1
        roam: false,

        draggable: false,

        // FIX 2
        left: "center",
        top: "middle",

        // FIX 3
        zoom: 0.82,

        symbolSize: 85,

        label: {
          show: true,
          color: "#111827",
          fontSize: 13,
          fontWeight: 600,

          formatter: (
            params: any
          ) =>
            getLabel(
              params.data.name
            ),
        },

        data: [
        {
          name:
            "new_vehicle_ratio",
          x: 100,
          y: 160,
          itemStyle: {
            color:
              "#6366f1",
          },
        },

        {
          name:
            "fuel_efficiency",
          x: 350,
          y: 80,
          itemStyle: {
            color:
              "#06b6d4",
          },
        },

        {
          name:
            "maintenance_cost",
          x: 350,
          y: 260,
          itemStyle: {
            color:
              "#ef4444",
          },
        },

        {
          name:
            "ontime_rate",
          x: 600,
          y: 160,
          itemStyle: {
            color:
              "#8b5cf6",
          },
        },

        {
          name:
            "completed_trip_rate",
          x: 850,
          y: 80,
          itemStyle: {
            color:
              "#14b8a6",
          },
        },

        {
          name:
            "empty_miles",
          x: 850,
          y: 260,
          itemStyle: {
            color:
              "#f97316",
          },
        },

        {
          name:
            "incident_rate",
          x: 600,
          y: 360,
          itemStyle: {
            color:
              "#dc2626",
          },
        },

        {
          name:
            "driver_performance",
          x: 850,
          y: 380,
          itemStyle: {
            color:
              "#22c55e",
          },
        },

        {
          name:
            "retention_rate",
          x: 1100,
          y: 180,
          itemStyle: {
            color:
              "#10b981",
          },
        },

        {
          name:
            "new_contracts",
          x: 1100,
          y: 380,
          itemStyle: {
            color:
              "#84cc16",
          },
        },

        {
          name:
            "avg_revenue",
          x: 1400,
          y: 180,
          itemStyle: {
            color:
              "#0ea5e9",
          },
        },

        {
          name:
            "net_profit",
          x: 1650,
          y: 180,
          itemStyle: {
            color:
              "#f59e0b",
          },
        },

        {
          name:
            "revenue_growth",
          x: 1650,
          y: 380,
          itemStyle: {
            color:
              "#ec4899",
          },
        },
      ],

      links:
        data?.chart?.edges?.map(
          (e) => ({
            source:
              e.source,

            target:
              e.target,

            value:
              e.weight,

            lineStyle: {
              width:
                e.visual_width ??
                Math.abs(
                  e.weight
                ) *
                  3 +
                  2,

              color:
                e.weight > 0
                  ? "#22c55e"
                  : "#ef4444",

              curveness:
                0.2,

              opacity:
                0.9,
            },

            label: {
              show:
                true,

              formatter:
                Number(
                  e.weight
                ).toFixed(
                  2
                ),

              fontSize:
                12,

              backgroundColor:
                "#fff",

              padding: [
                4,
                8,
              ],

              borderRadius:
                8,

              color:
                e.weight >
                0
                  ? "#166534"
                  : "#991b1b",
            },
          })
        ) || [],

        edgeSymbol: [
          "circle",
          "arrow",
        ],

        edgeSymbolSize: [6, 14],
      },
    ],
  };
}, [data]);

  if (loading) {
    return (
      <div className="h-[500px] flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-6">
        {/* REPORT TABS */}
        <div className="flex items-center justify-between">

        <div>
            <h1 className="text-3xl font-bold text-slate-800">
            Báo cáo phân tích
            </h1>

            <p className="text-slate-500 mt-1">
            Theo dõi hiệu suất vận hành,
            doanh thu và quan hệ SEM
            </p>
        </div>

        <div className="bg-white border rounded-2xl p-1 shadow-sm flex items-center gap-1">
            {/* TAB SEM */}
            <button
            className="
                flex items-center gap-2
                px-5 py-3
                rounded-xl
                bg-indigo-600
                text-white
                font-medium
                shadow-sm
            "
            >
            <BrainCircuit className="w-4 h-4" />

            SEM
            </button>

            {/* TAB REVENUE */}
            <button
            onClick={() =>
                navigate("/admin/revenue-report")
            }
            className="
                flex items-center gap-2
                px-5 py-3
                rounded-xl
                text-slate-600
                hover:bg-slate-100
                transition
                font-medium
            "
            >
            <DollarSign className="w-4 h-4" />

            Doanh thu
            </button>
        </div>

        </div>
      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        <div className="bg-white rounded-3xl border p-6 shadow-sm">

          <TrendingUp className="text-green-600 mb-3" />

          <p className="text-slate-500">
            Quan hệ tích cực
          </p>

          <h2 className="text-4xl font-bold text-green-600">
            {positive}
          </h2>

        </div>

        <div className="bg-white rounded-3xl border p-6 shadow-sm">

          <TrendingDown className="text-red-600 mb-3" />

          <p className="text-slate-500">
            Quan hệ tiêu cực
          </p>

          <h2 className="text-4xl font-bold text-red-600">
            {negative}
          </h2>

        </div>

        <div className="bg-white rounded-3xl border p-6 shadow-sm">

          <AlertTriangle className="text-orange-500 mb-3" />

          <p className="text-slate-500">
            Quan hệ có ý nghĩa
          </p>

          <h2 className="text-4xl font-bold text-orange-500">
            {significant}
          </h2>

        </div>

      </div>

      {/* LINE */}
      <div className="bg-white rounded-3xl border p-6 shadow-sm">

        <div className="flex items-center gap-3 mb-5">

          <LineChart className="text-indigo-600" />

          <div>
            <h2 className="font-bold text-xl">
              Xu hướng hệ số tác động
            </h2>

            <p className="text-slate-500 text-sm">
              Giá trị càng lớn thì
              mức ảnh hưởng càng mạnh
            </p>
          </div>

        </div>

        <ReactECharts
          option={lineOption}
          style={{
            height: 420,
          }}
        />

      </div>

      {/* NETWORK */}
      <div className="bg-white rounded-3xl border p-6 shadow-sm">

        <div className="flex items-center gap-3 mb-5">

          <Network className="text-blue-600" />

          <div>

            <h2 className="font-bold text-xl">
              Sơ đồ quan hệ SEM
            </h2>

            <p className="text-sm text-slate-500">
              Mũi tên xanh là tác động
              tích cực, đỏ là tiêu cực
            </p>

          </div>

        </div>

        <ReactECharts
          option={graphOption}
          style={{
            height: 650,
          }}
        />

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl border p-6 shadow-sm overflow-auto">

        <h2 className="font-bold text-xl mb-5">
          Bảng phân tích hệ số
        </h2>

        <table className="w-full">

          <thead>
            <tr className="border-b">
              <th className="text-left py-4">
                Quan hệ
              </th>
              <th className="text-left py-4">
                Hệ số
              </th>
              <th className="text-left py-4">
                P-value
              </th>
              <th className="text-left py-4">
                Ý nghĩa
              </th>
            </tr>
          </thead>

          <tbody>
            {paths.map(
              (p, i) => (
                <tr
                  key={i}
                  className="border-b"
                >
                  <td className="py-4">

                    <div className="flex items-center gap-2">

                      {p.sourceLabel}

                      <ArrowRight className="w-4 h-4" />

                      {p.targetLabel}

                    </div>

                  </td>

                  <td
                    className={`font-bold ${
                      p.effect > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {p.effect}
                  </td>

                  <td>
                    {(p.pValue|| 0) .toFixed(
                      5
                    )}
                  </td>

                  <td>

                    {p.pValue <
                    0.05 ? (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-xl text-sm">
                        Có ý nghĩa
                      </span>
                    ) : (
                      <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-xl text-sm">
                        Yếu
                      </span>
                    )}

                  </td>
                </tr>
              )
            )}
          </tbody>

        </table>

      </div>

      {/* AI BUSINESS INSIGHTS */}
    <div className="space-y-4">

    <div>

        <h2 className="text-2xl font-bold text-slate-800">
        Đề xuất tối ưu từ phân tích SEM
        </h2>

        <p className="text-slate-500 mt-1">
        Hệ thống tự động đề xuất
        hướng cải thiện hiệu quả
        vận hành dựa trên quan hệ dữ liệu.
        </p>

    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {data?.insights?.map(
        (
            item: any,
            idx: number
        ) => {

            const styles = {
            cost: {
                bg:
                "from-emerald-500 to-green-600",
                icon: "💰",
            },

            revenue: {
                bg:
                "from-indigo-200 to-blue-600",
                icon: "📈",
            },

            risk: {
                bg:
                "from-red-500 to-rose-600",
                icon: "⚠️",
            },

            customer: {
                bg:
                "from-pink-200 to-fuchsia-600",
                icon: "❤️",
            },

            general: {
                bg:
                "from-slate-600 to-slate-700",
                icon: "🧠",
            },
            };

            const style =
              styles[
                item.type as keyof typeof styles
              ] ??
              styles.general;

            return (
            <div
                key={idx}
                className={`bg-gradient-to-r ${style.bg} rounded-3xl p-6 text-white shadow-lg`}
            >

                <div className="flex items-center justify-between">

                <div className="text-4xl">
                    {
                    style.icon
                    }
                </div>

                <div className="text-sm bg-white/20 px-3 py-1 rounded-xl">
                    Impact{" "}
                    {
                    item.impact
                    }
                </div>

                </div>

                <h3 className="text-xl font-bold mt-5">
                {item.title}
                </h3>

                <p className="text-white/90 mt-3 leading-relaxed">
                {
                    item.description
                }
                </p>

            </div>
            );
        }
        )}

    </div>

    </div>

    </div>
  );
}