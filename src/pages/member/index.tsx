import Sidebar from "@/components/layout/memberPanel/sidebar";
import { useSession } from "next-auth/react";

const MemberPage = () => {
  const { data: session } = useSession();
  return (
    <div>
      <Sidebar></Sidebar>
    </div>
  );
};
export default MemberPage;
