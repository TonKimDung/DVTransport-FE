import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  ChevronDown,
  Clock3,
  CreditCard,
  FileText,
  Mail,
  MapPin,
  MoreVertical,
  Phone,
  Plus,
  Truck,
  UserCog,
  Users,
} from "lucide-react";

import { recruitmentService } from "../services/recruitmentService";
import { driverService } from "../services/driverService";
import { assignmentService } from "../services/assignmentService";
import { vehicleService } from "../services/vehicleService";

import type {
  RecruitmentCampaign,
  JobApplication,
} from "../types/recruitment";

import type { Driver } from "../types/driver";

import type { Assignment } from "../types/assigment";

import CreateCampaignModal from "../components/recruitment/CreateCampaignModal";
import AddDriverModal from "../components/recruitment/AddDriverModal";
import CreateAssignmentModal from "../components/recruitment/CreateAssignmentModal";
import DriverDetailModal from "../components/recruitment/DriverDetailModal";
import EditDriverModal from "../components/recruitment/EditDriverModal";
import React from "react";

type MainTab =
  | "recruitment"
  | "drivers"
  | "assignment";

type RecruitTab =
  | "campaign"
  | "application";

type AssignmentTab =
  | "vehicle"
  | "work";

interface WorkLog {
  id: number;
  driverName: string;
  workDate: string;
  workingHours: number;
  tripCount: number;
  vehiclePlate: string;
}

export default function RecruitmentPage() {
  const [mainTab, setMainTab] =
    useState<MainTab>("recruitment");

  const [recruitTab, setRecruitTab] =
    useState<RecruitTab>("campaign");

  const [assignmentTab,
    setAssignmentTab] =
    useState<AssignmentTab>(
      "vehicle"
    );

  const [loading, setLoading] =
    useState(false);

  // ================= DATA =================

  const [campaigns, setCampaigns] =
    useState<
      RecruitmentCampaign[]
    >([]);

  const [applications,
    setApplications] =
    useState<JobApplication[]>(
      []
    );

  const [drivers, setDrivers] =
    useState<Driver[]>([]);

  const [assignments,
    setAssignments] =
    useState<Assignment[]>(
      []
    );

  const [vehicles,
    setVehicles] =
    useState<any[]>([]);

    const [availableDrivers,
        setAvailableDrivers] =
        useState<Driver[]>([]);

    const [availableVehicles,
        setAvailableVehicles] =
        useState<any[]>([]);

  const [workLogs] = useState<
    WorkLog[]
  >([]);

  const [
  openEditDriverModal,
  setOpenEditDriverModal,
] = useState(false);

const [
  openDriverDetailModal,
  setOpenDriverDetailModal,
] = useState(false);

const [
  selectedDriver,
  setSelectedDriver,
] = useState<Driver | null>(
  null
);

  // ================= FILTER =================

  const [
    selectedCampaign,
    setSelectedCampaign,
  ] = useState("");

  // ================= MODAL =================

  const [
    openCampaignModal,
    setOpenCampaignModal,
  ] = useState(false);

  const [
    openDriverModal,
    setOpenDriverModal,
  ] = useState(false);

  const [
    openAssignmentModal,
    setOpenAssignmentModal,
  ] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (
      recruitTab ===
      "application"
    ) {
      loadApplications();
    }
  }, [selectedCampaign]);

  const loadData = async () => {
    try {
      setLoading(true);

      const [
        campaignRes,
        driverRes,
        assignmentRes,
        vehicleRes,
        availableDriverRes,
        availableVehicleRes,
        ] = await Promise.all([
        recruitmentService.getCampaigns(),
        driverService.getAll(),
        assignmentService.getAll(),
        vehicleService.getAll(),

        // mới
        driverService.getAvailable(),
        vehicleService.getAvailable(),
        ]);

        setAvailableDrivers(
            availableDriverRes || []
        );

        setAvailableVehicles(
            availableVehicleRes || []
        );

        setCampaigns(
            campaignRes || []
        );


        setVehicles(
            vehicleRes || []
        );

        setDrivers(
            driverRes || []
        );

        setAssignments(
            assignmentRes || []
        );
      await loadApplications();
    } catch (error) {
      console.error(error);

      alert(
        "Không thể tải dữ liệu"
      );
    } finally {
      setLoading(false);
    }
  };

  const loadApplications =
    async () => {
      try {
        let data:
          | JobApplication[]
          = [];

        if (
          selectedCampaign
        ) {
          data =
            await recruitmentService.getApplicationsByCampaign(
              Number(
                selectedCampaign
              )
            );
        } else {
          data =
            await recruitmentService.getApplications();
        }

        setApplications(
          data || []
        );
      } catch (error) {
        console.error(
          error
        );
      }
    };

  // ================= TOTAL =================

  const totalCount =
    useMemo(() => {
      if (
        mainTab ===
          "recruitment" &&
        recruitTab ===
          "campaign"
      ) {
        return `${campaigns.length} đợt tuyển dụng`;
      }

      if (
        mainTab ===
          "recruitment" &&
        recruitTab ===
          "application"
      ) {
        return `${applications.length} hồ sơ`;
      }

      if (
        mainTab ===
        "drivers"
      ) {
        return `${drivers.length} tài xế`;
      }

      if (
        mainTab ===
          "assignment" &&
        assignmentTab ===
          "vehicle"
      ) {
        return `${assignments.length} phân công`;
      }

      return `${workLogs.length} bản ghi`;
    }, [
      mainTab,
      recruitTab,
      assignmentTab,
      campaigns.length,
      applications.length,
      drivers.length,
      assignments.length,
      workLogs.length,
    ]);

    // ================= STATS =================

const recruitmentStats = useMemo(() => {
  const activeCampaigns = campaigns.filter(
    (c) =>
      c.status?.toUpperCase() ===
      "ACTIVE"
  ).length;

  const approvedApplications =
    applications.filter(
      (a) => {
        const status =
          a.status?.toUpperCase();

        return (
          status ===
            "APPROVED" ||
          status ===
            "REJECTED"
        );
      }
    ).length;

  return {
    totalCampaigns:
      campaigns.length,

    activeCampaigns,

    totalApplications:
      applications.length,

    approvedApplications,
  };
}, [
  campaigns,
  applications,
]);

const driverStats = useMemo(() => {
  const activeDrivers = drivers.filter(
    (d) => d.status?.toUpperCase() === "ACTIVE"
  ).length;

  const availableDrivers = drivers.filter(
    (d: any) => d.isAvailable === true
  ).length;

  return {
    totalDrivers: drivers.length,
    activeDrivers,
    availableDrivers,
  };
}, [drivers]);

  const handleTopAction =
    () => {
      if (
        mainTab ===
          "recruitment" &&
        recruitTab ===
          "campaign"
      ) {
        setOpenCampaignModal(
          true
        );

        return;
      }

      if (
        mainTab ===
        "drivers"
      ) {
        setOpenDriverModal(
          true
        );

        return;
      }

      if (
        mainTab ===
          "assignment" &&
        assignmentTab ===
          "vehicle"
      ) {
        setOpenAssignmentModal(
          true
        );
      }
    };

    
const handleCloseCampaign =
    async (
        id: number
    ) => {
        const ok =
        confirm(
            "Đóng tuyển dụng?"
        );

        if (!ok)
        return;

        try {
        await recruitmentService.closeCampaign(
            id
        );

        alert(
            "Đã đóng tuyển"
        );

        loadData();
        } catch {
        alert(
            "Không thể cập nhật"
        );
        }
};

const handleUpdateApplicationStatus =
  async (
    id: number,
    status: string
  ) => {
    try {
      await recruitmentService.updateApplicationStatus(
        id,
        status
      );

      alert(
        "Đã cập nhật trạng thái"
      );

      loadApplications();
    } catch {
      alert(
        "Không thể cập nhật"
      );
    }
  };

  const handleInactiveDriver =
  async (
    id: number
  ) => {
    const ok =
      confirm(
        "Ngừng hoạt động tài xế?"
      );

    if (!ok)
      return;

    try {
      await driverService.updateStatus(
        id,
        "INACTIVE"
      );

      alert(
        "Đã cập nhật"
      );

      loadData();
    } catch {
      alert(
        "Không thể cập nhật"
      );
    }
  };

  const handleDeactivateAssignment =
  async (
    id: number
  ) => {
    const ok =
      confirm(
        "Kết thúc phân công?"
      );

    if (!ok)
      return;

    try {
      await assignmentService.deactivate(
        id
      );

      alert(
        "Đã kết thúc phân công"
      );

      loadData();
    } catch {
      alert(
        "Không thể cập nhật"
      );
    }
  };
  return (
    <>
      {/* ================= MODALS ================= */}

      <CreateCampaignModal
        open={
          openCampaignModal
        }
        onClose={() =>
          setOpenCampaignModal(
            false
          )
        }
        onSuccess={
          loadData
        }
      />

      <EditDriverModal
        open={
            openEditDriverModal
        }
        onClose={() =>
            setOpenEditDriverModal(
            false
            )
        }
        onSuccess={loadData}
        driver={selectedDriver}
    />

        <DriverDetailModal
            open={
                openDriverDetailModal
            }
            onClose={() =>
                setOpenDriverDetailModal(
                false
                )
            }
            driver={selectedDriver}
            />

      <AddDriverModal
        open={
          openDriverModal
        }
        onClose={() =>
          setOpenDriverModal(
            false
          )
        }
        onSuccess={
          loadData
        }
      />

      <CreateAssignmentModal
        open={openAssignmentModal}
        onClose={() =>
            setOpenAssignmentModal(false)
        }
        onSuccess={loadData}
        drivers={
            availableDrivers
        }
        vehicles={
            availableVehicles
        }
    />

      <div className="space-y-8">

        {/* HEADER */}

        <div>
          <h1 className="text-[48px] font-bold text-slate-900 leading-tight">
            Quản lý tuyển dụng
          </h1>

          <p className="text-[18px] text-slate-400 mt-3">
            Quản lý đợt
            tuyển dụng,
            hồ sơ ứng viên
            và danh sách
            tài xế
          </p>
        </div>

        {/* MAIN TAB */}

        <div className="flex items-center gap-12 border-b border-slate-200">

          <MainTabButton
            active={
              mainTab ===
              "recruitment"
            }
            icon={
              <FileText
                size={22}
              />
            }
            title="Tuyển dụng"
            onClick={() =>
              setMainTab(
                "recruitment"
              )
            }
          />

          <MainTabButton
            active={
              mainTab ===
              "drivers"
            }
            icon={
              <Users
                size={22}
              />
            }
            title="Tài xế"
            onClick={() =>
              setMainTab(
                "drivers"
              )
            }
          />

          <MainTabButton
            active={
              mainTab ===
              "assignment"
            }
            icon={
              <UserCog
                size={22}
              />
            }
            title="Phân công tài xế"
            onClick={() =>
              setMainTab(
                "assignment"
              )
            }
          />
        </div>
                {/* ================= RECRUITMENT ================= */}

        {mainTab ===
          "recruitment" && (
          <>
            <div className="flex items-center gap-10">

              <SubTabButton
                active={
                  recruitTab ===
                  "campaign"
                }
                title="Đợt tuyển dụng"
                onClick={() =>
                  setRecruitTab(
                    "campaign"
                  )
                }
              />

              <SubTabButton
                active={
                  recruitTab ===
                  "application"
                }
                title="Hồ sơ xin việc"
                onClick={() =>
                  setRecruitTab(
                    "application"
                  )
                }
              />
            </div>

            <TopBar
              total={
                totalCount
              }
              buttonText={
                recruitTab ===
                "campaign"
                  ? "Tạo đợt tuyển dụng"
                  : ""
              }
              onClick={
                handleTopAction
              }
              hideButton={
                recruitTab ===
                "application"
              }
            />
            {/* RECRUITMENT STATS */}

            {mainTab === "recruitment" && (
            <StatsGrid>
                <StatCard
                title="Đợt tuyển dụng"
                value={
                    recruitmentStats.totalCampaigns
                }
                icon={<FileText />}
                color="bg-orange-100 text-orange-600"
                />

                <StatCard
                title="Đang tuyển"
                value={
                    recruitmentStats.activeCampaigns
                }
                icon={<Clock3 />}
                color="bg-green-100 text-green-600"
                />

                <StatCard
                title="Hồ sơ ứng tuyển"
                value={
                    recruitmentStats.totalApplications
                }
                icon={<Users />}
                color="bg-blue-100 text-blue-600"
                />

                <StatCard
                    title="Đã duyệt"
                    value={
                        recruitmentStats.approvedApplications
                    }
                    icon={<ChevronDown />}
                    color="bg-green-100 text-green-600"
                />
            </StatsGrid>
            )}

            {loading && (
              <EmptyState text="Đang tải dữ liệu..." />
            )}

            {/* CAMPAIGNS */}

            {!loading &&
              recruitTab ===
                "campaign" && (
                <div className="space-y-5">
                  {campaigns.map(
                    (
                      item
                    ) => (
                      <RecruitmentCard
                        key={item.id}
                        item={item}
                        onClose={
                            handleCloseCampaign
                        }
                    />
                    )
                  )}

                  {campaigns.length ===
                    0 && (
                    <EmptyState text="Không có đợt tuyển dụng nào" />
                  )}
                </div>
              )}

            {/* APPLICATION */}

            {!loading &&
              recruitTab ===
                "application" && (
                <div className="space-y-5">

                  <div className="w-[400px]">
                    <select
                      value={
                        selectedCampaign
                      }
                      onChange={(
                        e
                      ) =>
                        setSelectedCampaign(
                          e
                            .target
                            .value
                        )
                      }
                      className="w-full border border-slate-300 rounded-2xl p-4 text-[17px]"
                    >
                      <option value="">
                        Tất cả
                        đợt tuyển dụng
                      </option>

                      {campaigns.map(
                        (
                          c
                        ) => (
                          <option
                            key={
                              c.id
                            }
                            value={
                              c.id
                            }
                          >
                            {
                              c.title
                            }
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  {applications.map(
                    (
                      item
                    ) => (
                      <ApplicationCard
                            key={item.id}
                            item={item}
                            onUpdateStatus={
                                handleUpdateApplicationStatus
                            }
                        />
                    )
                  )}

                  {applications.length ===
                    0 && (
                    <EmptyState text="Không có hồ sơ ứng tuyển" />
                  )}
                </div>
              )}
          </>
        )}

        {/* ================= DRIVER ================= */}

        {mainTab ===
          "drivers" && (
          <>
            <TopBar
              total={
                totalCount
              }
              buttonText="Thêm tài xế"
              onClick={
                handleTopAction
              }
            />

            <StatsGrid>
                <StatCard
                    title="Tổng tài xế"
                    value={
                    driverStats.totalDrivers
                    }
                    icon={<Users />}
                    color="bg-blue-100 text-blue-600"
                />

                <StatCard
                    title="Đang hoạt động"
                    value={
                    driverStats.activeDrivers
                    }
                    icon={<UserCog />}
                    color="bg-green-100 text-green-600"
                />

                <StatCard
                    title="Sẵn sàng nhận chuyến"
                    value={
                    driverStats.availableDrivers
                    }
                    icon={<Truck />}
                    color="bg-orange-100 text-orange-600"
                />

                <StatCard
                    title="Đang phân công"
                    value={
                        assignments.length
                    }
                    icon={<Clock3 />}
                    color="bg-purple-100 text-purple-600"
                />
                </StatsGrid>

            {loading && (
              <EmptyState text="Đang tải dữ liệu..." />
            )}

            {!loading && (
              <div className="space-y-5">

                {drivers.map(
                  (
                    item
                  ) => (
                    <DriverCard
                        key={item.id}
                        item={item}
                        onEdit={(d) => {
                            setSelectedDriver(
                            d
                            );

                            setOpenEditDriverModal(
                            true
                            );
                        }}
                        onView={(d) => {
                            setSelectedDriver(
                            d
                            );

                            setOpenDriverDetailModal(
                            true
                            );
                        }}
                        onInactive={
                            handleInactiveDriver
                        }
                    />
                  )
                )}

                {drivers.length ===
                  0 && (
                  <EmptyState text="Không có tài xế nào" />
                )}
              </div>
            )}
          </>
        )}

        {/* ================= ASSIGNMENT ================= */}

        {mainTab ===
          "assignment" && (
          <>
            <div className="flex items-center gap-10">

              <SubTabButton
                active={
                  assignmentTab ===
                  "vehicle"
                }
                title="Phân công phương tiện"
                onClick={() =>
                  setAssignmentTab(
                    "vehicle"
                  )
                }
              />

              <SubTabButton
                active={
                  assignmentTab ===
                  "work"
                }
                title="Theo dõi giờ làm việc"
                onClick={() =>
                  setAssignmentTab(
                    "work"
                  )
                }
              />
            </div>

            <TopBar
              total={
                totalCount
              }
              buttonText="Phân công mới"
              onClick={
                handleTopAction
              }
              hideButton={
                assignmentTab ===
                "work"
              }
            />

            {!loading &&
              assignmentTab ===
                "vehicle" && (
                <div className="space-y-5">

                  {assignments.map(
                    (
                      item
                    ) => (
                      <AssignmentCard
                        key={item.id}
                        item={item}
                        onDeactivate={
                            handleDeactivateAssignment
                        }
                    />
                    )
                  )}

                  {assignments.length ===
                    0 && (
                    <EmptyState text="Không có phân công nào" />
                  )}
                </div>
              )}

            {!loading &&
              assignmentTab ===
                "work" && (
                <div className="space-y-5">

                  {workLogs.length ===
                    0 && (
                    <EmptyState text="Không có dữ liệu giờ làm việc" />
                  )}
                </div>
              )}
          </>
        )}
      </div>
    </>
  );
}
/* =========================
   COMPONENTS
========================= */

function MainTabButton({
  active,
  title,
  icon,
  onClick,
}: {
  active: boolean;
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`pb-5 border-b-2 flex items-center gap-3 text-[17px] font-semibold transition ${
        active
          ? "border-orange-500 text-orange-500"
          : "border-transparent text-slate-400 hover:text-slate-600"
      }`}
    >
      {icon}
      {title}
    </button>
  );
}

function SubTabButton({
  active,
  title,
  onClick,
}: {
  active: boolean;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`pb-4 border-b-2 text-[17px] font-semibold transition ${
        active
          ? "border-orange-500 text-orange-500"
          : "border-transparent text-slate-400"
      }`}
    >
      {title}
    </button>
  );
}

function TopBar({
  total,
  buttonText,
  onClick,
  hideButton = false,
}: {
  total: string;
  buttonText: string;
  onClick?: () => void;
  hideButton?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-[18px] text-slate-400">
        Tổng số:{" "}
        <span className="font-bold text-slate-800">
          {total}
        </span>
      </p>

      {!hideButton && (
        <button
          onClick={onClick}
          className="bg-orange-500 hover:bg-orange-600 text-white px-7 py-4 rounded-2xl font-bold text-[18px] flex items-center gap-3 transition"
        >
          <Plus size={22} />
          {buttonText}
        </button>
      )}
    </div>
  );
}

/* =========================
   CARD
========================= */

function RecruitmentCard({
  item,
  onClose,
}: {
  item: RecruitmentCampaign;
  onClose: (
    id: number
  ) => void;
}) {
  return (
    <div className="bg-white rounded-[26px] border border-slate-200 shadow-sm p-8">
      <div className="flex justify-between">

        <div>
          <div className="flex items-center gap-4 mb-4">

            <h2 className="text-[24px] font-bold text-slate-900">
              {item.title}
            </h2>

            <StatusBadge
              status={item.status}
            />
          </div>

          <p className="text-[17px] text-slate-500">
            {item.description}
          </p>
        </div>

        <Menu
            button={
                <button className="text-slate-400 hover:text-slate-700 transition">
                <MoreVertical size={24} />
                </button>
            }
            >
            <MenuItem
                onClick={() =>
                onClose(item.id)
                }
            >
                Đóng tuyển
            </MenuItem>
            </Menu>
      </div>

      <div className="border-t border-slate-200 mt-6 pt-6 grid grid-cols-2 gap-5">

        <Info
          icon={
            <Calendar
              size={18}
            />
          }
          text={`Bắt đầu: ${formatDate(
            item.startDate
          )}`}
        />

        <Info
          icon={
            <Calendar
              size={18}
            />
          }
          text={`Kết thúc: ${formatDate(
            item.endDate
          )}`}
        />
      </div>
    </div>
  );
}

function DriverCard({
  item,
  onEdit,
  onView,
  onInactive,
}: {
  item: Driver;
  onEdit: (
    driver: Driver
  ) => void;
  onView: (
    driver: Driver
  ) => void;
  onInactive: (
    id: number
  ) => void;
}){
  return (
    <div className="bg-white rounded-[26px] border border-slate-200 shadow-sm p-8">

      <div className="flex justify-between">

        <div className="w-full">
          <div className="flex items-center gap-4 mb-6">

            <h2 className="text-[24px] font-bold text-slate-900">
              {item.fullName}
            </h2>

            <StatusBadge
              status={item.status}
            />
          </div>

          <div className="grid grid-cols-2 gap-6 text-slate-500">

            <Info
              icon={
                <Phone
                  size={18}
                />
              }
              text={item.phone}
            />

            <Info
              icon={
                <Mail
                  size={18}
                />
              }
              text={item.email}
            />

            <Info
              icon={
                <CreditCard
                  size={18}
                />
              }
              text={`GPLX: ${item.licenseNumber}`}
            />

            <Info
              icon={
                <Calendar
                  size={18}
                />
              }
              text={`Hết hạn: ${formatDate(
                item.licenseExpiry
              )}`}
            />
          </div>
        </div>

        <Menu
            button={
                <button className="text-slate-400 hover:text-slate-700 transition">
                <MoreVertical size={24} />
                </button>
            }
            >

            <MenuItem
                onClick={() =>
                onEdit(item)
                }
            >
                Chỉnh sửa
            </MenuItem>

            <MenuItem
                onClick={() =>
                onView(item)
                }
            >
                Xem chi tiết
            </MenuItem>

            <MenuItem
                onClick={() =>
                onInactive(
                    item.id
                )
                }
            >
                Ngừng hoạt động
            </MenuItem>
        </Menu>
      </div>
    </div>
  );
}

function ApplicationCard({
  item,
  onUpdateStatus,
}: {
  item: JobApplication;
  onUpdateStatus: (
    id: number,
    status: string
  ) => void;
}) {
  return (
    <div className="bg-white rounded-[26px] border border-slate-200 shadow-sm p-8">

      <div className="flex justify-between">

        <div className="w-full">
          <div className="flex items-center gap-4 mb-4">

            <h2 className="text-[24px] font-bold text-slate-900">
              {item.fullName}
            </h2>

            <StatusBadge
              status={item.status}
            />
          </div>

          <p className="text-[17px] text-slate-500 mb-5">
            Ứng tuyển:
            {" "}
            {item.campaignName}
          </p>

          <div className="grid grid-cols-2 gap-5 text-slate-500">

            <Info
              icon={
                <Phone
                  size={18}
                />
              }
              text={item.phone}
            />

            <Info
              icon={
                <Mail
                  size={18}
                />
              }
              text={item.email}
            />

            <Info
              icon={
                <MapPin
                  size={18}
                />
              }
              text={
                item.address
              }
            />

            <Info
              icon={
                <Users
                  size={18}
                />
              }
              text={`${item.experienceYears} năm kinh nghiệm`}
            />
          </div>
        </div>

        <Menu
            button={
                <button className="text-slate-400 hover:text-slate-700 transition">
                <MoreVertical size={24} />
                </button>
            }
            >

            <MenuItem
                onClick={() =>
                onUpdateStatus(
                    item.id,
                    "REVIEWING"
                )
                }
            >
                Đang xem xét
            </MenuItem>

            <MenuItem
                onClick={() =>
                onUpdateStatus(
                    item.id,
                    "INTERVIEW"
                )
                }
            >
                Hẹn phỏng vấn
            </MenuItem>

            <MenuItem
                onClick={() =>
                onUpdateStatus(
                    item.id,
                    "APPROVED"
                )
                }
            >
                Duyệt hồ sơ
            </MenuItem>

            <MenuItem
                onClick={() =>
                onUpdateStatus(
                    item.id,
                    "REJECTED"
                )
                }
            >
                Từ chối
            </MenuItem>
        </Menu>
      </div>
    </div>
  );
}

function AssignmentCard({
  item,
  onDeactivate,
}: {
  item: Assignment;
  onDeactivate: (
    id: number
  ) => void;
}){
  return (
    <div className="bg-white rounded-[26px] border border-slate-200 shadow-sm p-8">

      <div className="flex justify-between items-center">

        <div>
          <h2 className="text-[24px] font-bold text-slate-900">
            {item.driverName}
          </h2>

          <p className="text-[17px] text-slate-500 mt-1">
            Phương tiện:
            {" "}
            {item.plateNumber}
          </p>
        </div>

        <div className="text-right">
          <p className="text-[16px] text-slate-400">
            Ngày bắt đầu
          </p>

          <p className="font-semibold text-slate-900 text-[18px]">
            {formatDate(
              item.assignedDate
            )}
          </p>
        </div>

        <Menu
            button={
                <button className="text-slate-400 hover:text-slate-700 transition">
                <MoreVertical size={24} />
                </button>
            }
        >
        <MenuItem
            onClick={() =>
            onDeactivate(
                item.id
            )
            }
        >
            Kết thúc phân công
        </MenuItem>
        </Menu>
      </div>
    </div>
  );
}

/* =========================
   COMMON
========================= */

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const isGreen =
    status?.includes(
      "ACTIVE"
    ) ||
    status?.includes(
      "Đang"
    );

  return (
    <span
      className={`px-5 py-2 rounded-full text-[15px] font-semibold ${
        isGreen
          ? "bg-green-100 text-green-700"
          : "bg-yellow-100 text-yellow-700"
      }`}
    >
      {status}
    </span>
  );
}

function Info({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-slate-400">
        {icon}
      </span>

      <span className="text-[16px] text-slate-700">
        {text || "-"}
      </span>
    </div>
  );
}

function EmptyState({
  text,
}: {
  text: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-500">
      {text}
    </div>
  );
}

function StatsGrid({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-4 gap-5">
      {children}
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="bg-white rounded-[28px] border border-slate-200 p-7 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color}`}
        >
          {icon}
        </div>
      </div>

      <h2 className="text-[34px] font-bold text-slate-900">
        {value}
      </h2>

      <p className="text-[16px] text-slate-500 mt-1">
        {title}
      </p>
    </div>
  );
}

/* =========================
   HELPER
========================= */

function formatDate(
  date?: string
) {
  if (!date)
    return "-";

  return new Date(
    date
  ).toLocaleDateString(
    "vi-VN"
  );
}
function Menu({
    button,
    children,
    }: {
    button: React.ReactNode;
    children: React.ReactNode;
    }) {
    const [open, setOpen] =
        useState(false);

    return (
        <div className="relative">

        <div
            onClick={() =>
            setOpen(!open)
            }
            className="cursor-pointer"
        >
            {button}
        </div>

        {open && (
            <>
            {/* overlay để click ngoài đóng menu */}
            <div
                className="fixed inset-0 z-40"
                onClick={() =>
                setOpen(false)
                }
            />

            <div className="absolute right-0 top-10 bg-white rounded-2xl shadow-xl border border-slate-200 min-w-[220px] z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                {React.Children.map(
                children,
                (child) =>
                    React.isValidElement(
                    child
                    )
                    ? React.cloneElement(
                        child as React.ReactElement<any>,
                        {
                            onClose:
                            () =>
                                setOpen(
                                false
                                ),
                        }
                        )
                    : child
                )}
            </div>
            </>
        )}
        </div>
    );
    }

function MenuItem({
    children,
    onClick,
    onClose,
    }: {
    children: React.ReactNode;
    onClick: () => void;
    onClose?: () => void;
    }) {
    return (
        <button
        onClick={() => {
            onClick();
            onClose?.();
        }}
        className="w-full px-5 py-4 text-left hover:bg-slate-100 transition text-[15px]"
        >
        {children}
        </button>
    );
    }