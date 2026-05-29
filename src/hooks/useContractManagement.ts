import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { contractService } from "../services/contractService";
import { customerService } from "../services/customerService";
import { partnerService } from "../services/partnerService";

import type {
  Contract,
  CreateContractRequest,
} from "../types/contract";

import type {
  Customer,
  CreateCustomerRequest,
} from "../types/customer";

import type {
  Partner,
  CreatePartnerRequest,
} from "../types/partner";

export default function useContractManagement() {

  const [loading, setLoading] =
    useState(false);

  const [mainTab, setMainTab] =
    useState<
      "contracts" | "customers" | "partners"
    >("contracts");

  const [contracts, setContracts] =
    useState<Contract[]>([]);

  const [customers, setCustomers] =
    useState<Customer[]>([]);

  const [partners, setPartners] =
    useState<Partner[]>([]);

  const [filterType, setFilterType] =
    useState("ALL");

  const [
    openContractModal,
    setOpenContractModal,
  ] = useState(false);

  const [
    openCustomerModal,
    setOpenCustomerModal,
  ] = useState(false);

  const [
    openPartnerModal,
    setOpenPartnerModal,
  ] = useState(false);

  const [availableCustomers, setAvailableCustomers] =
  useState<Customer[]>([]);

  const [availablePartners, setAvailablePartners] =
    useState<Partner[]>([]);

  // =========================
  // LOAD DATA
  // =========================

  const loadData = async () => {
    try {

      setLoading(true);

      const [
        contractData,
        customerData,
        partnerData,
        availableCustomerData,
        availablePartnerData,
      ] = await Promise.all([
        contractService.getAll(),
        customerService.getAll(),
        partnerService.getAll(),
        customerService.getAvailableContract(),
        partnerService.getAvailableContract(),
      ]);

      setContracts(
        Array.isArray(contractData)
          ? contractData
          : []
      );

      setCustomers(
        Array.isArray(customerData)
          ? customerData
          : []
      );

      setPartners(
        Array.isArray(partnerData)
          ? partnerData
          : []
      );

      setAvailableCustomers(
        Array.isArray(availableCustomerData)
          ? availableCustomerData
          : []
      );

      setAvailablePartners(
        Array.isArray(availablePartnerData)
          ? availablePartnerData
          : []
      );

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // =========================
  // FILTER CONTRACT
  // =========================

  const filteredContracts =
    useMemo(() => {

      if (filterType === "ALL") {
        return contracts;
      }

      return contracts.filter(
        (x) =>
          x.contractType === filterType
      );

    }, [
      contracts,
      filterType,
    ]);

  // =========================
  // CREATE
  // =========================

  const createContract = async (
    data: CreateContractRequest
  ) => {

    try {

      await contractService.create(data);

      await loadData();

    } catch (err) {

      console.error(err);

      alert(
        "Tạo hợp đồng thất bại"
      );
    }
  };

  const createCustomer = async (
    data: CreateCustomerRequest
  ) => {

    try {

      await customerService.create(data);

      await loadData();

    } catch (err) {

      console.error(err);

      alert(
        "Tạo khách hàng thất bại"
      );
    }
  };

  const createPartner = async (
    data: CreatePartnerRequest
  ) => {

    try {

      await partnerService.create(data);

      await loadData();

    } catch (err) {

      console.error(err);

      alert(
        "Tạo đối tác thất bại"
      );
    }
  };

  // =========================
  // DELETE
  // =========================

  const deleteContract = async (
    id: number
  ) => {

    try {

      await contractService.delete(id);

      await loadData();

    } catch (err) {

      console.error(err);

      alert(
        "Xóa hợp đồng thất bại"
      );
    }
  };

  const deleteCustomer = async (
    id: number
  ) => {

    try {

      await customerService.delete(id);

      await loadData();

    } catch (err) {

      console.error(err);

      alert(
        "Xóa khách hàng thất bại"
      );
    }
  };

  const deletePartner = async (
    id: number
  ) => {

    try {

      await partnerService.delete(id);

      await loadData();

    } catch (err) {

      console.error(err);

      alert(
        "Xóa đối tác thất bại"
      );
    }
  };

  return {

    // =========================
    // STATE
    // =========================

    loading,

    mainTab,
    setMainTab,

    contracts,
    customers,
    partners,

    availableCustomers,
    availablePartners,

    filterType,
    setFilterType,

    filteredContracts,

    // =========================
    // MODAL
    // =========================

    openContractModal,
    setOpenContractModal,

    openCustomerModal,
    setOpenCustomerModal,

    openPartnerModal,
    setOpenPartnerModal,

    // =========================
    // ACTION
    // =========================

    createContract,
    createCustomer,
    createPartner,

    deleteContract,
    deleteCustomer,
    deletePartner,

    // =========================
    // RELOAD
    // =========================

    loadData,
  };
}