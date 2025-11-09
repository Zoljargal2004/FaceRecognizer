"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

export const AttendanceToday = () => {
  const [loading, setLoading] = useState(true);
  const [dataToday, setData] = useState(null);

  const fetchTodayAttendance = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/attendance");
      const data = await res.json();
      setData(data);
    } catch (e) {
      console.error("Failed to fetch attendance:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayAttendance();
  }, []);

  const records = dataToday?.records || [];

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Өнөөдрийн ирц</CardTitle>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-5 w-2/4" />
            <Skeleton className="h-5 w-full" />
          </div>
        ) : records.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Өнөөдрийн ирцийн мэдээлэл олдсонгүй.
          </p>
        ) : (
          <div className="space-y-4">
            {records.map((r, i) => {
              const start = format(new Date(r.createdAt), "HH:mm:ss");
              const end = r.leftAt ? format(new Date(r.leftAt), "HH:mm:ss") : null;
              const duration =
                r.leftAt &&
                `${Math.round((new Date(r.leftAt) - new Date(r.createdAt)) / 60000)} мин`;

              return (
                <div
                  key={r._id}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">
                      #{i + 1} — ирсэн цаг:
                    </span>
                    <span className="font-semibold">{start}</span>
                  </div>

                  {end ? (
                    <div className="flex flex-col text-right">
                      <span className="text-sm text-muted-foreground">Гарсан цаг:</span>
                      <span className="font-semibold text-green-600">{end}</span>
                      <span className="text-xs text-muted-foreground">
                        Үргэлжилсэн: {duration}
                      </span>
                    </div>
                  ) : (
                    <span className="font-semibold text-yellow-600">Одоогоор дотор байна</span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
