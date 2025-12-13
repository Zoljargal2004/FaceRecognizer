"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function WriteNewsPage() {
  const [html, setHtml] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const res = await fetch("/api/tags");
      const data = await res.json();
      if (data.tags) {
        setAvailableTags(data.tags.map((t) => t.name || t));
      }
    } catch (error) {
      console.error("Failed to fetch tags:", error);
    }
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image,
    ],
    content: "<p>Write your article here...</p>",
    onUpdate: ({ editor }) => {
      setHtml(editor.getHTML());
    },
    immediatelyRender: false,
  });

  if (!isMounted || !editor) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin" size={24} />
      </div>
    );
  }

  const blobToBase64 = (blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const sizeMb = file.size / 1024 / 1024;
    if (sizeMb > 300) {
      toast.error("Image exceeds the 300 MB limit.");
      event.target.value = "";
      return;
    }

    try {
      const base64DataUrl = await blobToBase64(file);
      editor.chain().focus().setImage({ src: base64DataUrl }).run();
    } catch (error) {
      console.error("Image insert failed", error);
      toast.error("Could not load image. Please try again.");
    } finally {
      event.target.value = "";
    }
  };

  const addImage = () => {
    fileInputRef.current?.click();
  };

  const addTag = () => {
    if (selectedTag && !tags.includes(selectedTag)) {
      setTags([...tags, selectedTag]);
      setSelectedTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (
      !html ||
      html === "<p>Write your article here...</p>" ||
      html === "<p></p>"
    ) {
      toast.error("Please write some content");
      return;
    }

    if (tags.length === 0) {
      toast.error("Please add at least one tag");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/write-article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          code: html,
          tags,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Article created successfully!");
        // Reset form
        setTitle("");
        setTags([]);
        editor.commands.setContent("<p>Write your article here...</p>");
        router.push("/");
      } else {
        toast.error(data.error || "Failed to create article");
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Failed to submit article");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Мэдээ бичих</h1>
        <p className="text-muted-foreground">
          Шинэ мэдээний гарчиг, агуулга, таг нэмнэ үү.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Мэдээний мэдээлэл</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Гарчиг</Label>
            <Input
              id="title"
              placeholder="Мэдээний гарчиг оруулна уу"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Таг</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Таг сонгох эсвэл бичих"
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                list="tags-list"
              />
              <datalist id="tags-list">
                {availableTags.map((tag) => (
                  <option key={tag._id} value={tag.emoji + " " + tag.tag} />
                ))}
              </datalist>
              <Button type="button" onClick={addTag} variant="outline">
                Нэмэх
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-destructive"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Агуулга</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Toolbar */}
          <div className="flex flex-wrap gap-2 border p-2 rounded bg-muted">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <strong>B</strong>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <em>I</em>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => editor.chain().focus().setParagraph().run()}
            >
              P
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
            >
              H1
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
            >
              H2
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              • List
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addImage}
            >
              🖼️ Image
            </Button>
          </div>

          {/* Hidden file input for images */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />

          {/* Editor */}
          <EditorContent
            editor={editor}
            className="border p-4 min-h-[400px] bg-card rounded-md prose max-w-none"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Урьдчилан харах</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="prose max-w-none news-preview"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={submitting}
        >
          Цуцлах
        </Button>
        <Button type="button" onClick={handleSubmit} disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Хадгалж байна...
            </>
          ) : (
            "Хадгалах"
          )}
        </Button>
      </div>

      {/* Preview typography styles */}
      <style jsx global>{`
        .news-preview h1 {
          font-size: 1.75rem;
          line-height: 2.25rem;
          font-weight: 700;
          margin: 0.75rem 0 0.5rem;
        }
        .news-preview h2 {
          font-size: 1.5rem;
          line-height: 2rem;
          font-weight: 700;
          margin: 0.65rem 0 0.45rem;
        }
        .news-preview h3 {
          font-size: 1.25rem;
          line-height: 1.75rem;
          font-weight: 600;
          margin: 0.55rem 0 0.4rem;
        }
        .news-preview p {
          margin: 0.35rem 0;
        }
        .news-preview ul {
          list-style: disc;
          padding-left: 1.25rem;
          margin: 0.35rem 0;
        }
        .news-preview img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1rem 0;
        }
      `}</style>
    </div>
  );
}
