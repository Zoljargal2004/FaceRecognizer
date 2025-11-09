"use client";
import { jwtDecode } from "jwt-decode";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  Home,
  User,
  CalendarCheck,
  Activity,
  Newspaper,
  BookOpen,
  PaperclipIcon,
  NewspaperIcon,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export function AppSidebar() {
  const [role, setRole] = useState("member");

  const menu = [
    { icon: Home, name: "Overview", url: "/" },
    { icon: User, name: "Profile", url: "/profile" },
    { icon: CalendarCheck, name: "Attendance", url: "/attendance" },
    { icon: Activity, name: "Monitor", url: "/monitor" },
    { icon: Newspaper, name: "News", url: "/news" },
    { icon: BookOpen, name: "Classes", url: "/classes" },
    { icon: NewspaperIcon, name: "Мэдээ", url: "/news"}
  ];
  useEffect(() => {
    const token = getCookieValue("bearer");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      setRole(decoded.role);
    } catch (err) {
      console.error("Failed to decode JWT:", err);
    }
  }, []);
  const getCookieValue = (name) => {
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)")
    );
    return match ? match[2] : null;
  };

  return (
    <Sidebar className="px-4">
      <SidebarHeader />
      <h1 className="text-4xl font-bold text-primary mb-2">FitTracker</h1>
      <SidebarContent>
        <SidebarGroup>
          {menu.map((item) => (
            <Link
              href={item.url}
              key={item.name}
              className="flex items-center gap-3 text-lg text-muted-foreground hover:text-primary cursor-pointer"
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          ))}
          {role == "admin" && (
            <Link
              href={"/write-news"}
              key={"news"}
              className="flex items-center gap-3 text-lg text-muted-foreground hover:text-primary cursor-pointer"
            >
              <PaperclipIcon className="w-5 h-5" />
              <span>{`Мэдээ бичих`}</span>
            </Link>
          )}
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
