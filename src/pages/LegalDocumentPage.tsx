import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Download,
  Eye,
  FileText,
  Filter,
  Plus,
  Search,
  ShieldX,
  Trash2,
  X,
} from "lucide-react";

import StatCard from "../components/StatCard";
import { driverLicenseService } from "../services/driverLicenseService";
import { vehicleDocumentService } from "../services/vehicleDocumentService";
import { driverService } from "../services/driverService";
import { vehicleService } from "../services/vehicleService";

import type { Driver } from "../types/driver";
import type { Vehicle } from "../types/vehicle";

import type {
  DriverLicense,
  DriverLicenseRequest,
} from "../types/driverLicense";
import type {
  VehicleDocument,
  VehicleDocumentRequest,
} from "../types/vehicleDocument";

type TabType = "documents" | "contracts";
type ModalType = "driverLicense" | "vehicleDocument" | null;

type LegalItem = {
  id: string;
  realId: number;
  source: "driverLicense" | "vehicleDocument";
  title: string;
  code: string;
  category: string;
  relatedName: string;
  relatedType: string;
  issueDate: string;
  expiryDate: string;
  fileUrl: string;
  status: string;
};

const emptyDriverLicenseForm: DriverLicenseRequest = {
  driverId: 0,
  licenseNumber: "",
  licenseClass: "",
  issueDate: "",
  expiryDate: "",
  fileUrl: "",
  status: "Valid",
};

const emptyVehicleDocumentForm: VehicleDocumentRequest = {
  vehicleId: 0,
  documentType: "",
  documentName: "",
  fileUrl: "",
  issueDate: "",
  expiryDate: "",
  status: "Valid",
};

export default function LegalDocumentPage() {
  const [activeTab, setActiveTab] = useState<TabType>("documents");
  const [driverLicenses, setDriverLicenses] = useState<DriverLicense[]>([]);
  const [vehicleDocuments, setVehicleDocuments] = useState<VehicleDocument[]>([]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Tất cả");

  const [modalType, setModalType] = useState<ModalType>(null);
  const [driverLicenseForm, setDriverLicenseForm] = useState<DriverLicenseRequest>(
    emptyDriverLicenseForm
  );
  const [vehicleDocumentForm, setVehicleDocumentForm] =
    useState<VehicleDocumentRequest>(emptyVehicleDocumentForm);

const [drivers, setDrivers] = useState<Driver[]>([]);
const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
  try {
    const [licenseData, vehicleDocData, driverData, vehicleData] =
      await Promise.all([
        driverLicenseService.getAll(),
        vehicleDocumentService.getAll(),
        driverService.getAll(),
        vehicleService.getAll(),
      ]);

    setDriverLicenses(Array.isArray(licenseData) ? licenseData : []);
    setVehicleDocuments(Array.isArray(vehicleDocData) ? vehicleDocData : []);
    setDrivers(Array.isArray(driverData) ? driverData : []);
    setVehicles(Array.isArray(vehicleData) ? vehicleData : []);
  } catch (error) {
    console.error(error);
    alert("Không thể tải dữ liệu chứng từ");
  }
};

  const legalItems = useMemo<LegalItem[]>(() => {
    const licenses: LegalItem[] = driverLicenses.map((item) => ({
      id: `license-${item.id}`,
      realId: item.id,
      source: "driverLicense",
      title: `Bằng lái hạng ${item.licenseClass} - ${item.driverName}`,
      code: item.licenseNumber,
      category: "Bằng lái xe",
      relatedName: item.driverName,
      relatedType: "Tài xế",
      issueDate: item.issueDate,
      expiryDate: item.expiryDate,
      fileUrl: item.fileUrl,
      status: item.status,
    }));

    const vehicleDocs: LegalItem[] = vehicleDocuments.map((item) => ({
      id: `vehicle-${item.id}`,
      realId: item.id,
      source: "vehicleDocument",
      title: item.documentName,
      code: `${item.documentType} - ${item.plateNumber}`,
      category: item.documentType,
      relatedName: item.plateNumber,
      relatedType: "Phương tiện",
      issueDate: item.issueDate,
      expiryDate: item.expiryDate,
      fileUrl: item.fileUrl,
      status: item.status,
    }));

    return [...licenses, ...vehicleDocs];
  }, [driverLicenses, vehicleDocuments]);

  const filteredItems = useMemo(() => {
    return legalItems.filter((item) => {
      const matchSearch = `${item.title} ${item.code} ${item.relatedName}`
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchFilter = filter === "Tất cả" ? true : item.category === filter;

      return matchSearch && matchFilter;
    });
  }, [legalItems, search, filter]);

  const expiredItems = legalItems.filter((item) => getDayLeft(item.expiryDate) < 0);
  const expiringItems = legalItems.filter((item) => {
    const days = getDayLeft(item.expiryDate);
    return days >= 0 && days <= 30;
  });
  const validItems = legalItems.filter((item) => getDayLeft(item.expiryDate) > 30);

  const handleCreateDriverLicense = async () => {
    try {
      if (!driverLicenseForm.driverId) {
        alert("Vui lòng nhập ID tài xế");
        return;
      }

      await driverLicenseService.create(driverLicenseForm);
      setModalType(null);
      setDriverLicenseForm(emptyDriverLicenseForm);
      loadData();
    } catch (error) {
      console.error(error);
      alert("Thêm bằng lái thất bại");
    }
  };

  const handleCreateVehicleDocument = async () => {
    try {
      if (!vehicleDocumentForm.vehicleId) {
        alert("Vui lòng nhập ID phương tiện");
        return;
      }

      await vehicleDocumentService.create(vehicleDocumentForm);
      setModalType(null);
      setVehicleDocumentForm(emptyVehicleDocumentForm);
      loadData();
    } catch (error) {
      console.error(error);
      alert("Thêm chứng từ xe thất bại");
    }
  };

  const handleDelete = async (item: LegalItem) => {
    if (!confirm("Bạn có chắc muốn xóa chứng từ này không?")) return;

    try {
      if (item.source === "driverLicense") {
        await driverLicenseService.delete(item.realId);
      } else {
        await vehicleDocumentService.delete(item.realId);
      }

      loadData();
    } catch (error) {
      console.error(error);
      alert("Xóa chứng từ thất bại");
    }
  };

  return (
    <div className="space-y-7">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 grid grid-cols-2 overflow-hidden">
        <button
          onClick={() => setActiveTab("documents")}
          className={`py-5 font-bold ${
            activeTab === "documents"
              ? "bg-orange-50 text-orange-600 border-b-2 border-orange-600"
              : "text-slate-700"
          }`}
        >
          Quản lý chứng từ (Bằng lái, Đăng kiểm, Bảo hiểm)
        </button>

        <button
          onClick={() => setActiveTab("contracts")}
          className={`py-5 font-bold ${
            activeTab === "contracts"
              ? "bg-orange-50 text-orange-600 border-b-2 border-orange-600"
              : "text-slate-700"
          }`}
        >
          Quản lý hợp đồng
        </button>
      </div>

      {activeTab === "contracts" ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-10 text-center text-slate-500">
          Tab quản lý hợp đồng để trống.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard icon={<FileText />} title="Tổng chứng từ" value={legalItems.length} color="blue" />
            <StatCard icon={<CheckCircle />} title="Còn hạn" value={validItems.length} color="green" />
            <StatCard icon={<AlertCircle />} title="Sắp hết hạn" value={expiringItems.length} color="yellow" />
            <StatCard icon={<ShieldX />} title="Hết hạn" value={expiredItems.length} color="red" />
          </div>

          {expiredItems.length > 0 && (
            <WarningBox
              type="expired"
              title={`Chứng từ đã hết hạn (${expiredItems.length})`}
              items={expiredItems}
            />
          )}

          {expiringItems.length > 0 && (
            <WarningBox
              type="expiring"
              title={`Chứng từ sắp hết hạn (${expiringItems.length})`}
              items={expiringItems}
            />
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 flex justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute top-3 left-3 text-slate-400" size={19} />
                <input
                  className="w-[270px] border border-slate-300 rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-orange-300"
                  placeholder="Tìm kiếm chứng từ..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <Filter className="text-slate-500" size={22} />

              <select
                className="border border-slate-300 rounded-xl px-5 py-3 outline-none w-[170px]"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option>Tất cả</option>
                <option>Bằng lái xe</option>
                <option>Đăng kiểm</option>
                <option>Bảo hiểm</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setModalType("driverLicense")}
                className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2"
              >
                <Plus size={20} />
                Thêm bằng lái
              </button>

              <button
                onClick={() => setModalType("vehicleDocument")}
                className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2"
              >
                <Plus size={20} />
                Thêm chứng từ xe
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filteredItems.map((item) => (
              <DocumentCard
                key={item.id}
                item={item}
                onDelete={handleDelete}
              />
            ))}

            {filteredItems.length === 0 && (
              <div className="col-span-2 bg-white rounded-2xl border p-8 text-center text-slate-500">
                Không có chứng từ nào
              </div>
            )}
          </div>
        </>
      )}

      {modalType === "driverLicense" && (
        <DriverLicenseModal
        form={driverLicenseForm}
        setForm={setDriverLicenseForm}
        drivers={drivers}
        onClose={() => setModalType(null)}
        onSubmit={handleCreateDriverLicense}
        />
      )}

      {modalType === "vehicleDocument" && (
        <VehicleDocumentModal
        form={vehicleDocumentForm}
        setForm={setVehicleDocumentForm}
        vehicles={vehicles}
        onClose={() => setModalType(null)}
        onSubmit={handleCreateVehicleDocument}
        />
      )}
    </div>
  );
}

function WarningBox({
  type,
  title,
  items,
}: {
  type: "expired" | "expiring";
  title: string;
  items: LegalItem[];
}) {
  const isExpired = type === "expired";

  return (
    <div
      className={`rounded-2xl border p-5 ${
        isExpired
          ? "bg-red-50 border-red-200"
          : "bg-yellow-50 border-yellow-200"
      }`}
    >
      <h3
        className={`font-bold text-lg mb-4 flex items-center gap-2 ${
          isExpired ? "text-red-600" : "text-yellow-700"
        }`}
      >
        <AlertCircle size={21} />
        {title}
      </h3>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-bold">{item.title}</p>
              <p className="text-sm text-slate-600">
                Hết hạn: {formatDate(item.expiryDate)}{" "}
                {isExpired
                  ? `(${Math.abs(getDayLeft(item.expiryDate))} ngày trước)`
                  : `(còn ${getDayLeft(item.expiryDate)} ngày)`}
              </p>
            </div>

            <button
              className={`px-5 py-2 rounded-xl text-white font-bold ${
                isExpired ? "bg-red-600" : "bg-yellow-600"
              }`}
            >
              Xem chi tiết
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function DocumentCard({
  item,
  onDelete,
}: {
  item: LegalItem;
  onDelete: (item: LegalItem) => void;
}) {
  const dayLeft = getDayLeft(item.expiryDate);
  const isExpired = dayLeft < 0;
  const isExpiring = dayLeft >= 0 && dayLeft <= 30;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex gap-4">
        <div
          className={`w-14 h-14 rounded-xl flex items-center justify-center ${
            isExpired
              ? "bg-red-100 text-red-600"
              : isExpiring
              ? "bg-yellow-100 text-yellow-600"
              : "bg-green-100 text-green-600"
          }`}
        >
          {isExpired ? <ShieldX /> : isExpiring ? <AlertCircle /> : <CheckCircle />}
        </div>

        <div className="flex-1">
          <span
            className={`px-3 py-1 rounded-md text-sm font-semibold ${
              isExpired
                ? "bg-red-100 text-red-700"
                : isExpiring
                ? "bg-yellow-100 text-yellow-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {item.category}
          </span>

          <h3 className="text-xl font-bold mt-3 mb-2">{item.title}</h3>
          <p className="text-slate-600 mb-4">{item.code}</p>

          <p className="text-slate-600 mb-2">
            Liên quan:{" "}
            <b className="text-slate-900">{item.relatedName}</b>{" "}
            <span className="text-sm">({item.relatedType})</span>
          </p>

          <p className="text-slate-600 flex items-center gap-2">
            <Calendar size={17} />
            Hết hạn:{" "}
            <b
              className={
                isExpired
                  ? "text-red-600"
                  : isExpiring
                  ? "text-yellow-600"
                  : "text-green-600"
              }
            >
              {formatDate(item.expiryDate)}{" "}
              {isExpired
                ? `(Quá hạn ${Math.abs(dayLeft)} ngày)`
                : `(Còn ${dayLeft} ngày)`}
            </b>
          </p>
        </div>
      </div>

      <div className="border-t mt-5 pt-4 flex gap-3">
        <button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2">
          <Eye size={18} />
          Xem chi tiết
        </button>

        <a
          href={item.fileUrl}
          target="_blank"
          className="border px-5 py-3 rounded-xl font-bold flex items-center gap-2"
        >
          <Download size={18} />
          Tải xuống
        </a>

        <button
          onClick={() => onDelete(item)}
          className="border border-red-200 text-red-600 px-4 py-3 rounded-xl font-bold"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}

function DriverLicenseModal({
  form,
  setForm,
  drivers,
  onClose,
  onSubmit,
}: {
  form: DriverLicenseRequest;
  setForm: React.Dispatch<React.SetStateAction<DriverLicenseRequest>>;
  drivers: Driver[];
  onClose: () => void;
  onSubmit: () => void;
}) {
  return (
    <BaseModal title="Thêm bằng lái tài xế" onClose={onClose} onSubmit={onSubmit}>
      <Select
        label="Tài xế"
        value={form.driverId}
        onChange={(v) => setForm({ ...form, driverId: Number(v) })}
      >
        <option value={0}>-- Chọn tài xế --</option>
        {drivers.map((driver) => (
          <option key={driver.id} value={driver.id}>
            {driver.fullName  || `Tài xế #${driver.id}`}
          </option>
        ))}
      </Select>

      <Input
        label="Số bằng lái"
        value={form.licenseNumber}
        onChange={(v) => setForm({ ...form, licenseNumber: v })}
      />

      <Input
        label="Hạng bằng"
        value={form.licenseClass}
        onChange={(v) => setForm({ ...form, licenseClass: v })}
      />

      <Input
        label="Ngày cấp"
        type="date"
        value={form.issueDate}
        onChange={(v) => setForm({ ...form, issueDate: v })}
      />

      <Input
        label="Ngày hết hạn"
        type="date"
        value={form.expiryDate}
        onChange={(v) => setForm({ ...form, expiryDate: v })}
      />

      <Input
        label="File URL"
        value={form.fileUrl}
        onChange={(v) => setForm({ ...form, fileUrl: v })}
      />

      <Select
        label="Trạng thái"
        value={form.status}
        onChange={(v) => setForm({ ...form, status: v })}
      >
        <option value="Valid">Valid</option>
        <option value="Expired">Expired</option>
      </Select>
    </BaseModal>
  );
}

function VehicleDocumentModal({
  form,
  setForm,
  vehicles,
  onClose,
  onSubmit,
}: {
  form: VehicleDocumentRequest;
  setForm: React.Dispatch<React.SetStateAction<VehicleDocumentRequest>>;
  vehicles: Vehicle[];
  onClose: () => void;
  onSubmit: () => void;
}) {
  return (
    <BaseModal title="Thêm chứng từ phương tiện" onClose={onClose} onSubmit={onSubmit}>
      <Select
        label="Phương tiện"
        value={form.vehicleId}
        onChange={(v) => setForm({ ...form, vehicleId: Number(v) })}
      >
        <option value={0}>-- Chọn phương tiện --</option>
        {vehicles.map((vehicle) => (
          <option key={vehicle.id} value={vehicle.id}>
            {vehicle.plateNumber || `Xe #${vehicle.id}`}
          </option>
        ))}
      </Select>

      <Select
        label="Loại chứng từ"
        value={form.documentType}
        onChange={(v) => setForm({ ...form, documentType: v })}
      >
        <option value="">Chọn loại chứng từ</option>
        <option value="Đăng kiểm">Đăng kiểm</option>
        <option value="Bảo hiểm">Bảo hiểm</option>
        <option value="Giấy phép lưu hành">Giấy phép lưu hành</option>
      </Select>

      <Input
        label="Tên chứng từ"
        value={form.documentName}
        onChange={(v) => setForm({ ...form, documentName: v })}
      />

      <Input
        label="Ngày cấp"
        type="date"
        value={form.issueDate}
        onChange={(v) => setForm({ ...form, issueDate: v })}
      />

      <Input
        label="Ngày hết hạn"
        type="date"
        value={form.expiryDate}
        onChange={(v) => setForm({ ...form, expiryDate: v })}
      />

      <Input
        label="File URL"
        value={form.fileUrl}
        onChange={(v) => setForm({ ...form, fileUrl: v })}
      />

      <Select
        label="Trạng thái"
        value={form.status}
        onChange={(v) => setForm({ ...form, status: v })}
      >
        <option value="Valid">Valid</option>
        <option value="Expired">Expired</option>
      </Select>
    </BaseModal>
  );
}

function BaseModal({
  title,
  children,
  onClose,
  onSubmit,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onSubmit: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-start pt-10">
      <div className="bg-white w-[760px] max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="text-slate-500">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 grid grid-cols-2 gap-5">{children}</div>

        <div className="p-6 border-t flex gap-3">
          <button onClick={onClose} className="flex-1 border rounded-xl py-3 font-bold">
            Hủy
          </button>

          <button
            onClick={onSubmit}
            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white rounded-xl py-3 font-bold"
          >
            Lưu
          </button>
        </div>
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

function getDayLeft(expiryDate: string) {
  if (!expiryDate) return 0;

  const today = new Date();
  const expiry = new Date(expiryDate);

  today.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);

  return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function formatDate(date: string) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("vi-VN");
}