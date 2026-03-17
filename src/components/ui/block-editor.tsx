"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface BlockEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function BlockEditor({ value, onChange, placeholder = "Type '/' for commands...", className }: BlockEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
    content: parseContent(value),
    onUpdate: ({ editor }) => {
      onChange(JSON.stringify(editor.getJSON()));
    },
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm dark:prose-invert max-w-none min-h-[100px] focus:outline-none",
          className
        ),
      },
    },
  });

  // Update content when value changes externally (e.g., on reset)
  useEffect(() => {
    if (editor && value !== JSON.stringify(editor.getJSON())) {
      editor.commands.setContent(parseContent(value));
    }
  }, [value, editor]);

  return (
    <div className="w-full border rounded-md p-3 bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
      <EditorContent editor={editor} />
    </div>
  );
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
