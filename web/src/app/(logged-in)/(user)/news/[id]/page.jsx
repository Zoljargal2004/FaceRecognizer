"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewsDetailPage() {
  const params = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchArticle();
    }
  }, [params.id]);

  const fetchArticle = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/articles/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setArticle(data.article);
      }
    } catch (error) {
      console.error("Failed to fetch article:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-9 w-48" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex flex-col gap-6">
        <Link href="/news">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Буцах
          </Button>
        </Link>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">Мэдээ олдсонгүй</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <Link href="/news">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Буцах
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{article.title}</CardTitle>
          {article.createdAt && (
            <p className="text-sm text-muted-foreground">
              {format(new Date(article.createdAt), "yyyy-MM-dd HH:mm")}
            </p>
          )}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 bg-primary/10 text-primary rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div
            className="prose max-w-none news-article"
            dangerouslySetInnerHTML={{ __html: article.code }}
          />
        </CardContent>
      </Card>

      <style jsx global>{`
        .news-article h1 {
          font-size: 1.75rem;
          line-height: 2.25rem;
          font-weight: 700;
          margin: 1.5rem 0 1rem;
        }
        .news-article h2 {
          font-size: 1.5rem;
          line-height: 2rem;
          font-weight: 700;
          margin: 1.25rem 0 0.75rem;
        }
        .news-article h3 {
          font-size: 1.25rem;
          line-height: 1.75rem;
          font-weight: 600;
          margin: 1rem 0 0.5rem;
        }
        .news-article p {
          margin: 0.75rem 0;
          line-height: 1.75;
        }
        .news-article ul,
        .news-article ol {
          margin: 0.75rem 0;
          padding-left: 1.5rem;
        }
        .news-article img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1.5rem 0;
        }
        .news-article strong {
          font-weight: 600;
        }
        .news-article em {
          font-style: italic;
        }
      `}</style>
    </div>
  );
}

