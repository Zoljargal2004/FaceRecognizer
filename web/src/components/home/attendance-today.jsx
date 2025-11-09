"use client"

import { useEffect, useState } from "react";

export const AttendanceToday = () => {
  const [loading, setLoading] = useState(true);
  const [dataToday, setData] = useState(null);
  const fetchTodayAttendance= async() => {
    setLoading(true)
    try {
        const res = await fetch("/api/attendance")
        const data = await res.json()
        setData(data)
    } catch (e) {
      console.error(e);
    }
    setLoading(false)
  }
  console.log(dataToday)
  useEffect(() => {
    fetchTodayAttendance()
  }, []);
  return (
    <div>
      <span>Өнөөдрийн эрц</span>
    </div>
  );
};
