import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Home, User, CalendarCheck, Activity, Newspaper, BookOpen } from "lucide-react";
import Link from "next/link";

export function AppSidebar() {
  const menu = [
    { icon: Home, name: "Overview", url: "/" },
    { icon: User, name: "Profile", url: "/profile" },
    { icon: CalendarCheck, name: "Attendance", url: "/attendance" },
    { icon: Activity, name: "Monitor", url: "/monitor" },
    { icon: Newspaper, name: "News", url: "/news" },
    { icon: BookOpen, name: "Classes", url: "/classes" },
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
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
