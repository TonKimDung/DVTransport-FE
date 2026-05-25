// src/components/sem/SemDashboardWidget.tsx

import {
  BrainCircuit,
  BarChart3,
  Loader2,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

import ReactECharts from "echarts-for-react";

import { useSemAnalytics } from "../../hooks/useSemAnalytics";

export default function SemDashboardWidget() {
  const {
    loading,
    positiveCount,
    negativeCount,
    strongestDrivers,
    significantRelations,
    paths,
  } = useSemAnalytics();

  const pieData = [
    {
      name: "Tác động tích cực",
      value: positiveCount,
    },
    {
      name: "Tác động tiêu cực",
      value: negativeCount,
    },
  ];

  const barOption = {
    tooltip: {
      trigger: "axis",
    },

    grid: {
      left: 60,
      right: 20,
      top: 40,
      bottom: 120,
    },

    xAxis: {
      type: "category",

      data: strongestDrivers.map(
        (d) => d.sourceLabel
      ),

      axisLabel: {
        rotate: 20,
        color: "#64748b",
      },
    },

    yAxis: {
      type: "value",
    },

    series: [
      {
        type: "bar",

        barWidth: 50,

        data:
          strongestDrivers.map(
            (d) => ({
              value:
                d.effect,

              itemStyle: {
                color:
                  d.effect > 0
                    ? "#22c55e"
                    : "#ef4444",
              },
            })
          ),

        label: {
          show: true,
          position: "top",
          formatter: (
            params: any
          ) =>
            params.value.toFixed(
              2
            ),
        },
      },
    ],
  };

  const pieOption = {
    tooltip: {
      trigger: "item",
    },

    legend: {
      bottom: 0,
    },

    color: [
      "#22c55e",
      "#ef4444",
    ],

    series: [
      {
        type: "pie",

        radius: [
          "45%",
          "75%",
        ],

        data: pieData,

        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
      },
    ],
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-sm p-10 flex items-center justify-center h-[500px]">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* HERO HEADER
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-600 p-8 text-white shadow-sm">

        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/10 blur-3xl" />

        <div className="absolute bottom-0 left-0 w-44 h-44 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

          <div>

            <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 backdrop-blur px-4 py-2">

              <Sparkles className="w-4 h-4" />

              <span className="text-sm font-medium">
                SEM Analytics Dashboard
              </span>

            </div>

            <h1 className="text-3xl lg:text-4xl font-bold mt-5">
              Dashboard phân tích SEM
            </h1>

            <p className="mt-3 text-indigo-100 max-w-2xl leading-relaxed">
              Theo dõi tác động giữa các yếu tố vận tải,
              doanh thu và giữ chân khách hàng bằng mô hình
              phân tích cấu trúc SEM.
            </p>

          </div>

          <div className="hidden lg:flex items-center justify-center">

            <div className="w-28 h-28 rounded-full bg-white/10 backdrop-blur border border-white/10 flex items-center justify-center">
              <BrainCircuit className="w-14 h-14 text-white" />
            </div>

          </div>

        </div>

      </div> */}

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

        <div className="bg-white rounded-3xl p-6 shadow-sm border hover:shadow-md transition">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 text-sm">
                Quan hệ tích cực
              </p>

              <h2 className="text-4xl font-bold mt-2 text-green-600">
                {positiveCount}
              </h2>

            </div>

            <div className="bg-green-100 p-3 rounded-2xl">
              <TrendingUp className="text-green-600" />
            </div>

          </div>

        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border hover:shadow-md transition">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 text-sm">
                Quan hệ tiêu cực
              </p>

              <h2 className="text-4xl font-bold mt-2 text-red-600">
                {negativeCount}
              </h2>

            </div>

            <div className="bg-red-100 p-3 rounded-2xl">
              <TrendingDown className="text-red-600" />
            </div>

          </div>

        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border hover:shadow-md transition">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 text-sm">
                Tổng quan hệ SEM
              </p>

              <h2 className="text-4xl font-bold mt-2 text-indigo-600">
                {paths.length}
              </h2>

            </div>

            <div className="bg-indigo-100 p-3 rounded-2xl">
              <Activity className="text-indigo-600" />
            </div>

          </div>

        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border hover:shadow-md transition">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 text-sm">
                Quan hệ có ý nghĩa
              </p>

              <h2 className="text-4xl font-bold mt-2 text-orange-500">
                {significantRelations}
              </h2>

            </div>

            <div className="bg-orange-100 p-3 rounded-2xl">
              <AlertTriangle className="text-orange-500" />
            </div>

          </div>

        </div>

      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        <div className="bg-white rounded-3xl shadow-sm p-6 border hover:shadow-md transition">

          <div className="flex items-center gap-3 mb-5">

            <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center">
              <BarChart3 className="text-indigo-600" />
            </div>

            <div>

              <h2 className="text-xl font-bold text-slate-800">
                Các tác động mạnh nhất
              </h2>

              <p className="text-sm text-slate-500">
                Quan hệ ảnh hưởng lớn nhất trong hệ thống
              </p>

            </div>

          </div>

          <ReactECharts
            option={barOption}
            style={{
              height: 380,
            }}
          />

        </div>

        <div className="bg-white rounded-3xl shadow-sm p-6 border hover:shadow-md transition">

          <div className="flex items-center gap-3 mb-5">

            <div className="w-12 h-12 rounded-2xl bg-pink-100 flex items-center justify-center">
              <BrainCircuit className="text-pink-600" />
            </div>

            <div>

              <h2 className="text-xl font-bold text-slate-800">
                Phân bố tác động
              </h2>

              <p className="text-sm text-slate-500">
                So sánh tác động tích cực và tiêu cực
              </p>

            </div>

          </div>

          <ReactECharts
            option={pieOption}
            style={{
              height: 380,
            }}
          />

        </div>

      </div>

    </div>
  );
}