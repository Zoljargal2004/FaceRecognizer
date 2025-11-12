"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import { useEffect, useState } from "react";

export default function ArticleEditor() {
  const [html, setHtml] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  // ✅ Prevent SSR rendering
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [StarterKit, Image, Youtube],
    content: "<p>Write your article here...</p>",
    onUpdate: ({ editor }) => {
      setHtml(editor.getHTML());
    },
    immediatelyRender: false, // ✅ fix hydration mismatch
  });

  if (!isMounted || !editor) return null;

  const addImage = () => {
    const url = prompt("Image URL:");
    if (url) editor.chain().focus().setImage({ src: url }).run();
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
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
          H2
        </button>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()}>
          • List
        </button>
        <button onClick={addImage}>🖼️ Image</button>
        <button onClick={addVideo}>🎥 YouTube</button>
      </div>

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
    </div>
  );
}
