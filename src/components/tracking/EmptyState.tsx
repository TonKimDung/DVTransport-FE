interface Props {
  text: string;
}

export default function EmptyState({
  text,
}: Props) {

  return (

    <div className="text-center text-slate-400 py-10">

      {text}

    </div>
  );
}