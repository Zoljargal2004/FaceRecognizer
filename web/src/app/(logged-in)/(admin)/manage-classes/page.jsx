"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Trash2, PlusCircle, Loader2, Edit } from "lucide-react";

export default function ManageClassesPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    instructor: "",
    schedule: "",
    capacity: "",
    description: "",
    location: "",
    duration: "",
  });

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
        toast.error(data.error || "Failed to load classes");
      }
    } catch (err) {
      console.error("Failed to fetch classes", err);
      toast.error("Failed to load classes");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () =>
    setForm({
      name: "",
      instructor: "",
      schedule: "",
      capacity: "",
      description: "",
      location: "",
      duration: "",
    });

  const handleEditSelect = (clazz) => {
    setEditingId(clazz._id);
    setForm({
      name: clazz.name || "",
      instructor: clazz.instructor || "",
      schedule: clazz.schedule || "",
      capacity: clazz.capacity ?? "",
      description: clazz.description || "",
      location: clazz.location || "",
      duration: clazz.duration || "",
    });
  };

  const handleSave = async () => {
    if (!form.name || !form.instructor || !form.schedule || !form.capacity) {
      toast.error("Please fill name, instructor, schedule and capacity");
      return;
    }
    setSaving(true);
    try {
      const isEdit = Boolean(editingId);
      const url = isEdit ? `/api/classes/${editingId}` : "/api/classes";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(isEdit ? "Class updated" : "Class created");
        resetForm();
        setEditingId(null);
        fetchClasses();
      } else {
        toast.error(data.error || `Failed to ${isEdit ? "update" : "create"} class`);
      }
    } catch (err) {
      console.error("Save class error", err);
      toast.error(`Failed to ${editingId ? "update" : "create"} class`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/classes/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        toast.success("Class deleted");
        setClasses((prev) => prev.filter((c) => c._id !== id));
      } else {
        toast.error(data.error || "Failed to delete class");
      }
    } catch (err) {
      console.error("Delete class error", err);
      toast.error("Failed to delete class");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Хичээл удирдах</h1>
        <p className="text-muted-foreground">
          Шинэ хичээл нэмэх болон устгах
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {editingId ? "Хичээл засах" : "Шинэ хичээл нэмэх"}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Нэр</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Йога, Кардио..."
            />
          </div>
          <div className="space-y-2">
            <Label>Багш</Label>
            <Input
              value={form.instructor}
              onChange={(e) => setForm({ ...form, instructor: e.target.value })}
              placeholder="Багшийн нэр"
            />
          </div>
          <div className="space-y-2">
            <Label>Хуваарь</Label>
            <Input
              value={form.schedule}
              onChange={(e) => setForm({ ...form, schedule: e.target.value })}
              placeholder="Даваа, Мягмар 18:00-19:00"
            />
          </div>
          <div className="space-y-2">
            <Label>Багтаамж</Label>
            <Input
              type="number"
              min="1"
              value={form.capacity}
              onChange={(e) => setForm({ ...form, capacity: e.target.value })}
              placeholder="20"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Тайлбар</Label>
            <Input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Хичээлийн товч тайлбар"
            />
          </div>
          <div className="space-y-2">
            <Label>Байршил</Label>
            <Input
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="Гол танхим"
            />
          </div>
          <div className="space-y-2">
            <Label>Хугацаа</Label>
            <Input
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
              placeholder="60 минут"
            />
          </div>
          <div className="md:col-span-2 flex justify-end">
            {editingId && (
              <Button
                type="button"
                variant="outline"
                className="mr-2"
                onClick={() => {
                  resetForm();
                  setEditingId(null);
                }}
                disabled={saving}
              >
                Цуцлах
              </Button>
            )}
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {editingId ? "Шинэчилж байна..." : "Хадгалж байна..."}
                </>
              ) : (
                <>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  {editingId ? "Шинэчлэх" : "Нэмэх"}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Бүх хичээл</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {classes.length === 0 ? (
            <p className="text-muted-foreground">Хичээл олдсонгүй</p>
          ) : (
            classes.map((c) => (
              <div
                key={c._id}
                className="flex items-center justify-between border rounded-md p-3"
              >
                <div className="space-y-1">
                  <p className="font-semibold">{c.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {c.instructor} • {c.schedule} • {c.capacity} хүн
                  </p>
                  {c.location && (
                    <p className="text-sm text-muted-foreground">
                      Байршил: {c.location}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditSelect(c)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Засах
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(c._id)}
                    disabled={deletingId === c._id}
                  >
                    {deletingId === c._id ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Устгаж байна...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Устгах
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

