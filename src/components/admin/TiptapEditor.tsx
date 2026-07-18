"use client";

import { useState } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link2,
  Undo,
  Redo,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Rich-text editor for blog authoring. Stores HTML in a hidden input so it
 * posts with the surrounding form. StarterKit v3 already includes Link, so we
 * don't add it separately (that would be a duplicate-extension error).
 */
export function TiptapEditor({
  name,
  defaultValue = "",
}: {
  name: string;
  defaultValue?: string;
}) {
  const [html, setHtml] = useState(defaultValue);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: {
          openOnClick: false,
          HTMLAttributes: { rel: "noopener noreferrer nofollow" },
        },
      }),
      Placeholder.configure({ placeholder: "Write the post here…" }),
    ],
    content: defaultValue,
    editorProps: {
      attributes: {
        class: "prose-serene max-w-none min-h-[320px] px-4 py-4",
      },
    },
    onUpdate: ({ editor }) => setHtml(editor.getHTML()),
  });

  return (
    <div className="overflow-hidden rounded-xl border border-sage-deep/40 bg-paper">
      {editor && <Toolbar editor={editor} />}
      <EditorContent editor={editor} />
      <input type="hidden" name={name} value={html} />
    </div>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const btn = (active: boolean) =>
    cn(
      "grid size-8 place-items-center rounded-md transition-colors",
      active ? "bg-pine text-paper" : "text-pine hover:bg-sage/60",
    );

  const setLink = () => {
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", previous ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-sage-deep/30 bg-sage/25 px-2 py-1.5">
      <button type="button" aria-label="Bold" className={btn(editor.isActive("bold"))} onClick={() => editor.chain().focus().toggleBold().run()}>
        <Bold className="size-4" />
      </button>
      <button type="button" aria-label="Italic" className={btn(editor.isActive("italic"))} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <Italic className="size-4" />
      </button>
      <span className="mx-1 h-5 w-px bg-sage-deep/30" />
      <button type="button" aria-label="Heading 2" className={btn(editor.isActive("heading", { level: 2 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        <Heading2 className="size-4" />
      </button>
      <button type="button" aria-label="Heading 3" className={btn(editor.isActive("heading", { level: 3 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
        <Heading3 className="size-4" />
      </button>
      <span className="mx-1 h-5 w-px bg-sage-deep/30" />
      <button type="button" aria-label="Bullet list" className={btn(editor.isActive("bulletList"))} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <List className="size-4" />
      </button>
      <button type="button" aria-label="Numbered list" className={btn(editor.isActive("orderedList"))} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <ListOrdered className="size-4" />
      </button>
      <button type="button" aria-label="Quote" className={btn(editor.isActive("blockquote"))} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        <Quote className="size-4" />
      </button>
      <button type="button" aria-label="Add link" className={btn(editor.isActive("link"))} onClick={setLink}>
        <Link2 className="size-4" />
      </button>
      <span className="mx-1 h-5 w-px bg-sage-deep/30" />
      <button type="button" aria-label="Undo" className={btn(false)} onClick={() => editor.chain().focus().undo().run()}>
        <Undo className="size-4" />
      </button>
      <button type="button" aria-label="Redo" className={btn(false)} onClick={() => editor.chain().focus().redo().run()}>
        <Redo className="size-4" />
      </button>
    </div>
  );
}
