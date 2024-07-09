import AdminProducts from "@/components/layout/adminPanel/adminProduct";
import Sidebar from "@/components/layout/adminPanel/sidebar";

const AdminProductPage = () => {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <AdminProducts />
    </div>
  );
};
export default AdminProductPage;
