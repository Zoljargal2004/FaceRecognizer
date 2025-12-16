"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Clock, Calendar } from "lucide-react";
import Link from "next/link";

export default function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/classes");
      const data = await res.json();
      if (res.ok) {
        setClasses(data.classes || []);
      } else {
        setClasses([]);
      }
    } catch (error) {
      console.error("Failed to fetch classes:", error);
      setClasses([]);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="space-y-2">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Хичээл</h1>
        <p className="text-muted-foreground">
          Боломжтой хичээлүүд болон тэдгээрийн мэдээлэл
        </p>
      </div>

      {classes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              Хичээл олдсонгүй
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {classes.map((classItem) => (
            <Card key={classItem._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  {classItem.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>Багш: {classItem.instructor}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{classItem.schedule}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>
                      {classItem.enrolled}/{classItem.capacity} хүн
                    </span>
                  </div>
                </div>

                {classItem.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {classItem.description}
                  </p>
                )}

                <div className="pt-2">
                  <div className="w-full bg-muted rounded-full h-2 mb-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{
                        width: `${(classItem.enrolled / classItem.capacity) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    {classItem.capacity - classItem.enrolled} сул байр
                  </p>
                </div>

                <Link href={`/classes/${classItem._id}`} className="block">
                  <Button variant="outline" size="sm" className="w-full">
                    Дэлгэрэнгүй
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
