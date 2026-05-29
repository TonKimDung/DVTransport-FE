type Props = {
  total?: number;
  buttonText: string;
  onClick?: () => void;
};

export default function TopBar({
  total,
  buttonText,
  onClick,
}: Props) {
  return (
    <div className="flex items-center gap-4">
      
      {total !== undefined && (
        <div className="text-sm text-slate-500">
          Tổng:
          <span className="ml-1 font-bold text-slate-800">
            {total}
          </span>
        </div>
      )}

      <button
        type="button"
        onClick={onClick}
        className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-3 rounded-xl font-bold transition"
      >
        {buttonText}
      </button>
    </div>
  );
}