"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Highlight from "@tiptap/extension-highlight";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Strikethrough from "@tiptap/extension-strike";
import Underline from "@tiptap/extension-underline";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Youtube from "@tiptap/extension-youtube";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import { common, createLowlight } from "lowlight";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  ListChecks,
  Quote,
  Undo,
  Redo,
  Heading2,
  Heading1,
  Heading3,
  Heading4,
  ImageIcon,
  Link2,
  Palette,
  Code2,
  Table2,
  Strikethrough as StrikethroughIcon,
  Upload,
  Loader,
  Highlighter,
  Minus,
  Youtube as YoutubeIcon,
  Code,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  isMarkdownContent,
  parseMarkdownToHtml,
  cleanHtmlContent,
} from "@/components/blog/utils/markdownParser";
import { ResizableImage } from "@/components/blog/editor/resizable-image";
import { SlashCommand } from "@/components/blog/editor/slash-command";
import { LinkDialog } from "@/components/blog/editor/link-dialog";

const lowlight = createLowlight(common);

export interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  autosaveKey?: string;
  onAutosave?: (content: string) => void;
  className?: string;
  distractionFree?: boolean;
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = "Start writing, or type / for commands…",
  autosaveKey,
  onAutosave,
  className = "",
  distractionFree = false,
}: RichTextEditorProps) {
  const [customColor, setCustomColor] = useState("#000000");
  const [uploading, setUploading] = useState(false);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isInternalUpdate = useRef(false);
  const editorRef = useRef<ReturnType<typeof useEditor>>(null);

  const handleImageUpload = useCallback(
    async (file: File, editorInstance?: NonNullable<typeof editorRef.current>) => {
      const editor = editorInstance ?? editorRef.current;
      if (!editor) return;

      try {
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch("/api/upload", { method: "POST", body: formData });
        if (!response.ok) throw new Error("Upload failed");
        const data = await response.json();
        const caption = window.prompt("Image caption (optional):") || undefined;
        editor
          .chain()
          .focus()
          .setImage({ src: data.url, alt: file.name, caption } as never)
          .run();
      } catch {
        alert("Failed to upload image. Please try again.");
      } finally {
        setUploading(false);
      }
    },
    []
  );

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        heading: { levels: [1, 2, 3, 4] },
        bulletList: {
          HTMLAttributes: { class: "blog-bullet-list" },
        },
        orderedList: {
          HTMLAttributes: { class: "blog-ordered-list" },
        },
        horizontalRule: false,
      }),
      HorizontalRule,
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Strikethrough,
      ResizableImage.configure({
        HTMLAttributes: { class: "rounded-lg max-w-full h-auto" },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-primary underline", rel: "noopener noreferrer" },
      }),
      CodeBlockLowlight.configure({ lowlight }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({ nested: true }),
      Youtube.configure({
        width: 640,
        height: 360,
        HTMLAttributes: { class: "blog-youtube-embed" },
      }),
      Placeholder.configure({ placeholder }),
      CharacterCount,
      SlashCommand,
    ],
    content,
    onUpdate: ({ editor: ed }) => {
      isInternalUpdate.current = true;
      const html = ed.getHTML();
      onChange(html);

      if (autosaveKey) {
        try {
          localStorage.setItem(autosaveKey, html);
          setLastSaved(new Date());
          onAutosave?.(html);
        } catch {
          /* ignore quota errors */
        }
      }
    },
    editorProps: {
      attributes: {
        class: `blog-editor prose prose-sm sm:prose lg:prose-lg max-w-none focus:outline-none min-h-[400px] p-6 dark:prose-invert`,
        spellcheck: "true",
        "aria-label": "Blog post content editor",
      },
      handlePaste: (_view, event) => {
        const ed = editorRef.current;
        if (!ed) return false;

        const html = event.clipboardData?.getData("text/html");
        const text = event.clipboardData?.getData("text/plain");
        const files = event.clipboardData?.files;

        if (files?.length) {
          const images = Array.from(files).filter((f) => f.type.startsWith("image/"));
          if (images.length) {
            images.forEach((file) => handleImageUpload(file, ed));
            event.preventDefault();
            return true;
          }
        }

        if (html) {
          ed.chain().focus().insertContent(cleanHtmlContent(html)).run();
          event.preventDefault();
          return true;
        }

        if (text && isMarkdownContent(text)) {
          ed.chain().focus().insertContent(parseMarkdownToHtml(text)).run();
          event.preventDefault();
          return true;
        }

        return false;
      },
      handleDOMEvents: {
        dragover: (_view, event) => {
          event.preventDefault();
          if (event.dataTransfer) event.dataTransfer.dropEffect = "copy";
          return true;
        },
        drop: (_view, event) => {
          event.preventDefault();
          const ed = editorRef.current;
          const files = event.dataTransfer?.files;
          if (files?.length && ed) {
            Array.from(files)
              .filter((f) => f.type.startsWith("image/"))
              .forEach((file) => handleImageUpload(file, ed));
            return true;
          }
          return false;
        },
      },
    },
    immediatelyRender: false,
  });

  editorRef.current = editor;

  // Sync external content changes (e.g. loading saved post)
  useEffect(() => {
    if (!editor || isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }
    const current = editor.getHTML();
    if (content !== current && content !== "<p></p>") {
      editor.commands.setContent(content, { emitUpdate: false });
    }
  }, [content, editor]);

  // Restore autosaved draft on mount
  useEffect(() => {
    if (!autosaveKey || !editor || content) return;
    try {
      const draft = localStorage.getItem(autosaveKey);
      if (draft && draft !== "<p></p>") {
        editor.commands.setContent(draft, { emitUpdate: false });
        onChange(draft);
      }
    } catch {
      /* ignore */
    }
  }, [autosaveKey, editor, content, onChange]);

  const openLinkDialog = () => setLinkDialogOpen(true);

  const saveLink = (url: string, openInNewTab: boolean) => {
    if (!editor) return;
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({
        href: url,
        target: openInNewTab ? "_blank" : null,
        rel: openInNewTab ? "noopener noreferrer" : null,
      })
      .run();
  };

  const removeLink = () => {
    editor?.chain().focus().extendMarkRange("link").unsetLink().run();
    setLinkDialogOpen(false);
  };

  const addYoutube = () => {
    const url = window.prompt("Enter YouTube URL:");
    if (url && editor) editor.commands.setYoutubeVideo({ src: url });
  };

  const resizeSelectedImage = () => {
    if (!editor) return;
    const width = window.prompt("Image width (e.g. 50%, 300px, 100%):", "100%");
    if (width) editor.chain().focus().updateAttributes("image", { width }).run();
  };

  const colorPalette = [
    "#000000", "#ffffff", "#ef4444", "#f97316", "#f59e0b", "#84cc16",
    "#22c55e", "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899", "#64748b",
  ];

  if (!editor) return null;

  const highlightColors = ["#fef08a", "#bbf7d0", "#bfdbfe", "#fbcfe8", "#e9d5ff"];

  const ToolbarButton = ({
    onClick,
    active,
    disabled,
    title,
    children,
  }: {
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
    title: string;
    children: React.ReactNode;
  }) => (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className={active ? "bg-muted" : ""}
      title={title}
      aria-label={title}
      aria-pressed={active}
    >
      {children}
    </Button>
  );

  return (
    <div className={`blog-editor-shell border rounded-xl overflow-hidden bg-background ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        disabled={uploading}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleImageUpload(file);
          e.target.value = "";
        }}
      />

      <div
        className={`blog-editor-toolbar sticky top-0 z-20 flex flex-wrap gap-1 p-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 ${distractionFree ? "shadow-sm" : ""}`}
        role="toolbar"
        aria-label="Formatting toolbar"
      >
        <div className="flex flex-wrap gap-1">
          <ToolbarButton title="Bold (Ctrl+B)" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
            <Bold className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton title="Italic (Ctrl+I)" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
            <Italic className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton title="Underline (Ctrl+U)" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
            <UnderlineIcon className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton title="Strikethrough" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
            <StrikethroughIcon className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton title="Inline code" active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()}>
            <Code className="h-4 w-4" />
          </ToolbarButton>
        </div>

        <div className="w-px bg-border self-stretch" aria-hidden="true" />

        <div className="flex flex-wrap gap-1">
          {([1, 2, 3, 4] as const).map((level) => {
            const Icon = [Heading1, Heading2, Heading3, Heading4][level - 1];
            return (
              <ToolbarButton
                key={level}
                title={`Heading ${level}`}
                active={editor.isActive("heading", { level })}
                onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
              >
                <Icon className="h-4 w-4" />
              </ToolbarButton>
            );
          })}
        </div>

        <div className="w-px bg-border self-stretch" aria-hidden="true" />

        <div className="flex flex-wrap gap-1">
          <ToolbarButton title="Bullet list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
            <List className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton title="Ordered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
            <ListOrdered className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton title="Checklist" active={editor.isActive("taskList")} onClick={() => editor.chain().focus().toggleTaskList().run()}>
            <ListChecks className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton title="Blockquote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
            <Quote className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton title="Code block" active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
            <Code2 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton title="Divider" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
            <Minus className="h-4 w-4" />
          </ToolbarButton>
        </div>

        <div className="w-px bg-border self-stretch" aria-hidden="true" />

        <div className="flex flex-wrap gap-1">
          <ToolbarButton title="Upload image" disabled={uploading} onClick={() => fileInputRef.current?.click()}>
            {uploading ? <Loader className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          </ToolbarButton>
          <ToolbarButton title="Image from URL" onClick={() => {
            const url = window.prompt("Enter image URL:");
            if (url) editor.chain().focus().setImage({ src: url }).run();
          }}>
            <ImageIcon className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton title="Resize image" onClick={resizeSelectedImage}>
            <span className="text-xs font-medium">↔</span>
          </ToolbarButton>
          <ToolbarButton title="YouTube embed" onClick={addYoutube}>
            <YoutubeIcon className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton title="Insert table" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>
            <Table2 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton title="Add link" active={editor.isActive("link")} onClick={openLinkDialog}>
            <Link2 className="h-4 w-4" />
          </ToolbarButton>
        </div>

        <div className="w-px bg-border self-stretch" aria-hidden="true" />

        <Popover>
          <PopoverTrigger asChild>
            <Button type="button" variant="ghost" size="sm" title="Text color" aria-label="Text color">
              <Palette className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56">
            <div className="grid grid-cols-6 gap-2">
              {colorPalette.map((color) => (
                <button
                  key={color}
                  type="button"
                  className="h-6 w-6 rounded border hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  aria-label={`Color ${color}`}
                  onClick={() => editor.chain().focus().setColor(color).run()}
                />
              ))}
            </div>
            <Button type="button" variant="outline" size="sm" className="w-full mt-3" onClick={() => editor.chain().focus().unsetColor().run()}>
              Remove color
            </Button>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button type="button" variant="ghost" size="sm" title="Highlight" aria-label="Highlight">
              <Highlighter className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48">
            <div className="flex gap-2">
              {highlightColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className="h-6 w-6 rounded border"
                  style={{ backgroundColor: color }}
                  aria-label={`Highlight ${color}`}
                  onClick={() => editor.chain().focus().toggleHighlight({ color }).run()}
                />
              ))}
            </div>
            <Button type="button" variant="outline" size="sm" className="w-full mt-3" onClick={() => editor.chain().focus().unsetHighlight().run()}>
              Remove highlight
            </Button>
          </PopoverContent>
        </Popover>

        <div className="flex gap-1 ml-auto">
          <ToolbarButton title="Undo (Ctrl+Z)" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}>
            <Undo className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton title="Redo (Ctrl+Y)" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}>
            <Redo className="h-4 w-4" />
          </ToolbarButton>
        </div>
      </div>

      <div className="blog-editor-content max-w-3xl mx-auto">
        <EditorContent editor={editor} />
      </div>

      <div className="flex items-center justify-between px-4 py-2 border-t text-xs text-muted-foreground bg-muted/30">
        <span>
          {editor.storage.characterCount.words()} words · {editor.storage.characterCount.characters()} characters
        </span>
        {lastSaved && (
          <span>Draft saved {lastSaved.toLocaleTimeString()}</span>
        )}
      </div>

      <LinkDialog
        open={linkDialogOpen}
        onOpenChange={setLinkDialogOpen}
        initialUrl={editor.getAttributes("link").href}
        initialOpenInNewTab={editor.getAttributes("link").target === "_blank"}
        onSave={saveLink}
        onRemove={removeLink}
      />
    </div>
  );
}
