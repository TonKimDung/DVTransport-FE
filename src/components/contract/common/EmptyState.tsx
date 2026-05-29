export default function EmptyState({
  text,
}: {
  text: string;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-slate-500">
      {text}
    </div>
  );
}