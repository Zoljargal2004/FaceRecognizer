"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Clock, Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useAuth } from "@/context/auth";

export default function ClassDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const [classItem, setClassItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchClass();
    }
  }, [params.id]);

  const fetchClass = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/classes/${params.id}`);
      const data = await res.json();
      if (res.ok) {
        setClassItem(data.class);
      } else {
        setClassItem(null);
      }
    } catch (error) {
      console.error("Failed to fetch class:", error);
      setClassItem(null);
    }
    setLoading(false);
  };

  const updateEnrollment = async (action) => {
    if (!classItem?._id) return;
    if (!user?.id) {
      toast.error("Нэвтэрч ороод дахин оролдоно уу");
      return;
    }

    setEnrolling(true);
    try {
      const res = await fetch(`/api/classes/${classItem._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(
          action === "enroll" ? "Амжилттай бүртгүүллээ" : "Бүртгэл цуцлагдлаа"
        );
        // Refresh class data
        setClassItem((prev) =>
          prev
            ? {
                ...prev,
                enrolled: data.enrolled,
                enrolledUsers: data.enrolledUsers || prev.enrolledUsers || [],
              }
            : prev
        );
      } else {
        toast.error(data.error || "Алдаа гарлаа");
      }
    } catch (error) {
      console.error("Enrollment error:", error);
      toast.error("Алдаа гарлаа");
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-9 w-48" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-full" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!classItem) {
    return (
      <div className="flex flex-col gap-6">
        <Link href="/classes">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Буцах
          </Button>
        </Link>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">Хичээл олдсонгүй</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <Link href="/classes">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Буцах
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            {classItem.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                <strong>Багш:</strong> {classItem.instructor}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                <strong>Хуваарь:</strong> {classItem.schedule}
              </span>
            </div>
            {classItem.location && (
              <div className="flex items-center gap-2">
                <span className="text-sm">
                  <strong>Байршил:</strong> {classItem.location}
                </span>
              </div>
            )}
            {classItem.duration && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <strong>Хугацаа:</strong> {classItem.duration}
                </span>
              </div>
            )}
          </div>

          {classItem.description && (
            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-2">Тайлбар</h3>
              <p className="text-sm text-muted-foreground">
                {classItem.description}
              </p>
            </div>
          )}

          <div className="pt-4 border-t">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Бүртгэл</span>
              <span className="text-sm text-muted-foreground">
                {classItem.enrolled}/{classItem.capacity} хүн
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-3 mb-4">
              <div
                className="bg-primary h-3 rounded-full"
                style={{
                  width: `${(classItem.enrolled / classItem.capacity) * 100}%`,
                }}
              />
            </div>
            <div className="text-xs text-muted-foreground mb-3">
              {classItem.enrolledUsers?.length || classItem.enrolled || 0} /{" "}
              {classItem.capacity} бүртгүүлсэн
            </div>
            <Button
              onClick={() => updateEnrollment("enroll")}
              disabled={
                enrolling ||
                classItem.enrolled >= classItem.capacity ||
                (classItem.enrolledUsers || []).some(
                  (u) => u === user?.id || u === user?._id
                )
              }
              className="w-full"
            >
              {enrolling
                ? "Ачаалж байна..."
                : classItem.enrolled >= classItem.capacity
                ? "Дүүрсэн"
                : (classItem.enrolledUsers || []).some(
                    (u) => u === user?.id || u === user?._id
                  )
                ? "Бүртгүүлсэн"
                : "Бүртгүүлэх"}
            </Button>
            <Button
              variant="outline"
              onClick={() => updateEnrollment("unenroll")}
              disabled={
                enrolling ||
                classItem.enrolled === 0 ||
                !(classItem.enrolledUsers || []).some(
                  (u) => u === user?.id || u === user?._id
                )
              }
              className="w-full mt-2"
            >
              {enrolling ? "Ачаалж байна..." : "Бүртгэл арилгах"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
