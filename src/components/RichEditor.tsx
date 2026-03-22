"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import type { JSONContent } from "@tiptap/core";
import { Bold } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTiptapExtensions } from "@/lib/tiptapExtensions";

export function RichEditor({
  value,
  onChange,
  placeholder,
}: {
  value: JSONContent | null | undefined;
  onChange: (json: JSONContent) => void;
  placeholder?: string;
}) {
  const editor = useEditor({
    extensions: getTiptapExtensions(placeholder),
    content: value ?? { type: "doc", content: [{ type: "paragraph" }] },

    immediatelyRender: false, // 👈 OBAVEZNO u Next.js App Routeru

    onUpdate: ({ editor }) => onChange(editor.getJSON()),
    editorProps: {
      attributes: {
        class: "max-w-none min-h-[100px] focus:outline-none",
      },
    },
  });

  const sizes = [
    "12px",
    "14px",
    "16px",
    "18px",
    "20px",
    "24px",
    "28px",
    "32px",
    "36px",
  ];

  // ✅ handleri sigurni i prije nego editor postoji
  const applySize = (size: string | null) => {
    if (!editor) return;
    const chain = editor.chain().focus();
    chain.setMark("textStyle", { fontSize: size ?? null }).run();
  };

  const changeSize = (delta: number) => {
    if (!editor) return;

    const currentSize =
      (editor.getAttributes("textStyle")?.fontSize as string) || "";
    const baseIdx = currentSize
      ? sizes.indexOf(currentSize)
      : sizes.indexOf("16px");
    const idx = baseIdx >= 0 ? baseIdx : sizes.indexOf("16px");

    let next = idx + delta;
    if (next < 0) next = 0;
    if (next >= sizes.length) next = sizes.length - 1;

    applySize(sizes[next]);
  };

  if (!editor) return null;

  const currentSize =
    (editor.getAttributes("textStyle")?.fontSize as string) || "";

  return (
    <div className="rounded-md border">
      <div className="flex items-center gap-1 border-b p-2">
        <Button
          type="button"
          size="sm"
          variant={editor.isActive("bold") ? "default" : "outline"}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </Button>

        <div className="ml-2 flex items-center gap-1">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => changeSize(-1)}
          >
            A-
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => changeSize(1)}
          >
            A+
          </Button>

          <select
            className="ml-2 h-8 rounded border px-2 text-sm"
            value={currentSize}
            onChange={(e) => applySize(e.target.value || null)}
          >
            <option value="">Default</option>
            {sizes.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ✅ Ako želiš typography, stavi prose ovdje, ali obavezno not-prose na editoru */}
      <div className="p-3">
        <div className="prose max-w-none">
          <EditorContent editor={editor} className="not-prose" />
        </div>
      </div>
    </div>
  );
}
