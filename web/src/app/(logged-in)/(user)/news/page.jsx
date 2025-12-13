"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Newspaper } from "lucide-react";
import Link from "next/link";

export default function NewsPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState("all");

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      // In a real app, this would fetch from an API endpoint
      // For now, we'll simulate with empty array
      // You would create an API route like /api/articles
      const res = await fetch("/api/articles");
      if (res.ok) {
        const data = await res.json();
        setArticles(data.articles || []);
      }
    } catch (error) {
      console.error("Failed to fetch articles:", error);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const allTags = Array.from(
    new Set(articles.flatMap((article) => article.tags || []))
  );

  const filteredArticles =
    selectedTag === "all"
      ? articles
      : articles.filter((article) =>
          article.tags?.includes(selectedTag)
        );

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
        <h1 className="text-3xl font-bold tracking-tight">Мэдээ</h1>
        <p className="text-muted-foreground">
          Шинэ мэдээ, мэдээлэл болон зарлалууд
        </p>
      </div>

      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedTag === "all" ? "default" : "outline"}
            onClick={() => setSelectedTag("all")}
            size="sm"
          >
            Бүгд
          </Button>
          {allTags.map((tag) => (
            <Button
              key={tag}
              variant={selectedTag === tag ? "default" : "outline"}
              onClick={() => setSelectedTag(tag)}
              size="sm"
            >
              {tag}
            </Button>
          ))}
        </div>
      )}

      {filteredArticles.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Newspaper className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              Мэдээ олдсонгүй
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((article) => (
            <Card key={article._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                {article.createdAt && (
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(article.createdAt), "yyyy-MM-dd HH:mm")}
                  </p>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  className="prose prose-sm max-w-none line-clamp-3"
                  dangerouslySetInnerHTML={{
                    __html: article.code?.substring(0, 200) + "...",
                  }}
                />
                {article.tags && article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {article.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <Link href={`/news/${article._id}`}>
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

