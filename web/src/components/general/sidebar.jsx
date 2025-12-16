"use client";
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
  Settings,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/auth";

export function AppSidebar() {
  const { user } = useAuth();
  const role = user?.role || "member";

  const menu = [
    { icon: Home, name: "Home", url: "/" },
    { icon: User, name: "Профайл", url: "/profile" },
    { icon: CalendarCheck, name: "Ирц", url: "/attendance" },
    { icon: Activity, name: "Үзүүлэлт", url: "/monitor" },
    // { icon: Newspaper, name: "Мэдээ", url: "/news" },
    { icon: BookOpen, name: "Анги", url: "/classes" },
    { icon: ShoppingBag, name: "Дэлгүүр", url: "/shop" },
    { icon: NewspaperIcon, name: "Мэдээ", url: "/news"},
  ];

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
            <>
              <Link
                href={"/write-news"}
                key={"write-news"}
                className="flex items-center gap-3 text-lg text-muted-foreground hover:text-primary cursor-pointer"
              >
                <PaperclipIcon className="w-5 h-5" />
                <span>{`Мэдээ бичих`}</span>
              </Link>
              <Link
                href={"/manage-articles"}
                key={"manage-articles"}
                className="flex items-center gap-3 text-lg text-muted-foreground hover:text-primary cursor-pointer"
              >
                <Settings className="w-5 h-5" />
                <span>{`Мэдээ удирдах`}</span>
              </Link>
              <Link
                href={"/manage-classes"}
                key={"manage-classes"}
                className="flex items-center gap-3 text-lg text-muted-foreground hover:text-primary cursor-pointer"
              >
                <Settings className="w-5 h-5" />
                <span>{`Хичээл удирдах`}</span>
              </Link>
              <Link
                href={"/manage-shop"}
                key={"manage-shop"}
                className="flex items-center gap-3 text-lg text-muted-foreground hover:text-primary cursor-pointer"
              >
                <Settings className="w-5 h-5" />
                <span>{`Дэлгүүр удирдах`}</span>
              </Link>
            </>
          )}
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
