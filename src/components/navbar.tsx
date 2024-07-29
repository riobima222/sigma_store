import { getSession, signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { useState } from "react";

// ICONS :
import { IoCartOutline } from "react-icons/io5";

const Navbar = () => {
  const { data: session } = useSession();

  // PROFILE IMAGE ( PALING KANAN )
  const [profileNavigation, setProfileNavigation] = useState(false);

  // REACT USE
  const pathname = usePathname();
  const { push } = useRouter();
  // array untuk list item
  const listItem = [
    {
      name: "Home",
      url: "/",
    },
    {
      name: "product",
      url: "/product",
    },
  ];
  return (
    <nav className="fixed top-0 left-0 right-0 bg-black p-2 px-4 flex justify-between items-center">
      <h1 className="font-bold text-1xl text-white tracking-wider">
        <Link href={`/`}>
          <span className="italic">Sigma</span> Store
        </Link>
      </h1>
      {/* LIST ITEM */}
      <div className="flex gap-2 text-white text-sm">
        {listItem.map((item: { name: string; url: string }, i: number) => (
          <Link
            href={item.url}
            key={i}
            className={`${
              pathname === item.url
                ? "bg-white text-black px-2 py-1 rounded-md"
                : "px-2 py-1"
            } font-bold`}
          >
            {item.name}
          </Link>
        ))}
      </div>
      <div className="flex gap-4 items-center">
        {/* TOMBOL KERANJANG */}
        <div>
          <IoCartOutline
            onClick={() => push("/cart")}
            className="text-white text-2xl hover:cursor-pointer"
          />
        </div>
        {/* TOMBOL LOGIN / LOGOUT USER */}
        {session ? (
          <div
            onClick={() => setProfileNavigation(!profileNavigation)}
            className="relative hover:cursor-pointer"
          >
            <div className="h-[35px] w-[35px] overflow-hidden bg-white rounded-full">
              <Image
                src={session?.user?.image || ""}
                alt="profile"
                width={35}
                height={35}
              />
            </div>
            {profileNavigation && (
              <div className="absolute bg-black text-white top-[43.2px] left-[-98px] px-2 py-2 min-w-[150px]">
                <Link
                  href={`/member/profile`}
                  className="block hover:bg-white hover:text-black py-1 text-sm font-bold hover:cursor-pointer transition tracking-wider hover:text-center"
                >
                  profile
                </Link>
                <button
                  onClick={session ? () => signOut() : () => signIn()}
                  className="bg-white font-semibold px-2 py-1 text-black w-full mt-2"
                >
                  log out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => signIn()}
            className="bg-white font-semibold px-2 py-1 text-black w-full"
          >
            log in
          </button>
        )}
      </div>
    </nav>
  );
};
export default Navbar;
