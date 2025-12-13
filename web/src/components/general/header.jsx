"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/context/auth";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between gap-4 px-4 py-3 border-b bg-background sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <h1 className="text-xl font-bold text-foreground">FitTracker</h1>
      </div>
      {user && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground hidden sm:inline">
            {user.email}
          </span>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden md:inline">Профайл</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Хэрэглэгчийн мэдээлэл</DialogTitle>
                <DialogDescription>
                  Таны бүртгэлийн мэдээлэл
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Имэйл</p>
                  <p className="text-sm">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Эрх</p>
                  <p className="text-sm capitalize">{user.role || "member"}</p>
                </div>
                <Button
                  onClick={logout}
                  variant="destructive"
                  className="w-full"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Гарах
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </header>
  );
}
