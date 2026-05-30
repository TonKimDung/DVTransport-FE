interface Props {
  status: string;
}

export default function StatusBadge({
  status,
}: Props) {

  const config = {
    ACTIVE:
      "bg-green-100 text-green-700",

    INACTIVE:
      "bg-red-100 text-red-700",

    REVIEWING:
      "bg-yellow-100 text-yellow-700",

    APPROVED:
      "bg-green-100 text-green-700",

    REJECTED:
      "bg-red-100 text-red-700",
  } as const;

  const label = {
    ACTIVE:
      "Đang hoạt động",

    INACTIVE:
      "Ngừng hoạt động",

    REVIEWING:
      "Đang xem xét",

    APPROVED:
      "Đã duyệt",

    REJECTED:
      "Đã từ chối",
  } as const;

  const style =
    config[
      status as keyof typeof config
    ] ||
    "bg-slate-100 text-slate-700";

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-semibold ${style}`}
    >
      {
        label[
          status as keyof typeof label
        ] || status
      }
    </span>
  );
}