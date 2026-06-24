import Image from "@tiptap/extension-image";
import { mergeAttributes } from "@tiptap/core";

export const ResizableImage = Image.extend({
  name: "image",

  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: "100%",
        parseHTML: (element) =>
          element.getAttribute("data-width") ||
          element.style.width ||
          "100%",
        renderHTML: (attributes) => ({
          "data-width": attributes.width,
          style: `width: ${attributes.width}`,
        }),
      },
      alt: { default: null },
      title: { default: null },
      caption: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-caption"),
        renderHTML: (attributes) =>
          attributes.caption ? { "data-caption": attributes.caption } : {},
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    const { caption, ...rest } = HTMLAttributes;
    const img = ["img", mergeAttributes(rest, { class: "blog-image" })];
    if (caption) {
      return [
        "figure",
        { class: "blog-image-figure" },
        img,
        ["figcaption", { class: "blog-image-caption" }, caption],
      ];
    }
    return img;
  },
});
