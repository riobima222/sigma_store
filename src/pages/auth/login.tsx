import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session }: any = useSession();
  const [alertMessage, setAlertMessage]: any = useState("");
  const [isLoginSucces, setIsLoginSucces] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);

  const { push } = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const form = e.target as HTMLFormElement;
    const res = await signIn("credentials", {
      redirect: false,
      username: form.username.value,
      password: form.password.value,
    });
    if (res?.ok) {
      setIsLoading(false);
      setAlertMessage("Berhasil Login");
      setIsLoginSucces(true);
      setTimeout(() => {
        setIsLoginSucces(false);
        setTimeout(() => {
          push("/");
        }, 500);
      }, 3000);
    } else {
      setIsLoading(false);
      setAlertMessage(res?.error);
      setLoginFailed(true);
      if (res?.error === "not account") {
        form.reset();
      } else {
        form.password.value = "";
      }
      setTimeout(() => {
        setLoginFailed(false);
      }, 3000);
    }
    console.log(res);
  };
  useEffect(() => {
    console.log(session);
  }, [session]);

  const handleGoogleLogin = () => {
    setIsLoading(true);
    signIn("google", { callbackUrl: "/", redirect: false });
  };
  return (
    <div className="text-black min-h-screen flex flex-col justify-center items-center px-3 relative">
      <Head>
        <title>Sigma - login</title>
        <meta name="description" content="please login first" />
      </Head>
      <div className="max-w-[26em] items-center flex flex-col w-full">
        <h1 className="text-3xl font-bold">Sigma - Login</h1>
        <form
          onSubmit={(e) => handleSubmit(e)}
          className="w-full my-4 border-2 border-slate-300 p-6"
        >
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
          <button
            className="h-12 w-full bg-black text-white rounded-md mt-3"
            type="button"
            disabled={isLoading}
            onClick={() => handleGoogleLogin()}
          >
            {isLoading ? "Loading..." : "Login GOOGLE"}
          </button>
          <p className="text-red-500 text-center mt-2 text-sm tracking-wider">
            {loginFailed ? `${alertMessage} !!!` : ""}
          </p>
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
        className={`${
          isLoginSucces ? "block" : "hidden"
        } alert alert-success bg-slate-300 border-none absolute bottom-2 right-0 h-[2.7em] flex items-center px-3 max-w-[40em]`}
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
        <span>{alertMessage}</span>
      </div>
    </div>
  );
};
export default LoginPage;
