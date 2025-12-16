"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Package } from "lucide-react";

export default function ShopPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

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
        setItems([]);
      }
    } catch (err) {
      console.error("Failed to load shop items", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-9 w-48" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-40 w-full mb-3" />
                <Skeleton className="h-4 w-24" />
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
        <h1 className="text-3xl font-bold tracking-tight">Дэлгүүр</h1>
        <p className="text-muted-foreground">Бараа болон үлдэгдлийг харна уу</p>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 gap-2">
            <Package className="h-10 w-10 text-muted-foreground" />
            <p className="text-muted-foreground">Бараа олдсонгүй</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Card key={item._id} className="h-full flex flex-col">
              {item.imageUrl && (
                <div className="w-full h-40 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  {item.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">
                  Үнэ: {item.price}
                </p>
                <p className="text-sm text-muted-foreground">
                  Үлдэгдэл: {item.amount}
                </p>
                <div className="pt-2 mt-auto">
                  <Button disabled className="w-full" variant="outline">
                    Худалдан авах (дараа)
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

