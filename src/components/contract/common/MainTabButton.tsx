export default function MainTabButton({
  active,
  icon,
  title,
  onClick,
}: any) {
  return (
    <button
      onClick={onClick}
      className={`pb-5 flex items-center gap-3 border-b-2 transition-all ${
        active
          ? "border-orange-600 text-orange-600"
          : "border-transparent text-slate-500"
      }`}
    >
      {icon}

      <span className="font-bold text-lg">
        {title}
      </span>
    </button>
  );
}