"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import { useEffect, useRef, useState } from "react";

export default function ArticleEditor() {
  const [html, setHtml] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image,
      Youtube,
    ],
    content: "<p>Write your article here...</p>",
    onUpdate: ({ editor }) => {
      setHtml(editor.getHTML());
    },
    immediatelyRender: false, // ✅ fix hydration mismatch
  });

  if (!isMounted || !editor) return null;

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
      alert("Image exceeds the 300 MB limit.");
      event.target.value = "";
      return;
    }

    try {
      const base64DataUrl = await blobToBase64(file);
      editor.chain().focus().setImage({ src: base64DataUrl }).run();
    } catch (error) {
      console.error("Image insert failed", error);
      alert("Could not load image. Please try again.");
    } finally {
      event.target.value = "";
    }
  };

  const addImage = () => {
    fileInputRef.current?.click();
  };

  const addVideo = () => {
    const url = prompt("YouTube URL:");
    if (url) editor.chain().focus().setYoutubeVideo({ src: url }).run();
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 border p-2 rounded bg-gray-50">
        <button onClick={() => editor.chain().focus().toggleBold().run()}>Bold</button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()}>Italic</button>
        <button onClick={() => editor.chain().focus().setParagraph().run()}>P</button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()}>
          • List
        </button>
        <button onClick={addImage}>🖼️ Image</button>
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
        className="border p-3 min-h-[300px] bg-white rounded shadow-inner prose"
      />

      {/* HTML Output */}
      <div className="border p-3 bg-gray-100 rounded">
        <h3 className="text-sm font-medium mb-2">HTML Output:</h3>
        <pre className="text-xs text-gray-700 whitespace-pre-wrap">{html}</pre>
      </div>

      {/* Preview (always visible at the bottom) */}
      <div className="border p-3 bg-white rounded shadow">
        <h3 className="text-sm font-medium mb-2">Preview:</h3>
        <div
          className="prose max-w-none news-preview"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>

      {/* Preview typography fallback in case Tailwind Typography isn't loaded */}
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
      `}</style>
    </div>
  );
}
