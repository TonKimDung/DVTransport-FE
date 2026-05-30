export const ROLE = {
  ADMIN: "Admin",
  DIEU_PHOI_VIEN: "Điều phối viên",
  HR: "HR",
  LAI_XE: "Lái xe",
  KE_TOAN: "Kế toán",
};

export const canAccess = (allowedRoles: string[]) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return allowedRoles.includes(user.roleName);
};