"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Clock, Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function ClassDetailPage() {
  const params = useParams();
  const [classItem, setClassItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchClass();
    }
  }, [params.id]);

  const fetchClass = async () => {
    setLoading(true);
    try {
      // In a real app, fetch from /api/classes/[id]
      // Simulating with sample data
      setTimeout(() => {
        setClassItem({
          _id: params.id,
          name: "Йога",
          instructor: "Б.Сараа",
          schedule: "Даваа, Мягмар 18:00-19:00",
          capacity: 20,
          enrolled: 15,
          description:
            "Йогагийн анхан шатны хичээл. Энэ хичээлд та биеийн хөгжлийг сайжруулах, сэтгэл санааны тайвшралыг олж авах боломжтой.",
          location: "Гол танхим",
          duration: "60 минут",
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Failed to fetch class:", error);
      setLoading(false);
    }
  };

  const handleEnroll = () => {
    if (enrolled) {
      toast.info("Та аль хэдийн бүртгүүлсэн байна");
      return;
    }

    if (classItem.enrolled >= classItem.capacity) {
      toast.error("Хичээл дүүрсэн байна");
      return;
    }

    setEnrolled(true);
    toast.success("Амжилттай бүртгүүллээ");
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
            <Button
              onClick={handleEnroll}
              disabled={enrolled || classItem.enrolled >= classItem.capacity}
              className="w-full"
            >
              {enrolled
                ? "Бүртгүүлсэн"
                : classItem.enrolled >= classItem.capacity
                ? "Дүүрсэн"
                : "Бүртгүүлэх"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
