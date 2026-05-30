import { useEffect, useMemo, useState } from "react";
import {
  Lock,
  Plus,
  Search,
  Shield,
  Trash2,
  Unlock,
  UserCog,
  Users,
  Pencil,
  FileClock,
} from "lucide-react";

import { userService } from "../services/userService";
import { roleService } from "../services/roleService";
import { driverService } from "../services/driverService";

import type { User, UserRequest } from "../types/user";
import type { Role } from "../types/role";
import type { Driver } from "../types/driver";

interface UserLog {
  id: number;
  userId: number;
  username: string;
  fullName: string;
  action: string;
  createdAt: string;
}

const emptyForm: UserRequest = {
  username: "",
  password: "",
  fullName: "",
  email: "",
  phone: "",
  roleId: 0,
  isActive: true,
  driverId: undefined,
};

export default function SystemManagementPage() {
  const [activeTab, setActiveTab] = useState<"users" | "roles" | "logs">("users");
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [logs, setLogs] = useState<UserLog[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [search, setSearch] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<UserRequest>(emptyForm);

  useEffect(() => {
    loadUsers();
    loadRoles();
    loadLogs();
    loadDrivers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await userService.getAll();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      alert("Không thể tải danh sách người dùng");
    }
  };

  const loadRoles = async () => {
    try {
      const data = await roleService.getAll();
      setRoles(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      alert("Không thể tải danh sách vai trò");
    }
  };

  const loadLogs = async () => {
    try {
      const data = await userService.getAllUserLogs();
      setLogs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  };

  const loadDrivers = async () => {
    try {
      const data = await driverService.getAll();
      setDrivers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      `${user.username} ${user.fullName} ${user.email} ${user.roleName}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [users, search]);

  const rolesWithCount = useMemo(() => {
    return roles.map((role) => ({
      ...role,
      userCount: users.filter((user) => user.roleId === role.id).length,
    }));
  }, [roles, users]);

  const adminCount = users.filter((u) => u.roleName === "Admin").length;
  const activeCount = users.filter((u) => u.isActive).length;
  const lockedCount = users.filter((u) => !u.isActive).length;

  const handleSubmit = async () => {
    try {
      const selectedRole = roles.find((role) => role.id === Number(form.roleId));
      const isDriverRole = selectedRole?.roleName === "Lái xe";

      if (!form.roleId) {
        alert("Vui lòng chọn vai trò");
        return;
      }

      if (isDriverRole && !editingId && !form.driverId) {
        alert("Vui lòng chọn tài xế để gắn tài khoản");
        return;
      }

      if (!form.username.trim()) {
        alert("Vui lòng nhập tên đăng nhập");
        return;
      }

      if (!editingId && !form.password?.trim()) {
        alert("Vui lòng nhập mật khẩu");
        return;
      }

      if (editingId) {
        await userService.update(editingId, form);
      } else {
        await userService.create(form);
      }

      setOpenForm(false);
      setEditingId(null);
      setForm(emptyForm);

      loadDrivers();
      loadUsers();
      loadLogs();
    } catch (error) {
      console.error(error);
      alert("Lưu tài khoản thất bại");
    }
  };

  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setForm({
      username: user.username,
      password: "",
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      roleId: user.roleId,
      isActive: user.isActive,
      driverId: undefined,
    });
    setOpenForm(true);
  };

  const handleToggleLock = async (user: User) => {
    try {
      if (user.isActive) {
        await userService.lock(user.id);
      } else {
        await userService.unlock(user.id);
      }

      loadUsers();
      loadLogs();
    } catch (error) {
      console.error(error);
      alert("Cập nhật trạng thái tài khoản thất bại");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa tài khoản này không?")) return;

    try {
      await userService.delete(id);
      loadDrivers();
      loadUsers();
      loadLogs();
    } catch (error) {
      console.error(error);
      alert("Xóa tài khoản thất bại");
    }
  };

  return (
    <div className="space-y-7">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard icon={<Users />} title="Tổng tài khoản" value={users.length} color="blue" />
        <StatCard icon={<Shield />} title="Admin" value={adminCount} color="orange" />
        <StatCard icon={<Unlock />} title="Đang hoạt động" value={activeCount} color="green" />
        <StatCard icon={<Lock />} title="Bị khóa" value={lockedCount} color="red" />
      </div>

      <div className="flex items-center gap-8 border-b border-slate-200">
        <TabButton
          active={activeTab === "users"}
          label="Quản lý người dùng"
          icon={<UserCog size={20} />}
          onClick={() => setActiveTab("users")}
        />

        <TabButton
          active={activeTab === "roles"}
          label="Vai trò"
          icon={<Shield size={20} />}
          onClick={() => setActiveTab("roles")}
        />

        <TabButton
          active={activeTab === "logs"}
          label="Nhật ký hệ thống"
          icon={<FileClock size={20} />}
          onClick={() => setActiveTab("logs")}
        />
      </div>

      {activeTab === "users" && (
        <>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 flex items-center justify-between gap-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute top-3 left-3 text-slate-400" size={19} />
              <input
                className="w-full border border-slate-300 rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-orange-300"
                placeholder="Tìm kiếm tài khoản..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <button
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
                loadDrivers();
                setOpenForm(true);
              }}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"
            >
              <Plus size={20} />
              Tạo tài khoản
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr className="text-left text-sm text-slate-700">
                  <th className="p-5">Người dùng</th>
                  <th className="p-5">Liên hệ</th>
                  <th className="p-5">Vai trò</th>
                  <th className="p-5">Trạng thái</th>
                  <th className="p-5">Ngày tạo</th>
                  <th className="p-5">Thao tác</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-t border-slate-200">
                    <td className="p-5">
                      <p className="font-bold text-slate-900">{user.fullName}</p>
                      <p className="text-sm text-slate-500">@{user.username}</p>
                    </td>

                    <td className="p-5">
                      <p>{user.email}</p>
                      <p className="text-sm text-slate-500">{user.phone}</p>
                    </td>

                    <td className="p-5">
                      <span className="px-3 py-1 rounded-full text-sm font-semibold bg-orange-100 text-orange-700">
                        {user.roleName}
                      </span>
                    </td>

                    <td className="p-5">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          user.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.isActive ? "Hoạt động" : "Bị khóa"}
                      </span>
                    </td>

                    <td className="p-5">{formatDate(user.createdAt)}</td>

                    <td className="p-5">
                      <div className="flex gap-4 text-slate-600">
                        <button onClick={() => handleEdit(user)} title="Sửa">
                          <Pencil size={19} />
                        </button>

                        <button
                          onClick={() => handleToggleLock(user)}
                          title={user.isActive ? "Khóa" : "Mở khóa"}
                        >
                          {user.isActive ? <Lock size={19} /> : <Unlock size={19} />}
                        </button>

                        <button
                          onClick={() => handleDelete(user.id)}
                          title="Xóa"
                          className="text-red-500"
                        >
                          <Trash2 size={19} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center p-8 text-slate-500">
                      Không có tài khoản nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === "roles" && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold mb-5">Danh sách vai trò</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {rolesWithCount.map((role) => (
              <div key={role.id} className="border rounded-xl p-5">
                <div className="bg-orange-100 text-orange-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <Shield size={24} />
                </div>

                <p className="font-bold text-lg">{role.roleName}</p>
                <p className="text-sm text-slate-500">Role ID: {role.id}</p>

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-sm text-slate-500">Số tài khoản</span>
                  <span className="font-bold text-orange-600">{role.userCount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "logs" && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-5 border-b border-slate-200">
            <h2 className="text-xl font-bold">Nhật ký hệ thống</h2>
            <p className="text-sm text-slate-500 mt-1">
              Theo dõi các thao tác tạo, cập nhật, khóa và mở khóa tài khoản
            </p>
          </div>

          <table className="w-full">
            <thead className="bg-slate-50">
              <tr className="text-left text-sm text-slate-700">
                <th className="p-5">Người dùng</th>
                <th className="p-5">Hành động</th>
                <th className="p-5">Thời gian</th>
              </tr>
            </thead>

            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-t border-slate-200">
                  <td className="p-5">
                    <p className="font-bold text-slate-900">{log.fullName || "Không rõ"}</p>
                    <p className="text-sm text-slate-500">@{log.username || "unknown"}</p>
                  </td>

                  <td className="p-5">
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700">
                      {log.action}
                    </span>
                  </td>

                  <td className="p-5">{formatDateTime(log.createdAt)}</td>
                </tr>
              ))}

              {logs.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center p-8 text-slate-500">
                    Chưa có nhật ký hệ thống
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {openForm && (
        <UserFormModal
          form={form}
          setForm={setForm}
          roles={roles}
          drivers={drivers}
          editingId={editingId}
          onClose={() => {
            setOpenForm(false);
            setEditingId(null);
            setForm(emptyForm);
          }}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

function UserFormModal({
  form,
  setForm,
  roles,
  drivers,
  editingId,
  onClose,
  onSubmit,
}: {
  form: UserRequest;
  setForm: React.Dispatch<React.SetStateAction<UserRequest>>;
  roles: Role[];
  drivers: Driver[];
  editingId: number | null;
  onClose: () => void;
  onSubmit: () => void;
}) {
  const selectedRole = roles.find((role) => role.id === Number(form.roleId));
  const isDriverRole = selectedRole?.roleName === "Lái xe";

  const driversWithoutAccount = drivers.filter((driver) => {
    const driverAny = driver as any;
    return !driverAny.userId && !driverAny.user;
  });

  const handleSelectRole = (roleId: number) => {
    setForm({
      ...form,
      roleId,
      driverId: undefined,
      fullName: "",
      email: "",
      phone: "",
    });
  };

  const handleSelectDriver = (driverId: number) => {
    const selectedDriver = drivers.find((driver) => driver.id === driverId);

    if (!selectedDriver) return;

    setForm({
      ...form,
      driverId: selectedDriver.id,
      fullName: selectedDriver.fullName || "",
      email: selectedDriver.email || "",
      phone: selectedDriver.phone || "",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-start pt-10">
      <div className="bg-white w-[850px] rounded-2xl shadow-xl">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">
            {editingId ? "Cập nhật tài khoản" : "Tạo tài khoản mới"}
          </h2>

          <button onClick={onClose} className="text-2xl text-slate-500">
            ×
          </button>
        </div>

        <div className="p-6 grid grid-cols-2 gap-5">
          <Select
            label="Vai trò"
            value={form.roleId}
            onChange={(v) => handleSelectRole(Number(v))}
            disabled={!!editingId}
          >
            <option value={0}>-- Chọn vai trò trước --</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.roleName}
              </option>
            ))}
          </Select>

          {isDriverRole && !editingId && (
            <Select
              label="Chọn tài xế chưa có tài khoản"
              value={form.driverId || 0}
              onChange={(v) => handleSelectDriver(Number(v))}
            >
              <option value={0}>-- Chọn tài xế --</option>
              {driversWithoutAccount.map((driver) => (
                <option key={driver.id} value={driver.id}>
                  {driver.fullName} - {driver.phone || "Chưa có SĐT"}
                </option>
              ))}
            </Select>
          )}

          <Input
            label="Tên đăng nhập"
            value={form.username}
            onChange={(v) => setForm({ ...form, username: v })}
          />

          <Input
            label={editingId ? "Mật khẩu mới (nếu muốn đổi)" : "Mật khẩu"}
            type="password"
            value={form.password || ""}
            onChange={(v) => setForm({ ...form, password: v })}
          />

          <Input
            label="Họ tên"
            value={form.fullName}
            onChange={(v) => setForm({ ...form, fullName: v })}
            disabled={isDriverRole}
          />

          <Input
            label="Email"
            value={form.email}
            onChange={(v) => setForm({ ...form, email: v })}
            disabled={isDriverRole}
          />

          <Input
            label="Số điện thoại"
            value={form.phone}
            onChange={(v) => setForm({ ...form, phone: v })}
            disabled={isDriverRole}
          />

          <Select
            label="Trạng thái"
            value={form.isActive ? "true" : "false"}
            onChange={(v) => setForm({ ...form, isActive: v === "true" })}
          >
            <option value="true">Hoạt động</option>
            <option value="false">Khóa</option>
          </Select>
        </div>

        {isDriverRole && !editingId && (
          <div className="px-6 pb-2 text-sm text-slate-500">
            Khi chọn tài xế, hệ thống sẽ tự điền họ tên, email và số điện thoại từ hồ sơ tài xế.
            Admin chỉ cần nhập tên đăng nhập và mật khẩu.
          </div>
        )}

        <div className="p-6 border-t flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-3 rounded-xl border">
            Hủy
          </button>

          <button
            onClick={onSubmit}
            className="px-6 py-3 rounded-xl bg-orange-600 text-white font-bold"
          >
            Lưu
          </button>
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
  value: number;
  color: "blue" | "orange" | "green" | "red";
}) {
  const colorMap = {
    blue: "bg-blue-100 text-blue-600",
    orange: "bg-orange-100 text-orange-600",
    green: "bg-green-100 text-green-600",
    red: "bg-red-100 text-red-600",
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-7">
      <div className={`${colorMap[color]} w-14 h-14 rounded-xl flex items-center justify-center mb-6`}>
        {icon}
      </div>
      <p className="font-semibold text-slate-700 mb-2">{title}</p>
      <h2 className="text-3xl font-bold text-slate-900">{value}</h2>
    </div>
  );
}

function TabButton({
  active,
  label,
  icon,
  onClick,
}: {
  active: boolean;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`pb-4 flex items-center gap-2 font-semibold ${
        active
          ? "text-orange-600 border-b-2 border-orange-600"
          : "text-slate-400"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  disabled = false,
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      <input
        type={type}
        disabled={disabled}
        className={`w-full border border-slate-300 rounded-xl px-4 py-3 mt-1 outline-none focus:ring-2 focus:ring-orange-300 ${
          disabled ? "bg-slate-100 text-slate-500 cursor-not-allowed" : ""
        }`}
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
  disabled = false,
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      <select
        disabled={disabled}
        className={`w-full border border-slate-300 rounded-xl px-4 py-3 mt-1 outline-none focus:ring-2 focus:ring-orange-300 ${
          disabled ? "bg-slate-100 text-slate-500 cursor-not-allowed" : ""
        }`}
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

function formatDateTime(date: string) {
  if (!date) return "";
  return new Date(date).toLocaleString("vi-VN");
}