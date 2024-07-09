import Profile from "@/components/layout/memberPanel/profile";
import Sidebar from "@/components/layout/memberPanel/sidebar";

const ProfilePage = () => {
  return (
    <aside className="flex">
      <Sidebar></Sidebar>
      <Profile></Profile>
    </aside>
  );
};
export default ProfilePage;
