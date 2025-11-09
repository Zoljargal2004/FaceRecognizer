"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export const AvgDuration = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAvgDuration = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/avg-duration");
      const data = await res.json();
      setData(data);
    } catch (e) {
      console.error("Failed to fetch avg duration:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvgDuration();
  }, []);

  const avgMinutes = data?.averageMinutes ?? 0;

  // ⏱️ Convert minutes → hours and minutes if needed
  const formatDuration = (minutes) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = Math.round(minutes % 60);
      return `${hours} цаг ${mins > 0 ? `${mins} мин` : ""}`.trim();
    }
    return `${Math.round(minutes)} мин`;
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Дундаж хугацаа</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-5 w-2/4" />
              <Skeleton className="h-5 w-full" />
            </div>
          ) : (
            <div className="flex flex-col">
              <span className="text-3xl text-[#0079CE] font-bold">
                {formatDuration(avgMinutes)}
              </span>
              <span className="text-sm text-muted-foreground mt-1">
                Энэ 7 хоногийн дундаж хугацаа
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
