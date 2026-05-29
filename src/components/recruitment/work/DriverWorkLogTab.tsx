import EmptyState from "../common/EmptyState";

import WorkLogCard from "../cards/WorkLogCard";

type Props = {
  loading: boolean;
  workLogs: any[];
};

export default function DriverWorkLogTab({
  loading,
  workLogs,
}: Props) {

  if (loading) {
    return (
      <EmptyState text="Đang tải dữ liệu..." />
    );
  }

  return (
    <div className="space-y-5">

      {workLogs.map((item) => (
        <WorkLogCard
          key={item.id}
          item={item}
        />
      ))}

      {workLogs.length === 0 && (
        <EmptyState text="Không có dữ liệu giờ làm việc" />
      )}
    </div>
  );
}