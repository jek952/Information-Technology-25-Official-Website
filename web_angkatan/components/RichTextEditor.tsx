"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { useRef } from "react";

type Props = {
  onChange: (html: string) => void;
};

export default function RichTextEditor({ onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Image.configure({ inline: false, allowBase64: true }),
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: "Ketik isi artikel di sini..." }),
    ],
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base max-w-none min-h-[320px] p-4 outline-none focus:outline-none",
      },
    },
  });

  if (!editor) return null;

  // Insert image dari file komputer (dikonversi ke base64)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      editor.chain().focus().setImage({ src: url }).run();
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // Insert link
  const handleSetLink = () => {
    const url = window.prompt("Masukkan URL:");
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  const ToolbarBtn = ({
    onClick,
    active,
    label,
    title,
  }: {
    onClick: () => void;
    active?: boolean;
    label: React.ReactNode;
    title?: string;
  }) => (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`px-2 py-1 rounded text-sm transition-colors ${
        active
          ? "bg-hijauhunter text-white"
          : "hover:bg-gray-200 text-gray-700"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-hijauterang transition">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1 items-center">
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          label={<b>B</b>}
          title="Bold"
        />
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          label={<i>I</i>}
          title="Italic"
        />
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
          label={<u>U</u>}
          title="Underline"
        />
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
          label={<s>S</s>}
          title="Strikethrough"
        />

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive("heading", { level: 1 })}
          label="H1"
        />
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
          label="H2"
        />
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
          label="H3"
        />

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          label="• List"
        />
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          label="1. List"
        />
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          label="❝"
          title="Blockquote"
        />

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <ToolbarBtn
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          active={editor.isActive({ textAlign: "left" })}
          label="⬅"
          title="Rata Kiri"
        />
        <ToolbarBtn
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          active={editor.isActive({ textAlign: "center" })}
          label="↔"
          title="Rata Tengah"
        />
        <ToolbarBtn
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          active={editor.isActive({ textAlign: "right" })}
          label="➡"
          title="Rata Kanan"
        />

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <ToolbarBtn
          onClick={handleSetLink}
          active={editor.isActive("link")}
          label="🔗"
          title="Sisipkan Link"
        />

        {/* Upload Gambar */}
        <button
          type="button"
          title="Upload Gambar"
          onMouseDown={(e) => {
            e.preventDefault();
            fileInputRef.current?.click();
          }}
          className="px-2 py-1 rounded text-sm hover:bg-gray-200 text-gray-700 transition-colors"
        >
          🖼️ Gambar
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleImageUpload}
        />

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <ToolbarBtn
          onClick={() => editor.chain().focus().undo().run()}
          label="↩"
          title="Undo"
        />
        <ToolbarBtn
          onClick={() => editor.chain().focus().redo().run()}
          label="↪"
          title="Redo"
        />
      </div>

      {/* Editor Area */}
      <EditorContent editor={editor} />
    </div>
  );
}
