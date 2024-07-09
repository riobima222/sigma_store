import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Label from "@/components/ui/label";
import { authServices } from "@/services/auth";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const RegisterPage = () => {
  const [submitButton, setSubmitButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("false");
  const { push } = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setSubmitButton(true);
    setIsLoading(true);
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = {
      username: form.username.value,
      email: form.email.value,
      password: form.password.value,
      phone: form.phone.value,
    };
    const response = await authServices.registerAccount(data);
    if (response.data.statusCode === 200) {
      setAlertMessage(response.data.message);
      setAlertType("success");
      form.reset();
      setTimeout(() => {
        setAlertType("false");
        setAlertMessage("");
        push("/auth/login");
      }, 4000);
    } else if (response.data.statusCode === 400) {
      setAlertMessage(response.data.message);
      setAlertType("failed");
      form.username.value = "";
      setTimeout(() => {
        setAlertType("false");
        setAlertMessage("");
      }, 4000);
    } else {
      console.log(response);
      setAlertMessage(response.data.message);
      setAlertType("error");
    }
    setSubmitButton(false);
    setIsLoading(false);
  };
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
        <h1 className="text-3xl font-bold">Sigma - register</h1>
        <form
          onSubmit={(e) => handleSubmit(e)}
          className="w-full my-4 border-2 border-slate-300 p-6"
        >
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              name="username"
              placeholder="example.."
              className="h-12 bg-slate-100"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="example@ex.com"
              className="h-12 bg-slate-100"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              name="password"
              placeholder="******"
              className="h-12 bg-slate-100"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              name="phone"
              placeholder="081234..."
              className="h-12 bg-slate-100"
              pattern="^(08)[0-9]{9,12}$"
            />
          </div>
          <Button type="submit" disabled={submitButton}>
            {isLoading ? "Loading..." : "Register"}
          </Button>
        </form>
        <span>
          Have an account ?{" "}
          <Link className="text-blue-300 underline" href={"/auth/login"}>
            Login
          </Link>{" "}
        </span>
      </div>
      <div
        role="alert"
        className={`${
          alertType === "false" || alertType === "failed" ? "hidden" : "block"
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
      <div
        role="alert"
        className={`${
          alertType === "false" || alertType === "success" ? "hidden" : "block"
        } alert alert-error bg-[#ba0704] border-none absolute bottom-2 right-0 h-[2.7em] flex items-center px-3 max-w-[40em]`}
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
        <span>{alertMessage}</span>
      </div>
    </div>
  );
};
export default RegisterPage;
