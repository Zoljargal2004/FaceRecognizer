import Header from "@/components/general/header";
import { AppSidebar } from "@/components/general/sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AuthProvider } from "@/context/auth";
import { Toaster } from "sonner";

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Header />
          <main className="flex-1 p-6 bg-background min-h-screen">
            {children}
          </main>
        </SidebarInset>
        <Toaster richColors position="top-right" />
      </SidebarProvider>
    </AuthProvider>
  );
}
