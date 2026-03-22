import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import Placeholder from "@tiptap/extension-placeholder";
import { Extension } from "@tiptap/core";
import type { AnyExtension } from "@tiptap/core";

type PlaceholderOptions = {
    placeholder?: string;
    showOnlyWhenFocused?: boolean;
    showOnlyWhenEditable?: boolean;
    emptyNodeClass?: string;
};

const PlaceholderExtension = Placeholder as {
    configure: (options?: PlaceholderOptions) => AnyExtension;
};

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

export const TIPTAP_EXTENSIONS: AnyExtension[] = [StarterKit, TextStyle, FontSize];

export function getTiptapExtensions(placeholder?: string): AnyExtension[] {
    return [
        ...TIPTAP_EXTENSIONS,
        PlaceholderExtension.configure({
            placeholder: placeholder ?? "Upišite tekst…",
            showOnlyWhenFocused: false,
            showOnlyWhenEditable: true,
            emptyNodeClass: "is-editor-empty",
        }),
    ];
}
