import Sidebar from "@/components/layout/adminPanel/sidebar";
import Users from "@/components/layout/adminPanel/users";

const AdminUserpage = () => {
  return (
    <main className="min-h-screen flex">
      <Sidebar />
      <Users />
    </main>
  );
};
export default AdminUserpage;
