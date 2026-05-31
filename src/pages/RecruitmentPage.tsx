import {
  ChevronDown,
  Clock3,
  FileText,
  Truck,
  UserCog,
  Users,
} from "lucide-react";


import RecruitmentCard from "../components/recruitment/cards/RecruitmentCard";
import DriverCard from "../components/recruitment/cards/DriverCard";
import ApplicationCard from "../components/recruitment/cards/ApplicationCard";
import AssignmentCard from "../components/recruitment/cards/AssignmentCard";

import TopBar from "../components/recruitment/common/TopBar";
import MainTabButton from "../components/recruitment/common/MainTabButton";
import SubTabButton from "../components/recruitment/common/SubTabButton";
import EmptyState from "../components/recruitment/common/EmptyState";
import StatsGrid from "../components/recruitment/common/StatsGrid";
import StatCard from "../components/recruitment/common/StatCard";

import CreateCampaignModal from "../components/recruitment/CreateCampaignModal";
import AddDriverModal from "../components/recruitment/AddDriverModal";
import CreateAssignmentModal from "../components/recruitment/CreateAssignmentModal";
import DriverDetailModal from "../components/recruitment/DriverDetailModal";
import EditDriverModal from "../components/recruitment/EditDriverModal";

import useRecruitmentData from "../hooks/useRecruitmentData";
import WorkLogList from "../components/recruitment/cards/WorkLogList";



export default function RecruitmentPage() {
  const {
    // tabs
    mainTab,
    setMainTab,

    recruitTab,
    setRecruitTab,

    assignmentTab,
    setAssignmentTab,

    // loading
    loading,

    // data
    campaigns,
    applications,
    drivers,
    assignments,
    availableDrivers,
    availableVehicles,
    workLogs,

    // modal
    openCampaignModal,
    setOpenCampaignModal,

    openDriverModal,
    setOpenDriverModal,

    openAssignmentModal,
    setOpenAssignmentModal,

    openEditDriverModal,
    setOpenEditDriverModal,

    openDriverDetailModal,
    setOpenDriverDetailModal,

    // selected
    selectedDriver,
    setSelectedDriver,

    // filter
    selectedCampaign,
    setSelectedCampaign,

    // stats
    recruitmentStats,
    driverStats,
    totalCount,

    // actions
    handleCloseCampaign,
    handleUpdateApplicationStatus,
    handleInactiveDriver,
    handleDeactivateAssignment,

    // reload
    loadData,
  } = useRecruitmentData();

  const handleTopAction = () => {
    if (
      mainTab === "recruitment" &&
      recruitTab === "campaign"
    ) {
      setOpenCampaignModal(true);
      return;
    }

    if (mainTab === "drivers") {
      setOpenDriverModal(true);
      return;
    }

    if (
      mainTab === "assignment" &&
      assignmentTab === "vehicle"
    ) {
      setOpenAssignmentModal(true);
    }
  };

  return (
    <>
      {/* ================= MODALS ================= */}

      <CreateCampaignModal
        open={openCampaignModal}
        onClose={() =>
          setOpenCampaignModal(false)
        }
        onSuccess={loadData}
      />

      <EditDriverModal
        open={openEditDriverModal}
        onClose={() =>
          setOpenEditDriverModal(false)
        }
        onSuccess={loadData}
        driver={selectedDriver}
      />

      <DriverDetailModal
        open={openDriverDetailModal}
        onClose={() =>
          setOpenDriverDetailModal(false)
        }
        driver={selectedDriver}
      />

      <AddDriverModal
        open={openDriverModal}
        onClose={() =>
          setOpenDriverModal(false)
        }
        onSuccess={loadData}
      />

      <CreateAssignmentModal
        open={openAssignmentModal}
        onClose={() =>
          setOpenAssignmentModal(false)
        }
        onSuccess={loadData}
        drivers={availableDrivers}
        vehicles={availableVehicles}
      />

      <div className="space-y-7">
        {/* ================= MAIN TAB ================= */}

        <div className="flex items-center gap-12 border-b border-slate-200">
          <MainTabButton
            active={
              mainTab === "recruitment"
            }
            icon={<FileText size={22} />}
            title="Tuyển dụng"
            onClick={() =>
              setMainTab(
                "recruitment"
              )
            }
          />

          <MainTabButton
            active={
              mainTab === "drivers"
            }
            icon={<Users size={22} />}
            title="Tài xế"
            onClick={() =>
              setMainTab("drivers")
            }
          />

          <MainTabButton
            active={
              mainTab === "assignment"
            }
            icon={<UserCog size={22} />}
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
              total={totalCount}
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

            {/* ================= STATS ================= */}

            <StatsGrid>
              <StatCard
                title="Đợt tuyển dụng"
                value={
                  recruitmentStats.totalCampaigns
                }
                icon={
                  <FileText />
                }
                color="bg-orange-100 text-orange-600"
              />

              <StatCard
                title="Đang tuyển"
                value={
                  recruitmentStats.activeCampaigns
                }
                icon={
                  <Clock3 />
                }
                color="bg-green-100 text-green-600"
              />

              <StatCard
                title="Hồ sơ ứng tuyển"
                value={
                  recruitmentStats.totalApplications
                }
                icon={
                  <Users />
                }
                color="bg-blue-100 text-blue-600"
              />

              <StatCard
                title="Đã duyệt"
                value={
                  recruitmentStats.approvedApplications
                }
                icon={
                  <ChevronDown />
                }
                color="bg-green-100 text-green-600"
              />
            </StatsGrid>

            {loading && (
              <EmptyState text="Đang tải dữ liệu..." />
            )}

            {/* ================= CAMPAIGN ================= */}

            {!loading &&
              recruitTab ===
                "campaign" && (
                <div className="space-y-5">
                  {campaigns.map(
                    (
                      item
                    ) => (
                      <RecruitmentCard
                        key={
                          item.id
                        }
                        item={
                          item
                        }
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

            {/* ================= APPLICATION ================= */}

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
                          e.target
                            .value
                        )
                      }
                      className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-300"
                    >
                      <option value="">
                        Tất cả đợt tuyển dụng
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
                            {c.title}
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
                        key={
                          item.id
                        }
                        item={
                          item
                        }
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
                icon={
                  <Users />
                }
                color="bg-blue-100 text-blue-600"
              />

              <StatCard
                title="ACTIVE"
                value={
                  driverStats.activeDrivers
                }
                icon={
                  <UserCog />
                }
                color="bg-green-100 text-green-600"
              />

              <StatCard
                title="AVAILABLE"
                value={
                  driverStats.availableDrivers
                }
                icon={
                  <Truck />
                }
                color="bg-orange-100 text-orange-600"
              />

              <StatCard
                title="HAVE TRIP"
                value={
                  assignments.length
                }
                icon={
                  <Clock3 />
                }
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
                      key={
                        item.id
                      }
                      item={
                        item
                      }
                      onEdit={(
                        d
                      ) => {
                        setSelectedDriver(
                          d
                        );

                        setOpenEditDriverModal(
                          true
                        );
                      }}
                      onView={(
                        d
                      ) => {
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
                        key={
                          item.id
                        }
                        item={
                          item
                        }
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
                <>

                  {workLogs.length >
                    0 && (

                    <WorkLogList
                      workLogs={
                        workLogs
                      }
                    />
                  )}

                  {workLogs.length ===
                    0 && (

                    <EmptyState text="Không có dữ liệu giờ làm việc" />
                  )}
                </>
            )}
          </>
        )}
      </div>
    </>
  );
}
