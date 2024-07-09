import Navbar from "@/components/navbar";
import DeleteAlertProvider from "@/context/deleteAlert";
import AlertProvider from "@/context/alert";
import ModalProvider from "@/context/modalAppears";
import AlertMessageProvider from "@/context/alertMessage";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { Poppins } from "next/font/google";
import { usePathname } from "next/navigation";
import ModalConfirmProvider from "@/context/modalConfirm";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "600", "700", "800", "900"],
});

const disableNavbar = ["auth", "admin", "member"];

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const pathname = usePathname();
  return (
    <ModalProvider>
      <DeleteAlertProvider>
        <AlertProvider>
          <AlertMessageProvider>
            <ModalConfirmProvider>
            <SessionProvider session={session}>
              <div className={poppins.className}>
                {!disableNavbar.includes(pathname.split("/")[1]) && <Navbar />}
                <Component {...pageProps} />
              </div>
            </SessionProvider>
            </ModalConfirmProvider>
          </AlertMessageProvider>
        </AlertProvider>
      </DeleteAlertProvider>
    </ModalProvider>
  );
}
