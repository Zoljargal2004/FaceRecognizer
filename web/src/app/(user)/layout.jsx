import { AuthProvider } from "@/context/auth";
import { Toaster } from "sonner";

export default function RootLayout({ children }) {
  return (
    <>
      <AuthProvider>{children}</AuthProvider>
    </>
  );
}
