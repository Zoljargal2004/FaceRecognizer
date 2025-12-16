"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/context/auth";
import { User, Mail, Shield, Calendar, Trash2, Lock } from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (user?.email) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/me");
      if (!res.ok) throw new Error("Failed to load profile");
      const data = await res.json();
      const u = data.user;
      setUserData(u);
      setFormData({
        name: u?.name || "",
        email: u?.email || "",
        password: "",
      });
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name && !formData.password) {
      toast.error("Нэр эсвэл нууц үг шинэчлэх шаардлагатай");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          password: formData.password || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Шинэчлэхэд алдаа гарлаа");
        return;
      }
      toast.success("Профайл шинэчлэгдлээ");
      setEditing(false);
      fetchUserData();
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Шинэчлэхэд алдаа гарлаа");
    } finally {
      setSaving(false);
      setFormData((prev) => ({ ...prev, password: "" }));
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Бүртгэлээ устгах уу? Энэ үйлдэл буцаахгүй.")) return;
    setDeleting(true);
    try {
      const res = await fetch("/api/me", { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Устгахад алдаа гарлаа");
        return;
      }
      toast.success("Бүртгэл устгагдлаа");
      window.location.href = "/login";
    } catch (error) {
      console.error("Failed to delete account:", error);
      toast.error("Устгахад алдаа гарлаа");
    } finally {
      setDeleting(false);
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

          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Шинэ нууц үг
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="********"
            />
            <p className="text-xs text-muted-foreground">
              Нэр болон нууц үгээ шинэчлэх боломжтой.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            {editing ? (
              <>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Хадгалж байна..." : "Хадгалах"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditing(false);
                    setFormData({
                      name: userData?.name || "",
                      email: userData?.email || "",
                      password: "",
                    });
                  }}
                  disabled={saving}
                >
                  Цуцлах
                </Button>
              </>
            ) : (
              <Button onClick={() => setEditing(true)}>Засах</Button>
            )}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="ml-auto"
                  disabled={deleting}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Бүртгэл устгах
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Бүртгэл устгах уу?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Энэ үйлдлийг буцаах боломжгүй. Та бүх мэдээллээ устгахдаа итгэлтэй байна уу?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={deleting}>Цуцлах</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={handleDelete}
                    disabled={deleting}
                  >
                    {deleting ? "Устгаж байна..." : "Устгах"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
