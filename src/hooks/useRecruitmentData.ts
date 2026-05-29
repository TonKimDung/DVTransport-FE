import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { recruitmentService } from "../services/recruitmentService";

import { driverService } from "../services/driverService";

import { assignmentService } from "../services/assignmentService";

import { vehicleService } from "../services/vehicleService";

import type {
  RecruitmentCampaign,
  JobApplication,
} from "../types/recruitment";

import type {
  Driver,
} from "../types/driver";

import type {
  Assignment,
} from "../types/assignment";

import type {
  ApplicationStatus,
} from "../types/status/applicationStatus";

import type {
  MainTab,
  RecruitTab,
  AssignmentTab,
} from "../types/recruitment/mainTab";

import { driverLicenseService } from "../services/driverLicenseService";

import { driverWorkLogService } from "../services/driverWorkLogService";
import type { DriverWorkLog } from "../types/driverWorkLog";
import useDriverWorkLogRealtime from "./useDriverWorkLogRealtime";

export default function useRecruitmentData() {

  // =====================
  // TABS
  // =====================

  const [mainTab,
    setMainTab] =
    useState<MainTab>(
      "recruitment"
    );

  const [recruitTab,
    setRecruitTab] =
    useState<RecruitTab>(
      "campaign"
    );

  const [assignmentTab,
    setAssignmentTab] =
    useState<AssignmentTab>(
      "vehicle"
    );

  // =====================
  // LOADING
  // =====================

  const [loading,
    setLoading] =
    useState(false);

  // =====================
  // DATA
  // =====================

  const [campaigns,
    setCampaigns] =
    useState<
      RecruitmentCampaign[]
    >([]);

  const [applications,
    setApplications] =
    useState<
      JobApplication[]
    >([]);

  const [drivers,
    setDrivers] =
    useState<
      Driver[]
    >([]);

  const [assignments,
    setAssignments] =
    useState<
      Assignment[]
    >([]);

  const [vehicles,
    setVehicles] =
    useState<any[]>([]);

  const [availableDrivers,
    setAvailableDrivers] =
    useState<Driver[]>(
      []
    );

  const [workLogs, setWorkLogs] = useState<DriverWorkLog[]>([]);

  const [availableVehicles,
    setAvailableVehicles] =
    useState<any[]>([]);

  // =====================
  // MODAL
  // =====================

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

  const [
    openEditDriverModal,
    setOpenEditDriverModal,
  ] = useState(false);

  const [
    openDriverDetailModal,
    setOpenDriverDetailModal,
  ] = useState(false);

  // =====================
  // DRIVER
  // =====================

  const [
    selectedDriver,
    setSelectedDriver,
  ] =
    useState<Driver | null>(
      null
    );

  // =====================
  // FILTER
  // =====================

  const [
    selectedCampaign,
    setSelectedCampaign,
  ] = useState("");

  const loadWorkLogs =
  async () => {

    try {

      const data =
        await driverWorkLogService.getAll();

      setWorkLogs(data);

    } catch (err) {

      console.error(err);
    }
  };
  // =====================
  // LOAD
  // =====================

  useDriverWorkLogRealtime({
    setWorkLogs,
  });

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
  }, [
    selectedCampaign
  ]);

  const loadData =
    async () => {

    try {

      setLoading(true);

      const [
        campaignRes,
        driverRes,
        assignmentRes,
        vehicleRes,
        availableDriverRes,
        availableVehicleRes,
        workLogData,
      ] = await Promise.all([
          recruitmentService.getCampaigns(),

          driverService.getAll(),

          assignmentService.getAll(),

          vehicleService.getAll(),

          driverService.getAvailable(),

          vehicleService.getAvailable(),
          
          driverWorkLogService.getAll(),
        ]);

      setCampaigns(
        campaignRes || []
      );

      setDrivers(
        driverRes || []
      );

      setAssignments(
        assignmentRes || []
      );

      setVehicles(
        vehicleRes || []
      );

      setAvailableDrivers(
        availableDriverRes ||
        []
      );

      setAvailableVehicles(
        availableVehicleRes ||
        []
      );

      setWorkLogs(
        Array.isArray(workLogData)
          ? workLogData
          : []
      );

      await loadApplications();

    } catch (error) {

      console.error(
        error
      );

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
        JobApplication[]
        = [];

      if (
        selectedCampaign
      ) {

        data =
          await recruitmentService
          .getApplicationsByCampaign(
            Number(
              selectedCampaign
            )
          );

      } else {

        data =
          await recruitmentService
          .getApplications();
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

  // =====================
  // TOTAL
  // =====================

  const totalCount =
    useMemo(() => {

      if (
        mainTab ===
          "recruitment"
        &&
        recruitTab ===
          "campaign"
      ) {
        return `${campaigns.length} đợt tuyển dụng`;
      }

      if (
        mainTab ===
          "recruitment"
        &&
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
          "assignment"
        &&
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

  // =====================
  // STATS
  // =====================

  const recruitmentStats =
    useMemo(() => {

      const activeCampaigns =
        campaigns.filter(
          (c) =>
            c.status?.toUpperCase()
            === "ACTIVE"
        ).length;

      const approvedApplications =
        applications.filter(
          (a) => {

            const status =
              a.status?.toUpperCase();

            return (
              status ===
                "APPROVED"
              ||
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

  const driverStats =
    useMemo(() => {

      const activeDrivers =
        drivers.filter(
          (d) =>
            d.status?.toUpperCase()
            === "ACTIVE"
        ).length;

      const availableDrivers =
        drivers.filter(
          (d: any) =>
            d.isAvailable
            === true
        ).length;

      return {
        totalDrivers:
          drivers.length,

        activeDrivers,

        availableDrivers,
      };

    }, [drivers]);

  // =====================
  // ACTION
  // =====================

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

        await recruitmentService
          .closeCampaign(
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

    const handleUpdateApplicationStatus = async (
  application: JobApplication,
  status: ApplicationStatus
) => {

  try {

    if (
      application.status === "APPROVED" ||
      application.status === "REJECTED"
    ) {

      alert(
        "Hồ sơ đã xét duyệt không thể thay đổi trạng thái."
      );

      return;
    }

    await recruitmentService
      .updateApplicationStatus(
        application.id,
        status
      );

    // =========================
    // APPROVED
    // =========================

    if (status === "APPROVED") {

      console.log(
        "status:",
        status
      );

      const existedDriver =
        drivers.find(
          (d) =>
            d.email === application.email ||
            d.phone === application.phone
        );

      console.log(
        "driver:",
        existedDriver
      );

      // =========================
      // CREATE DRIVER
      // =========================

      if (!existedDriver) {

        const driverPayload = {

          fullName:
            application.fullName,

          phone:
            application.phone,

          email:
            application.email,

          address:
            application.address,

          licenseNumber:
            application.licenseNumber,

          licenseExpiry:
            application.licenseExpiry,
        };

        console.log(
          "CREATE DRIVER PAYLOAD",
          driverPayload
        );

        const createdDriver =
          await driverService.create(
            driverPayload
          );

        console.log(
          "CREATED DRIVER",
          createdDriver
        );

        // =========================
        // CREATE DRIVER LICENSE
        // =========================

        const licensePayload = {

          driverId:
            createdDriver.id,

          licenseNumber:
            application.licenseNumber,

          licenseClass:
            application.licenseClass,

          issueDate:
            application.licenseIssueDate,

          expiryDate:
            application.licenseExpiry,

          status:
            "ACTIVE",
          
            fileUrl:
            "",
        };

        console.log(
          "CREATE LICENSE PAYLOAD",
          licensePayload
        );

        await driverLicenseService.create(
          licensePayload
        );

        console.log(
          "DRIVER LICENSE CREATED"
        );
      }

      alert(
        "Đã duyệt hồ sơ và thêm tài xế"
      );
    }

    await loadData();

  } catch (error: any) {

    console.error(
      "FULL ERROR",
      error
    );

    console.error(
      "RESPONSE DATA",
      error.response?.data
    );

    console.error(
      "STATUS",
      error.response?.status
    );

    alert(
      JSON.stringify(
        error.response?.data
      )
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

        await driverService
          .updateStatus(
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

        await assignmentService
          .deactivate(
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

  return {

    // tab
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
    vehicles,
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

    loadData,
  };
}