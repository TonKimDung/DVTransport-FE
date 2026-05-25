import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
  PieChart,
  BarChart3,
  ArrowLeft,
  BrainCircuit,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import ReactECharts from "echarts-for-react";

import {
  financialReportService,
  type FinancialReport,
} from "../services/financialReportService";

import {
  useNavigate,
} from "react-router-dom";

export default function RevenueReport() {
  const navigate =
    useNavigate();

  const today = new Date();

  const [month, setMonth] =
    useState(
      today.getMonth() + 1
    );

  const [year, setYear] =
    useState(
      today.getFullYear()
    );

  const [loading, setLoading] =
    useState(false);

  const [report, setReport] =
    useState<FinancialReport | null>(
      null
    );

  useEffect(() => {
    loadData();
  }, [month, year]);

  const loadData =
    async () => {
      try {
        setLoading(true);

        const data =
          await financialReportService.getMonthlyReport(
            month,
            year
          );

        setReport(data);
      } finally {
        setLoading(false);
      }
    };

  const pieOption = {
    tooltip: {
      trigger: "item",
    },

    legend: {
      bottom: 0,
    },

    series: [
      {
        type: "pie",

        radius: [
          "45%",
          "75%",
        ],

        data: [
          {
            name:
              "Nhiên liệu",
            value:
              report?.totalFuelCost ||
              0,
          },
          {
            name:
              "Chi phí chuyến",
            value:
              report?.totalTripExpense ||
              0,
          },
          {
            name:
              "Lương tài xế",
            value:
              report?.totalPayroll ||
              0,
          },
        ],
      },
    ],
  };

  const compareOption = {
    tooltip: {
      trigger: "axis",
    },

    xAxis: {
      type: "category",
      data: [
        "Doanh thu",
        "Chi phí",
        "Lợi nhuận",
      ],
    },

    yAxis: {
      type: "value",
    },

    series: [
      {
        type: "bar",

        barWidth: 60,

        data: [
          report?.totalRevenue,
          report?.totalCost,
          report?.profit,
        ],
      },
    ],
  };

  const insights = [];

  if (
    report &&
    report.totalFuelCost >
      report.totalCost *
        0.4
  ) {
    insights.push({
      title:
        "Chi phí nhiên liệu cao",
      desc:
        "Nên tối ưu tuyến đường hoặc giảm quãng đường chạy rỗng.",
    });
  }

  if (
    report &&
    report.profit > 0
  ) {
    insights.push({
      title:
        "Lợi nhuận tích cực",
      desc:
        "Hoạt động kinh doanh đang có lợi nhuận tốt.",
    });
  }

  if (
    report &&
    report.profit < 0
  ) {
    insights.push({
      title:
        "Cảnh báo thua lỗ",
      desc:
        "Chi phí đang vượt doanh thu.",
    });
  }

  return (
  <div className="space-y-6 p-6 bg-slate-50 min-h-screen">
    <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-5">
        {/* HEADER */}
        <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-5">

        {/* LEFT - TITLE */}
        <div>
            <h1 className="text-3xl font-bold text-slate-800">
            Báo cáo phân tích
            </h1>

            <p className="text-slate-500 mt-1">
            Theo dõi hiệu suất vận hành,
            doanh thu và quan hệ SEM
            </p>
        </div>

        {/* RIGHT */}
        <div className="flex flex-wrap items-end justify-end gap-4">

            {/* MONTH */}
            <div>
            <p className="text-sm font-medium text-slate-500 mb-2">
                Chọn tháng
            </p>

            <select
                value={month}
                onChange={(e) =>
                setMonth(
                    Number(e.target.value)
                )
                }
                className="
                border border-slate-200
                rounded-2xl
                px-4 py-3
                min-w-[160px]
                bg-white
                focus:outline-none
                focus:ring-2
                focus:ring-emerald-500
                "
            >
                {Array.from(
                { length: 12 },
                (_, i) => (
                    <option
                    key={i}
                    value={i + 1}
                    >
                    Tháng {i + 1}
                    </option>
                )
                )}
            </select>
            </div>

            {/* YEAR */}
            <div>
            <p className="text-sm font-medium text-slate-500 mb-2">
                Năm
            </p>

            <input
                type="number"
                value={year}
                onChange={(e) =>
                setYear(
                    Number(e.target.value)
                )
                }
                className="
                border border-slate-200
                rounded-2xl
                px-4 py-3
                w-[140px]
                bg-white
                focus:outline-none
                focus:ring-2
                focus:ring-emerald-500
                "
            />
            </div>

            {/* TAB */}
            <div className="bg-white border rounded-2xl p-1 shadow-sm flex items-center gap-1">

            {/* TAB SEM */}
            <button
                onClick={() =>
                navigate("/admin/reports")
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
                bg-emerald-600
                text-white
                font-medium
                shadow-sm
                "
            >
                <DollarSign className="w-4 h-4" />
                Doanh thu
            </button>

            </div>

        </div>
        </div>
    </div>
    {/* STATS */}
    <div className="grid md:grid-cols-3 gap-5">

      <StatCard
        title="Doanh thu"
        value={report?.totalRevenue}
        icon={<TrendingUp />}
        color="text-green-600"
        bg="bg-green-50"
      />

      <StatCard
        title="Chi phí"
        value={report?.totalCost}
        icon={<Wallet />}
        color="text-red-600"
        bg="bg-red-50"
      />

      <StatCard
        title="Lợi nhuận"
        value={report?.profit}
        icon={<DollarSign />}
        color="text-indigo-600"
        bg="bg-indigo-50"
      />

    </div>

    {/* CHARTS */}
    <div className="grid xl:grid-cols-2 gap-6">

      <div className="bg-white rounded-[32px] border border-slate-200 p-6 shadow-sm hover:shadow-md transition">

        <div className="flex items-center gap-4 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-pink-100 flex items-center justify-center">
            <PieChart className="text-pink-600" />
          </div>

          <div>
            <h2 className="font-bold text-xl text-slate-800">
              Cơ cấu chi phí
            </h2>

            <p className="text-sm text-slate-500">
              Tỷ trọng từng loại chi phí
            </p>
          </div>
        </div>

        <ReactECharts
          option={pieOption}
          style={{ height: 420 }}
        />
      </div>

      <div className="bg-white rounded-[32px] border border-slate-200 p-6 shadow-sm hover:shadow-md transition">

        <div className="flex items-center gap-4 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center">
            <BarChart3 className="text-indigo-600" />
          </div>

          <div>
            <h2 className="font-bold text-xl text-slate-800">
              So sánh tài chính
            </h2>

            <p className="text-sm text-slate-500">
              Doanh thu vs chi phí vs lợi nhuận
            </p>
          </div>
        </div>

        <ReactECharts
          option={compareOption}
          style={{ height: 420 }}
        />
      </div>

    </div>

    {/* INSIGHTS */}
    <div className="space-y-4">

      <div>
        <h2 className="text-2xl font-bold text-slate-800">
          Đề xuất tài chính
        </h2>

        <p className="text-slate-500 mt-1">
          Đề xuất cải thiện lợi nhuận dựa trên dữ liệu tháng đã chọn
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">

        {insights.map(
          (item, idx) => (
            <div
              key={idx}
              className="
                bg-white
                border border-slate-200
                rounded-[28px]
                p-6
                shadow-sm
                hover:shadow-md
                transition
              "
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center mb-4">
                💡
              </div>

              <h3 className="font-bold text-lg text-slate-800">
                {item.title}
              </h3>

              <p className="text-slate-500 mt-2 leading-relaxed">
                {item.desc}
              </p>
            </div>
          )
        )}

      </div>
    </div>

  </div>
);
}

function StatCard({
  title,
  value,
  icon,
  color,
}: any) {
  return (
    <div className="bg-white rounded-3xl border p-6 shadow-sm">

      <div className="flex justify-between">

        <div>
          <p className="text-slate-500">
            {title}
          </p>

          <h2
            className={`text-3xl font-bold mt-3 ${color}`}
          >
            {Number(
              value || 0
            ).toLocaleString(
              "vi-VN"
            )}
            ₫
          </h2>
        </div>

        <div
          className={`w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center ${color}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}