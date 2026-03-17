"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { cn } from "@/lib/utils";

interface BlockRendererProps {
  content: string;
  className?: string;
}

export function BlockRenderer({ content, className }: BlockRendererProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
    content: parseContent(content),
    editable: false,
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm dark:prose-invert max-w-none focus:outline-none",
          className
        ),
      },
    },
  });

  if (!editor) return null;

  return <EditorContent editor={editor} />;
}

function parseContent(content: string) {
  if (!content) return "";
  try {
    return JSON.parse(content);
  } catch (e) {
    // If it's not JSON, treat it as plain text/HTML
    return content;
  }
}
