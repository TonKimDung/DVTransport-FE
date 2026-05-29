import { Plus } from "lucide-react";

interface Props {
  total: string;
  buttonText: string;
  onClick?: () => void;
  hideButton?: boolean;
}

export default function TopBar({
  total,
  buttonText,
  onClick,
  hideButton = false,
}: Props) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-base text-slate-400">
        Tổng số:{" "}
        <span className="font-bold text-slate-800">
          {total}
        </span>
      </p>

      {!hideButton && (
        <button
          onClick={onClick}
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition"
        >
          <Plus size={22} />
          {buttonText}
        </button>
      )}
    </div>
  );
}