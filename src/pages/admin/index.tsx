import Sidebar from "@/components/layout/adminPanel/sidebar";
import { useSession } from "next-auth/react";

const Dashboard = () => {
  const { data: session } = useSession();
  return (
    <main className="min-h-screen flex">
      <Sidebar />
    </main>
  );
};
export default Dashboard;
