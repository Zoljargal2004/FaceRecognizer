"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Header() {
  return (
    <header className="flex items-center gap-4 px-4 py-3 border-b bg-background sticky top-0 z-50">
      <SidebarTrigger />
      <h1 className="text-xl font-bold text-foreground">FitTracker</h1>
    </header>
  );
}
