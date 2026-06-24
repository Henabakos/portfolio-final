"use client";

import { Extension } from "@tiptap/core";
import Suggestion, { type SuggestionOptions } from "@tiptap/suggestion";
import { ReactRenderer } from "@tiptap/react";
import tippy, { type Instance as TippyInstance } from "tippy.js";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import type { Editor, Range } from "@tiptap/core";

export interface SlashCommandItem {
  title: string;
  description: string;
  icon: string;
  command: (props: { editor: Editor; range: Range }) => void;
}

export const slashCommands: SlashCommandItem[] = [
  {
    title: "Text",
    description: "Plain paragraph",
    icon: "¶",
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setParagraph().run(),
  },
  {
    title: "Heading 1",
    description: "Large section heading",
    icon: "H1",
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleHeading({ level: 1 }).run(),
  },
  {
    title: "Heading 2",
    description: "Medium section heading",
    icon: "H2",
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleHeading({ level: 2 }).run(),
  },
  {
    title: "Heading 3",
    description: "Small section heading",
    icon: "H3",
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleHeading({ level: 3 }).run(),
  },
  {
    title: "Heading 4",
    description: "Subsection heading",
    icon: "H4",
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleHeading({ level: 4 }).run(),
  },
  {
    title: "Bullet List",
    description: "Unordered list",
    icon: "•",
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleBulletList().run(),
  },
  {
    title: "Numbered List",
    description: "Ordered list",
    icon: "1.",
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleOrderedList().run(),
  },
  {
    title: "Checklist",
    description: "Task list with checkboxes",
    icon: "☑",
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleTaskList().run(),
  },
  {
    title: "Quote",
    description: "Blockquote",
    icon: "❝",
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleBlockquote().run(),
  },
  {
    title: "Code Block",
    description: "Syntax highlighted code",
    icon: "</>",
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
  },
  {
    title: "Divider",
    description: "Horizontal rule",
    icon: "—",
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setHorizontalRule().run(),
  },
  {
    title: "Image",
    description: "Upload or embed image",
    icon: "🖼",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run();
      const url = window.prompt("Enter image URL:");
      if (url) editor.chain().focus().setImage({ src: url }).run();
    },
  },
  {
    title: "YouTube",
    description: "Embed YouTube video",
    icon: "▶",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run();
      const url = window.prompt("Enter YouTube URL:");
      if (url) editor.commands.setYoutubeVideo({ src: url });
    },
  },
  {
    title: "Table",
    description: "3×3 table with header",
    icon: "⊞",
    command: ({ editor, range }) =>
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
        .run(),
  },
];

interface CommandListRef {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean;
}

const CommandList = forwardRef<
  CommandListRef,
  { items: SlashCommandItem[]; command: (item: SlashCommandItem) => void }
>(({ items, command }, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => setSelectedIndex(0), [items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (event.key === "ArrowUp") {
        setSelectedIndex((i) => (i + items.length - 1) % items.length);
        return true;
      }
      if (event.key === "ArrowDown") {
        setSelectedIndex((i) => (i + 1) % items.length);
        return true;
      }
      if (event.key === "Enter") {
        command(items[selectedIndex]);
        return true;
      }
      return false;
    },
  }));

  if (!items.length) {
    return (
      <div className="slash-menu p-2 text-sm text-muted-foreground">
        No results
      </div>
    );
  }

  return (
    <div className="slash-menu" role="listbox" aria-label="Slash commands">
      {items.map((item, index) => (
        <button
          key={item.title}
          type="button"
          role="option"
          aria-selected={index === selectedIndex}
          className={`slash-menu-item ${index === selectedIndex ? "is-selected" : ""}`}
          onClick={() => command(item)}
        >
          <span className="slash-menu-icon" aria-hidden="true">
            {item.icon}
          </span>
          <span>
            <span className="slash-menu-title">{item.title}</span>
            <span className="slash-menu-desc">{item.description}</span>
          </span>
        </button>
      ))}
    </div>
  );
});

CommandList.displayName = "CommandList";

export const SlashCommand = Extension.create({
  name: "slashCommand",

  addOptions() {
    return {
      suggestion: {
        char: "/",
        command: ({
          editor,
          range,
          props,
        }: {
          editor: Editor;
          range: Range;
          props: SlashCommandItem;
        }) => {
          props.command({ editor, range });
        },
      } as Partial<SuggestionOptions>,
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
        items: ({ query }: { query: string }) =>
          slashCommands.filter((item) =>
            item.title.toLowerCase().includes(query.toLowerCase())
          ),
        render: () => {
          let component: ReactRenderer<CommandListRef> | null = null;
          let popup: TippyInstance[] | null = null;

          return {
            onStart: (props) => {
              component = new ReactRenderer(CommandList, {
                props: {
                  items: props.items as SlashCommandItem[],
                  command: (item: SlashCommandItem) => {
                    props.command(item);
                  },
                },
                editor: props.editor,
              });

              if (!props.clientRect) return;

              popup = tippy("body", {
                getReferenceClientRect: props.clientRect as () => DOMRect,
                appendTo: () => document.body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: "manual",
                placement: "bottom-start",
              });
            },
            onUpdate(props) {
              component?.updateProps({
                items: props.items as SlashCommandItem[],
                command: (item: SlashCommandItem) => props.command(item),
              });
              if (props.clientRect) {
                popup?.[0]?.setProps({
                  getReferenceClientRect: props.clientRect as () => DOMRect,
                });
              }
            },
            onKeyDown(props) {
              if (props.event.key === "Escape") {
                popup?.[0]?.hide();
                return true;
              }
              return component?.ref?.onKeyDown(props) ?? false;
            },
            onExit() {
              popup?.[0]?.destroy();
              component?.destroy();
            },
          };
        },
      }),
    ];
  },
});
