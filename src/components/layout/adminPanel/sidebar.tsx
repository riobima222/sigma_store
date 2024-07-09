import { MdDashboardCustomize } from "react-icons/md";
import { FaBoxOpen } from "react-icons/fa";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { FaUsers } from "react-icons/fa";

const Sidebar = () => {
  const pathname = usePathname();
  return (
    <aside className="w-[12em] h-[100vh] bg-black text-white pt-1 px-2 flex flex-col justify-between">
      <div>
        <h1 className="text-xl text-center mb-4">Sidebar</h1>
        <div className="flex flex-col gap-1">
          <Link
            href="/admin"
            className={`${
              pathname === "/admin" ? "bg-white text-black" : ""
            } rounded-md px-1 py-1 flex justify-start items-center hover:bg-white hover:text-black`}
          >
            <MdDashboardCustomize className="me-2" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/admin/products"
            className={`${
              pathname === "/admin/products" ? "bg-white text-black" : ""
            } rounded-md px-1 py-1 flex justify-start items-center hover:bg-white hover:text-black`}
          >
            <FaBoxOpen className="me-2" />
            <span>Products</span>
          </Link>
          <Link
            href="/admin/user"
            className={`${
              pathname === "/admin/user" ? "bg-white text-black" : ""
            } rounded-md px-1 py-1 flex justify-start items-center hover:bg-white hover:text-black`}
          >
            <FaUsers className="me-2" />
            <span>Users</span>
          </Link>
        </div>
      </div>
      <button
        type="button"
        className="text-center bg-white text-black w-full py-1 rounded-md mb-2"
        onClick={() => signOut()}
      >
        Logout
      </button>
    </aside>
  );
};
export default Sidebar;
