interface Props {
  text: string;
}

export default function EmptyState({
  text,
}: Props) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
      {text}
    </div>
  );
}