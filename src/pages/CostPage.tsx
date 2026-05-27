import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  Fuel,
  Plus,
  Search,
  Truck,
  Users,
  Wallet,
  X,
} from "lucide-react";

import StatCard from "../components/StatCard";
import { payrollService } from "../services/payrollService";
import { fuelService } from "../services/fuelService";
import { driverService } from "../services/driverService";
import { tripExpenseService } from "../services/tripExpenseService";
import type { TripExpense } from "../types/tripExpense";

import type { Payroll, PayrollCalculateRequest } from "../types/payroll";
import type { FuelTransaction } from "../types/fuel";
import type { Driver } from "../types/driver";

const emptyPayrollForm: PayrollCalculateRequest = {
  driverId: 0,
  month: new Date().getMonth() + 1,
  year: new Date().getFullYear(),
  bonusAmount: 0,
  penaltyAmount: 0,
};

export default function CostPage() {
  const [activeTab, setActiveTab] = useState<"payroll" | "statistic">("payroll");

  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [fuelTransactions, setFuelTransactions] = useState<FuelTransaction[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);

  const [search, setSearch] = useState("");
  const [openPayrollModal, setOpenPayrollModal] = useState(false);
  const [form, setForm] = useState<PayrollCalculateRequest>(emptyPayrollForm);
  const currentDate = new Date();
  const [tripExpenses, setTripExpenses] = useState<TripExpense[]>([]);

const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  useEffect(() => {
  loadData();
}, [selectedMonth, selectedYear]);

  const loadData = async () => {
  try {
    const [payrollData, fuelData, tripExpenseData, driverData] = await Promise.all([
  payrollService.getMonthly(selectedMonth, selectedYear),
  fuelService.getAll(),
  tripExpenseService.getAll(),
  driverService.getAll(),
]);

setPayrolls(Array.isArray(payrollData) ? payrollData : []);
setFuelTransactions(Array.isArray(fuelData) ? fuelData : []);
setTripExpenses(Array.isArray(tripExpenseData) ? tripExpenseData : []);
setDrivers(Array.isArray(driverData) ? driverData : []);
  } catch (error) {
    console.error(error);
    alert("Không thể tải dữ liệu chi phí");
  }
};

  const handleCalculatePayroll = async () => {
    try {
      if (!form.driverId) {
        alert("Vui lòng chọn tài xế");
        return;
      }

      if (!form.month || !form.year) {
        alert("Vui lòng nhập tháng và năm");
        return;
      }

      await payrollService.calculate(form);

      setOpenPayrollModal(false);
      setForm(emptyPayrollForm);
      loadData();
    } catch (error) {
      console.error(error);
      alert("Tính lương thất bại");
    }
  };

  const filteredPayrolls = useMemo(() => {
    return payrolls.filter((item) =>
      `${item.driverName} ${item.status}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [payrolls, search]);

  const totalPayroll = payrolls.reduce(
    (sum, item) => sum + Number(item.totalSalary || 0),
    0
  );

  const paidPayroll = payrolls.filter((item) =>
    ["PAID", "Đã thanh toán"].includes(item.status)
  ).length;

  const unpaidPayroll = payrolls.length - paidPayroll;

  const totalFuelCost = fuelTransactions.reduce(
    (sum, item) => sum + Number(item.totalAmount || 0),
    0
  );
  const totalTripExpense = tripExpenses.reduce(
  (sum, item) => sum + Number(item.amount || 0),
  0
);

const totalCost = totalPayroll + totalFuelCost + totalTripExpense;


  return (
    <div className="space-y-7">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 grid grid-cols-2 overflow-hidden">
        <button
          onClick={() => setActiveTab("payroll")}
          className={`py-5 font-bold ${
            activeTab === "payroll"
              ? "bg-orange-50 text-orange-600 border-b-2 border-orange-600"
              : "text-slate-700"
          }`}
        >
          Quản lý lương tài xế
        </button>

        <button
          onClick={() => setActiveTab("statistic")}
          className={`py-5 font-bold ${
            activeTab === "statistic"
              ? "bg-orange-50 text-orange-600 border-b-2 border-orange-600"
              : "text-slate-700"
          }`}
        >
          Thống kê chi phí
        </button>
      </div>

      {activeTab === "payroll" ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard icon={<Wallet />} title="Tổng chi phí tháng này" value={formatShortMoney(totalCost)} color="purple" />
            <StatCard icon={<Fuel />} title="Chi phí nhiên liệu" value={formatShortMoney(totalFuelCost)} color="orange" />
            <StatCard icon={<Truck />} title="Lương tài xế" value={formatShortMoney(totalPayroll)} color="green" />
            <StatCard icon={<FileText />} title="Chi phí chuyến đi" value={formatShortMoney(totalTripExpense)} color="blue" />
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 flex justify-between items-center gap-4">
            <div className="relative">
              <Search className="absolute top-3 left-3 text-slate-400" size={19} />
              <input
                className="w-[270px] border border-slate-300 rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-orange-300"
                placeholder="Tìm kiếm tài xế..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="border border-slate-300 rounded-xl px-4 py-3 outline-none"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                <option key={month} value={month}>
                  Tháng {month}
                </option>
              ))}
            </select>

            <input
              type="number"
              className="w-[120px] border border-slate-300 rounded-xl px-4 py-3 outline-none"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            />

            <button
              onClick={() => setOpenPayrollModal(true)}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"
            >
              <Plus size={20} />
              Tính lương
            </button>
          </div>

          <PayrollTable payrolls={filteredPayrolls} />

          {openPayrollModal && (
            <PayrollModal
              form={form}
              setForm={setForm}
              drivers={drivers}
              onClose={() => setOpenPayrollModal(false)}
              onSubmit={handleCalculatePayroll}
            />
          )}
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard icon={<Wallet />} title="Tổng chi phí tháng này" value={formatShortMoney(totalCost)} color="purple" />
            <StatCard icon={<Fuel />} title="Chi phí nhiên liệu" value={formatShortMoney(totalFuelCost)} color="orange" />
            <StatCard icon={<Truck />} title="Lương tài xế" value={formatShortMoney(totalPayroll)} color="green" />
            <StatCard icon={<FileText />} title="Số giao dịch" value={fuelTransactions.length + payrolls.length} color="blue" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CostSummary
              title="Chi phí theo danh mục"
              fuelCost={totalFuelCost}
              payrollCost={totalPayroll}
              tripExpenseCost={totalTripExpense}
            />
            <RecentCost
              fuelTransactions={fuelTransactions}
              payrolls={payrolls}
              tripExpenses={tripExpenses}
            />
          </div>

          <CostTransactionTable
            fuelTransactions={fuelTransactions}
            payrolls={payrolls}
            tripExpenses={tripExpenses}
          />
        </>
      )}
    </div>
  );
}

function PayrollTable({ payrolls }: { payrolls: Payroll[] }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-slate-50 border-b">
          <tr className="text-left text-sm text-slate-500">
            <th className="p-5">TÀI XẾ</th>
            <th className="p-5">THÁNG</th>
            <th className="p-5">THƯỞNG</th>
            <th className="p-5">PHẠT</th>
            <th className="p-5">TỔNG LƯƠNG</th>
            <th className="p-5">TRẠNG THÁI</th>
          </tr>
        </thead>

        <tbody>
          {payrolls.map((item) => (
            <tr key={item.id} className="border-b last:border-b-0">
              <td className="p-5">
                <p className="font-bold">{item.driverName}</p>
                <p className="text-sm text-slate-500">ID: {item.driverId}</p>
              </td>

              <td className="p-5">
                Tháng {item.month}/{item.year}
              </td>

              <td className="p-5 text-green-600 font-semibold">
                +{formatShortMoney(item.bonusAmount)}
              </td>

              <td className="p-5 text-red-500 font-semibold">
                -{formatShortMoney(item.penaltyAmount)}
              </td>

              <td className="p-5 text-orange-600 font-bold">
                {formatShortMoney(item.totalSalary)}
              </td>

              <td className="p-5">
                <StatusBadge status={item.status} />
              </td>
            </tr>
          ))}

          {payrolls.length === 0 && (
            <tr>
              <td colSpan={6} className="p-8 text-center text-slate-500">
                Không có dữ liệu lương
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function PayrollModal({
  form,
  setForm,
  drivers,
  onClose,
  onSubmit,
}: {
  form: PayrollCalculateRequest;
  setForm: React.Dispatch<React.SetStateAction<PayrollCalculateRequest>>;
  drivers: Driver[];
  onClose: () => void;
  onSubmit: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-start pt-10">
      <div className="bg-white w-[760px] max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Tính lương tài xế</h2>
          <button onClick={onClose} className="text-slate-500">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 grid grid-cols-2 gap-5">
          <Select
            label="Tài xế"
            value={form.driverId}
            onChange={(v) => setForm({ ...form, driverId: Number(v) })}
          >
            <option value={0}>Chọn tài xế</option>
            {drivers.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.fullName }
              </option>
            ))}
          </Select>

          <Input
            label="Tháng"
            type="number"
            value={form.month}
            onChange={(v) => setForm({ ...form, month: Number(v) })}
          />

          <Input
            label="Năm"
            type="number"
            value={form.year}
            onChange={(v) => setForm({ ...form, year: Number(v) })}
          />

          <Input
            label="Thưởng"
            type="number"
            value={form.bonusAmount}
            onChange={(v) => setForm({ ...form, bonusAmount: Number(v) })}
          />

          <Input
            label="Phạt"
            type="number"
            value={form.penaltyAmount}
            onChange={(v) => setForm({ ...form, penaltyAmount: Number(v) })}
          />
        </div>

        <div className="p-6 border-t flex gap-3">
          <button onClick={onClose} className="flex-1 border rounded-xl py-3 font-bold">
            Hủy
          </button>

          <button
            onClick={onSubmit}
            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white rounded-xl py-3 font-bold"
          >
            Tính lương
          </button>
        </div>
      </div>
    </div>
  );
}

function CostSummary({
  title,
  fuelCost,
  payrollCost,
  tripExpenseCost,
}: {
  title: string;
  fuelCost: number;
  payrollCost: number;
  tripExpenseCost: number;
}) {
  const total = fuelCost + payrollCost + tripExpenseCost;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-7">
      <h3 className="text-xl font-bold mb-6">{title}</h3>

      <CostBar label="Nhiên liệu" amount={fuelCost} total={total} />
      <CostBar label="Lương tài xế" amount={payrollCost} total={total} />
      <CostBar label="Chi phí chuyến đi" amount={tripExpenseCost} total={total} />
    </div>
  );
}

function CostBar({
  label,
  amount,
  total,
}: {
  label: string;
  amount: number;
  total: number;
}) {
  const percent = total > 0 ? Math.round((amount / total) * 100) : 0;

  return (
    <div className="mb-5">
      <div className="flex justify-between mb-2 font-semibold">
        <span>{label}</span>
        <span>
          {formatShortMoney(amount)} ({percent}%)
        </span>
      </div>

      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-orange-600 rounded-full"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function RecentCost({
  fuelTransactions,
  payrolls,
  tripExpenses,
}: {
  fuelTransactions: FuelTransaction[];
  payrolls: Payroll[];
  tripExpenses: TripExpense[];
}) {
  const recentItems = [
    ...fuelTransactions.map((item) => ({
      id: `fuel-${item.id}`,
      title: `Nhiên liệu xe ${item.plateNumber}`,
      date: item.fuelDate,
      category: "Nhiên liệu",
      amount: item.totalAmount,
    })),
    ...payrolls.map((item) => ({
      id: `payroll-${item.id}`,
      title: `Lương tài xế ${item.driverName}`,
      date: item.createdAt || "",
      category: "Lương tài xế",
      amount: item.totalSalary,
    })),
    ...tripExpenses.map((item) => ({
      id: `trip-expense-${item.id}`,
      title: `${item.expenseType} - ${item.tripCode}`,
      date: item.createdAt,
      category: "Chi phí chuyến đi",
      amount: item.amount,
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-7">
      <h3 className="text-xl font-bold mb-6">Chi phí gần đây</h3>

      <div className="space-y-4">
        {recentItems.map((item) => (
          <div
            key={item.id}
            className="bg-slate-50 rounded-xl p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-bold">{item.title}</p>
              <p className="text-sm text-slate-500">
                {formatDate(item.date)}{" "}
                <span className="ml-2 bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  {item.category}
                </span>
              </p>
            </div>

            <p className="text-orange-600 font-bold">
              {formatShortMoney(item.amount)}
            </p>
          </div>
        ))}

        {recentItems.length === 0 && (
          <p className="text-slate-500">Chưa có chi phí gần đây</p>
        )}
      </div>
    </div>
  );
}

function CostTransactionTable({
  fuelTransactions,
  payrolls,
  tripExpenses,
}: {
  fuelTransactions: FuelTransaction[];
  payrolls: Payroll[];
  tripExpenses: TripExpense[];
}) {
  const rows = [
    ...fuelTransactions.map((item) => ({
      id: `fuel-${item.id}`,
      date: item.fuelDate,
      category: "Nhiên liệu",
      description: `Nhiên liệu xe ${item.plateNumber}`,
      vehicle: item.plateNumber,
      amount: item.totalAmount,
      status: "Đã chi",
    })),
    ...payrolls.map((item) => ({
      id: `payroll-${item.id}`,
      date: item.createdAt || "",
      category: "Lương tài xế",
      description: `Lương tháng ${item.month}/${item.year} - ${item.driverName}`,
      vehicle: "-",
      amount: item.totalSalary,
      status: item.status,
    })),
    ...tripExpenses.map((item) => ({
      id: `trip-expense-${item.id}`,
      date: item.createdAt,
      category: "Chi phí chuyến đi",
      description: `${item.expenseType} - ${item.description}`,
      vehicle: item.tripCode,
      amount: item.amount,
      status: "Đã chi",
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-slate-50 border-b">
          <tr className="text-left text-sm text-slate-500">
            <th className="p-5">NGÀY</th>
            <th className="p-5">DANH MỤC</th>
            <th className="p-5">MÔ TẢ</th>
            <th className="p-5">PHƯƠNG TIỆN</th>
            <th className="p-5">SỐ TIỀN</th>
            <th className="p-5">TRẠNG THÁI</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b last:border-b-0">
              <td className="p-5">{formatDate(row.date)}</td>

              <td className="p-5">
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-semibold">
                  {row.category}
                </span>
              </td>

              <td className="p-5">{row.description}</td>
              <td className="p-5">{row.vehicle}</td>

              <td className="p-5 text-orange-600 font-bold">
                {formatShortMoney(row.amount)}
              </td>

              <td className="p-5">
                <StatusBadge status={row.status} />
              </td>
            </tr>
          ))}

          {rows.length === 0 && (
            <tr>
              <td colSpan={6} className="p-8 text-center text-slate-500">
                Chưa có dữ liệu chi phí
              </td>
            </tr>
          )}
        </tbody>
      </table>
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

function StatusBadge({ status }: { status: string }) {
  const isPaid = ["PAID", "Đã thanh toán", "Đã chi"].includes(status);

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-semibold ${
        isPaid ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
      }`}
    >
      {formatStatus(status)}
    </span>
  );
}

function formatStatus(status: string) {
  if (status === "PAID") return "Đã thanh toán";
  if (status === "UNPAID") return "Chưa thanh toán";
  if (status === "PENDING") return "Chờ duyệt";
  return status;
}

function formatDate(date: string) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("vi-VN");
}

function formatShortMoney(value: number) {
  const amount = Number(value || 0);

  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1)}M`;
  }

  return amount.toLocaleString("vi-VN") + " VNĐ";
}