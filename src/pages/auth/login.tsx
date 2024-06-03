import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div className="text-black min-h-screen flex flex-col justify-center items-center px-3 relative">
      <Head>
        <title>Sigma - Register</title>
        <meta
          name="description"
          content="make your account for use sigma application"
        />
      </Head>
      <div className="max-w-[26em] items-center flex flex-col w-full">
        <h1 className="text-3xl font-bold">Sigma - Login</h1>
        <form className="w-full my-4 border-2 border-slate-300 p-6">
          <div>
            <label className="block mb-1 ps-2 text-lg" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              className="h-12 bg-slate-200 w-full px-2 py-1 focus:outline-none text-sm"
              type="text"
              name="username"
              placeholder="example..."
              required
            />
          </div>
          <div>
            <label className="block mb-1 ps-2 text-lg" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className="h-12 bg-slate-200 w-full px-2 py-1 focus:outline-none text-sm"
              type="password"
              name="password"
              placeholder="******"
              required
            />
          </div>
          <button
            className="h-12 w-full bg-black text-white rounded-md mt-3"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Login"}
          </button>
        </form>
        <span>
          {`Don't have an account`} ?{" "}
          <Link className="text-blue-300 underline" href={"/auth/register"}>
            Register
          </Link>{" "}
        </span>
      </div>
      <div
        role="alert"
        className={`alert alert-success bg-slate-300 border-none absolute bottom-2 right-0 h-[2.7em] flex items-center px-3 max-w-[40em]`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>{`cek`}</span>
      </div>
      <div
        role="alert"
        className={`alert alert-error bg-[#ba0704] border-none absolute bottom-2 right-0 h-[2.7em] flex items-center px-3 max-w-[40em]`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>register</span>
      </div>
    </div>
  );
};
export default LoginPage;
