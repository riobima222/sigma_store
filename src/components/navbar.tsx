import { signIn, signOut, useSession } from "next-auth/react";

const Navbar = () => {
  const { data: session } = useSession();
  return (
    <nav className="bg-black p-2 flex justify-end">
      <button
        onClick={session ? () => signOut() : () => signIn()}
        className="bg-white font-semibold px-2 py-1 text-black"
      >
        {session ? "Log out" : "Login"}
      </button>
    </nav>
  );
};
export default Navbar;
