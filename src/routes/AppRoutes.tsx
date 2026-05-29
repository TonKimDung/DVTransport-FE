import { Routes, Route } from "react-router";
import AdminLayout from "../layouts/AdminLayout";

function EmptyPage({ title }: { title: string }) {
  return <h1 className="text-2xl font-bold">{title}</h1>;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<EmptyPage title="Dashboard" />} />
        <Route path="recruitment" element={<EmptyPage title="Tuyển dụng" />} />
        <Route path="vehicles" element={<EmptyPage title="Phương tiện" />} />
        <Route path="fuel" element={<EmptyPage title="Nhiên liệu" />} />
        <Route path="trips" element={<EmptyPage title="Quản lý chuyến xe" />} />
        <Route path="orders" element={<EmptyPage title="Đơn vận chuyển" />} />
        <Route path="cost" element={<EmptyPage title="Chi phí" />}/>
        <Route path="risks" element={<EmptyPage title="An toàn & rủi ro" />} />
        <Route path="documents" element={<EmptyPage title="Chứng từ & pháp lý" />} />
        <Route path="reports" element={<EmptyPage title="Báo cáo và thống kê" />} />
      </Route>
    </Routes>
  );
}