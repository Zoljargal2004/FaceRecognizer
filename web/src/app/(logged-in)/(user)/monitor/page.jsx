"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, Users, Clock, TrendingUp } from "lucide-react";

export default function MonitorPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Simulate fetching monitoring data
    // In a real app, this would fetch from an API
    setTimeout(() => {
      setStats({
        activeUsers: 12,
        totalSessions: 45,
        avgDuration: "2.5",
        peakHours: "14:00-16:00",
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="space-y-2">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Идэвхтэй хэрэглэгчид",
      value: stats?.activeUsers || 0,
      icon: Users,
      description: "Одоогоор дотор байгаа",
    },
    {
      title: "Нийт сессийн тоо",
      value: stats?.totalSessions || 0,
      icon: Activity,
      description: "Өнөөдөр",
    },
    {
      title: "Дундаж хугацаа",
      value: `${stats?.avgDuration || 0} цаг`,
      icon: Clock,
      description: "Өнөөдөр",
    },
    {
      title: "Онцлох цаг",
      value: stats?.peakHours || "N/A",
      icon: TrendingUp,
      description: "Хамгийн их ирц",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Монитор</h1>
        <p className="text-muted-foreground">
          Системийн идэвх, статистик болон хяналтын мэдээлэл
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Системийн мэдээлэл</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Системийн статус
              </span>
              <span className="text-sm font-medium text-green-600">
                Идэвхтэй
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Сүүлийн шинэчлэл
              </span>
              <span className="text-sm font-medium">
                {new Date().toLocaleString("mn-MN")}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

