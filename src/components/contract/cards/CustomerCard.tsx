import { User, Phone, Mail, Eye } from "lucide-react";

type Props = {
  item: any;
  onDelete: (id: number) => void;
  onView?: (item: any) => void;
};

export default function CustomerCard({ item, onView }: Props) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 hover:shadow-md transition">

      {/* HEADER */}
      <div className="flex justify-between items-start">

        {/* LEFT */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <User size={22} />
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {item.name}
            </h3>
            <p className="text-sm text-slate-500">
              Khách hàng
            </p>
          </div>
        </div>

        {/* BADGE */}
        <span className="px-3 py-1 text-xs font-bold rounded-full bg-blue-50 text-blue-600">
          CUSTOMER
        </span>
      </div>

      {/* INFO */}
      <div className="mt-5 space-y-2 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <Phone size={16} />
          {item.phone}
        </div>

        <div className="flex items-center gap-2">
          <Mail size={16} />
          {item.email}
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-5 pt-4 border-t flex justify-between gap-3 items-center"> 
        {/* VIEW DETAIL */}
        <button
            onClick={() => onView?.(item)} 
            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2">
          <Eye size={22} />
          Xem chi tiết
        </button>
      </div>
    </div>
  );
}