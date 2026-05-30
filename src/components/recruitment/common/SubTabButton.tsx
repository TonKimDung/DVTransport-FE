interface Props {
  active: boolean;
  title: string;
  onClick: () => void;
}

export default function SubTabButton({
  active,
  title,
  onClick,
}: Props) {
  return (
    <button
      onClick={onClick}
      className={`pb-4 border-b-2 text-base font-semibold transition ${
        active
          ? "border-orange-500 text-orange-500"
          : "border-transparent text-slate-400"
      }`}
    >
      {title}
    </button>
  );
}