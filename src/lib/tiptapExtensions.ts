import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import Placeholder from "@tiptap/extension-placeholder";
import { Extension } from "@tiptap/core";

export const FontSize = Extension.create({
    name: "fontSize",
    addGlobalAttributes() {
        return [
            {
                types: ["textStyle"],
                attributes: {
                    fontSize: {
                        default: null,
                        parseHTML: (element) => (element as HTMLElement).style.fontSize || null,
                        renderHTML: (attributes) => {
                            if (!attributes.fontSize) return {};
                            return { style: `font-size: ${attributes.fontSize}` };
                        },
                    },
                },
            },
        ];
    },
});

export const TIPTAP_EXTENSIONS = [StarterKit, TextStyle, FontSize] as const;

export function getTiptapExtensions(placeholder?: string) {
    return [
        ...TIPTAP_EXTENSIONS,
        Placeholder.configure({
            placeholder: placeholder ?? "Upišite tekst…",
            showOnlyWhenFocused: false,
            showOnlyWhenEditable: true,
            emptyNodeClass: "is-editor-empty",
        }),
    ];
}
