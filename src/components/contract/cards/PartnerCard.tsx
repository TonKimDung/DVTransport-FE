import {
  Building2,
  Eye,
  MapPin,
  Phone,
} from "lucide-react";

type Props = {
  item: any;
  onDelete: (id: number) => void;
  onView?: (item: any) => void;
};

export default function PartnerCard({
  item,
  onView,
}: Props) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 hover:shadow-md transition">
      
      {/* HEADER */}
      <div className="flex justify-between items-start">
        
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Building2 size={22} />
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {item.name}
            </h3>

            <p className="text-sm text-slate-500">
              Đối tác vận hành
            </p>
          </div>
        </div>

        <span className="px-3 py-1 text-xs font-bold rounded-full bg-purple-50 text-purple-600">
          PARTNER
        </span>
      </div>

      {/* INFO */}
      <div className="mt-5 space-y-3 text-sm text-slate-600">
        
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-slate-400" />
          <span>{item.address || "Chưa có địa chỉ"}</span>
        </div>

        <div className="flex items-center gap-2">
          <Phone size={16} className="text-slate-400" />
          <span>{item.phone || "Chưa có số điện thoại"}</span>
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