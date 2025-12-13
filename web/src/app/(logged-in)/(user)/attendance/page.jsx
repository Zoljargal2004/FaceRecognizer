"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AttendanceToday } from "@/components/home/attendance-today";
import { AttendenceWeek } from "@/components/home/attendence-week";
import { AvgDuration } from "@/components/home/avg-duration";
import { toast } from "sonner";
import { Loader2, LogIn, LogOut } from "lucide-react";
import { useAuth } from "@/context/auth";
import { format } from "date-fns";

export default function AttendancePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [todayStatus, setTodayStatus] = useState(null);

  useEffect(() => {
    if (user?.email) {
      fetchTodayStatus();
    }
  }, [user]);

  const fetchTodayStatus = async () => {
    try {
      const res = await fetch("/api/attendance");
      if (res.ok) {
        const data = await res.json();
        setTodayStatus(data);
      }
    } catch (error) {
      console.error("Failed to fetch today status:", error);
    }
  };

  const handleCheckIn = async () => {
    if (!user?.email) {
      toast.error("Please log in first");
      return;
    }

    setCheckingIn(true);
    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Checked in successfully");
        fetchTodayStatus();
      } else {
        toast.error(data.error || "Failed to check in");
      }
    } catch (error) {
      console.error("Check-in error:", error);
      toast.error("Failed to check in");
    } finally {
      setCheckingIn(false);
    }
  };

  const handleCheckOut = async () => {
    if (!user?.email) {
      toast.error("Please log in first");
      return;
    }

    setCheckingOut(true);
    try {
      const res = await fetch("/api/attendance", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Checked out successfully");
        fetchTodayStatus();
      } else {
        toast.error(data.error || "Failed to check out");
      }
    } catch (error) {
      console.error("Check-out error:", error);
      toast.error("Failed to check out");
    } finally {
      setCheckingOut(false);
    }
  };

  const hasActiveSession = todayStatus?.records?.some(
    (r) => r.createdAt && !r.leftAt
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Ирц</h1>
        <p className="text-muted-foreground">
          Өнөөдрийн болон долоо хоногийн ирцийн мэдээлэл
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AttendanceToday />
        <AttendenceWeek />
        <AvgDuration />
      </div>
    </div>
  );
}
