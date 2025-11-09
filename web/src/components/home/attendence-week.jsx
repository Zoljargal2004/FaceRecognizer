"use client";

import { useState, useEffect } from "react";
import { ChartBarTodayAttendance } from "./attendance-week-chart";
import { Skeleton } from "../ui/skeleton";

export const AttendenceWeek = () => {
  const [dataWeek, setDataWeek] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchWeekAttendance = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/weekly-attendance");
      const data = await res.json();
      setDataWeek(data);
    } catch (e) {
      console.error("Failed to fetch attendance:", e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchWeekAttendance();
  }, []);
  const data = dataWeek?.weekly || [];
  return (
    <div>
      <ChartBarTodayAttendance data={data} loading={loading} />
    </div>
  );
};
