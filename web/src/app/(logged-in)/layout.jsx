// app/(protected)/layout.tsx
"use client";

import Header from "@/components/general/header";
import { AppSidebar } from "@/components/general/sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AuthProvider, useAuth } from "@/context/auth";
import { Skeleton } from "@/components/ui/skeleton";

function LoggedInContent({ children }) {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex-1 p-6 bg-background min-h-screen">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <main className="flex-1 p-6 bg-background min-h-screen">
      {children}
    </main>
  );
}

export default function ProtectedLayout({ children }) {
  return (
    <AuthProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Header />
          <LoggedInContent>{children}</LoggedInContent>
        </SidebarInset>
      </SidebarProvider>
    </AuthProvider>
  );
}
