"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Loader2, PlusCircle, Trash2, Image as ImageIcon } from "lucide-react";

export default function ManageShopPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    price: "",
    amount: "",
    imageData: "",
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/shop");
      const data = await res.json();
      if (res.ok) {
        setItems(data.items || []);
      } else {
        toast.error(data.error || "Failed to load items");
      }
    } catch (err) {
      console.error("Failed to fetch items", err);
      toast.error("Failed to load items");
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Image file required");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, imageData: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleCreate = async () => {
    if (!form.name || form.price === "" || form.amount === "") {
      toast.error("Нэр, үнэ, тоо хэмжээг бөглөнө үү");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/shop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Бараа нэмэгдлээ");
        setForm({ name: "", price: "", amount: "", imageData: "" });
        if (fileInputRef.current) fileInputRef.current.value = "";
        fetchItems();
      } else {
        toast.error(data.error || "Нэмэхэд алдаа гарлаа");
      }
    } catch (err) {
      console.error("Create item error", err);
      toast.error("Нэмэхэд алдаа гарлаа");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/shop/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        toast.success("Устгагдлаа");
        setItems((prev) => prev.filter((i) => i._id !== id));
      } else {
        toast.error(data.error || "Устгахад алдаа гарлаа");
      }
    } catch (err) {
      console.error("Delete item error", err);
      toast.error("Устгахад алдаа гарлаа");
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
        <h1 className="text-3xl font-bold tracking-tight">Дэлгүүр удирдах</h1>
        <p className="text-muted-foreground">Бараа нэмэх, устгах</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Бараа нэмэх</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Нэр</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Фитнес тоног төхөөрөмж..."
            />
          </div>
          <div className="space-y-2">
            <Label>Үнэ</Label>
            <Input
              type="number"
              min="0"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="10000"
            />
          </div>
          <div className="space-y-2">
            <Label>Тоо хэмжээ</Label>
            <Input
              type="number"
              min="0"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              placeholder="10"
            />
          </div>
          <div className="space-y-2">
            <Label>Зураг (сонголт)</Label>
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                ref={fileInputRef}
              />
              {form.imageData && <ImageIcon className="h-5 w-5 text-primary" />}
            </div>
          </div>
          <div className="md:col-span-2 flex justify-end">
            <Button onClick={handleCreate} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Хадгалж байна...
                </>
              ) : (
                <>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Нэмэх
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Бүх бараа</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {items.length === 0 ? (
            <p className="text-muted-foreground">Бараа олдсонгүй</p>
          ) : (
            items.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between border rounded-md p-3 gap-3"
              >
                <div className="flex items-center gap-3">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div className="space-y-1">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Үнэ: {item.price} • Үлдэгдэл: {item.amount}
                    </p>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(item._id)}
                  disabled={deletingId === item._id}
                >
                  {deletingId === item._id ? (
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
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

