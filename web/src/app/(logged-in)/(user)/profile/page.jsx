"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/auth";
import { User, Mail, Shield, Calendar } from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    if (user?.email) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      // In a real app, fetch from /api/user/profile
      // For now, we'll use the user from auth context
      setUserData({
        name: user.name || "User",
        email: user.email,
        role: user.role || "member",
        createdAt: new Date(),
      });
      setFormData({
        name: user.name || "User",
        email: user.email,
      });
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      // In a real app, this would update via API
      toast.success("Profile updated successfully");
      setEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="space-y-2">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-96" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-10 w-full mb-4" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Профайл</h1>
        <p className="text-muted-foreground">
          Хувийн мэдээлэл болон тохиргоо
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Хувийн мэдээлэл</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Нэр
            </Label>
            {editing ? (
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            ) : (
              <p className="text-sm font-medium py-2">{userData?.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Имэйл
            </Label>
            {editing ? (
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                disabled
              />
            ) : (
              <p className="text-sm font-medium py-2">{userData?.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Эрх
            </Label>
            <p className="text-sm font-medium py-2 capitalize">
              {userData?.role === "admin" ? "Админ" : "Хэрэглэгч"}
            </p>
          </div>

          {userData?.createdAt && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Бүртгүүлсэн огноо
              </Label>
              <p className="text-sm font-medium py-2">
                {new Date(userData.createdAt).toLocaleDateString("mn-MN")}
              </p>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            {editing ? (
              <>
                <Button onClick={handleSave}>Хадгалах</Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditing(false);
                    setFormData({
                      name: userData?.name || "",
                      email: userData?.email || "",
                    });
                  }}
                >
                  Цуцлах
                </Button>
              </>
            ) : (
              <Button onClick={() => setEditing(true)}>Засах</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
