import { useMemo, useState } from "react";
import {
  FileText,
  Users,
  Handshake,
} from "lucide-react";

import useContractManagement from "../hooks/useContractManagement";

import MainTabButton from "../components/contract/common/MainTabButton";
import TopBar from "../components/contract/common/TopBar";
import EmptyState from "../components/contract/common/EmptyState";

import ContractCard from "../components/contract/cards/ContractCard";
import CustomerCard from "../components/contract/cards/CustomerCard";
import PartnerCard from "../components/contract/cards/PartnerCard";

import CreateContractModal from "../components/contract/modal/CreateContractModal"

import StatCard from "../components/StatCard";
import ContractDetailModal from "../components/contract/modal/ContractDetailModal";
import DeleteConfirmModal from "../components/contract/common/DeleteConfirmModal";
import CreateCustomerModal from "../components/contract/modal/CreateCustomerModal";
import CreatePartnerModal from "../components/contract/modal/CreatePartnerModal";
import CustomerDetailModal from "../components/contract/modal/CustomerDetailModal";
import PartnerDetailModal from "../components/contract/modal/PartnerDetailModal";

type FilterType = "ALL" | "TX" | "KH" | "DT";

export default function ContractManagementPage() {
  const {
    loading,
    mainTab,
    setMainTab,
    filteredContracts,
    customers,
    partners,
    availableCustomers,
    availablePartners,
    filterType,
    setFilterType,
    createCustomer,
    createPartner,
    deleteContract,
    deleteCustomer,
    deletePartner,
  } = useContractManagement();

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [ openCustomerCreate, setOpenCustomerCreate] = useState(false);

  const [openPartnerCreate, setOpenPartnerCreate] = useState(false);
  const [selectedContract, setSelectedContract] = useState<any>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [selectedPartner, setSelectedPartner] = useState<any>(null);

  const stats = useMemo(() => {
    return [
      {
        icon: <FileText size={18} />,
        title: "Hợp đồng",
        value: filteredContracts.length,
        color: "blue" as const,
      },
      {
        icon: <Users size={18} />,
        title: "Khách hàng",
        value: customers.length,
        color: "green" as const,
      },
      {
        icon: <Handshake size={18} />,
        title: "Đối tác",
        value: partners.length,
        color: "yellow" as any,
      },
    ];
  }, [filteredContracts, customers, partners]);

const [deleteModal, setDeleteModal] = useState(false);

const [selectedId, setSelectedId] = useState<number | null>(null);
const [deleteLoading, setDeleteLoading] = useState(false);

const handleDeleteClick = (
  id: number
) => {
  setSelectedId(id);
  setDeleteModal(true);
};

const handleConfirmDelete =
  async () => {
    try {
      setDeleteLoading(true);

      await deleteContract(
        selectedId!
      );

      setDeleteModal(false);
      setSelectedId(null);

    } catch (err) {
      console.error(err);
    } finally {
      setDeleteLoading(false);
    }
  };
  return (
    <div className="space-y-6 text-sm">

      {/* TAB */}
      <div className="flex items-center gap-10 border-b border-slate-200">
        <MainTabButton
          active={mainTab === "contracts"}
          icon={<FileText size={18} />}
          title="Hợp đồng"
          onClick={() => setMainTab("contracts")}
        />

        <MainTabButton
          active={mainTab === "customers"}
          icon={<Users size={18} />}
          title="Khách hàng"
          onClick={() => setMainTab("customers")}
        />

        <MainTabButton
          active={mainTab === "partners"}
          icon={<Handshake size={18} />}
          title="Đối tác"
          onClick={() => setMainTab("partners")}
        />
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {stats.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>

      {/* CONTRACTS */}
      {mainTab === "contracts" && (
        <>
          {/* HEADER + FILTER */}
        <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-4 flex items-center justify-end gap-4">

        {/* FILTER */}
        <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-500">
            Loại:
            </span>

            <select
            value={filterType}
            onChange={(e) =>
                setFilterType(e.target.value as FilterType)
            }
            className="text-sm border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-orange-200"
            >
            <option value="ALL">Tất cả</option>
            <option value="TX">TX</option>
            <option value="KH">KH</option>
            <option value="DT">DT</option>
            </select>
        </div>

        {/* TOP BAR (button + total) */}
        <TopBar
            total={filteredContracts.length}
            buttonText="Tạo hợp đồng"
            onClick={() => setOpenCreateModal(true)}
        />
        </div>

          {/* LOADING */}
          {loading && (
            <EmptyState text="Đang tải dữ liệu..." />
          )}

          {/* LIST */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredContracts.map((item) => (
              <ContractCard
                item={item}
                onDelete={handleDeleteClick}
                onView={(contract) =>
                  setSelectedContract(contract)
                }
              />
            ))}

            {filteredContracts.length === 0 && (
              <EmptyState text="Không có hợp đồng" />
            )}
          </div>
        </>
      )}

      {/* CUSTOMERS */}
      {mainTab === "customers" && (
        <>
          <div className="shadow-sm bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-end">
            <TopBar buttonText="Thêm khách hàng" 
                    onClick={() => setOpenCustomerCreate(true)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customers.map((item) => (
              <CustomerCard
                key={item.id}
                item={item}
                onDelete={deleteCustomer}
                onView={(customer) =>
                  setSelectedCustomer(customer)
                }
              />
            ))}
          </div>

          {customers.length === 0 && (
            <EmptyState text="Không có khách hàng" />
          )}
        </>
      )}

      {/* PARTNERS */}
      {mainTab === "partners" && (
        <>
          <div className="shadow-sm bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-end">
            <TopBar buttonText="Thêm đối tác" 
                    onClick={() => setOpenPartnerCreate(true)}/>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {partners.map((item) => (
              <PartnerCard
                key={item.id}
                item={item}
                onDelete={deletePartner}
                onView={(partner) =>
                  setSelectedPartner(partner)
                }
              />
            ))}
          </div>

          {partners.length === 0 && (
            <EmptyState text="Không có đối tác" />
          )}
        </>
      )}

      {openCreateModal && (
        <CreateContractModal
            customers={availableCustomers}
            partners={availablePartners}
            onClose={() => setOpenCreateModal(false)}
        />
        )}

      {openCustomerCreate && (
        <CreateCustomerModal
          onClose={() =>
            setOpenCustomerCreate(false)
          }
          onSubmit={createCustomer}
        />
      )}

      {openPartnerCreate && (
        <CreatePartnerModal
          onClose={() =>
            setOpenPartnerCreate(false)
          }
          onSubmit={createPartner}
        />
      )}

      {selectedContract && (
        <ContractDetailModal
          item={selectedContract}
          onClose={() =>
            setSelectedContract(null)
          }
        />)
      }
      {selectedCustomer && (
        <CustomerDetailModal
          item={selectedCustomer}
          onClose={() =>
            setSelectedCustomer(null)
          }
        />
      )}

      {selectedPartner && (
        <PartnerDetailModal
          item={selectedPartner}
          onClose={() =>
            setSelectedPartner(null)
          }
        />
      )}
    </div>
  );
}