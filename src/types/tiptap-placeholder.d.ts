declare module '@tiptap/extension-placeholder' {
    type PlaceholderOptions = {
        placeholder?: string;
        showOnlyWhenFocused?: boolean;
        showOnlyWhenEditable?: boolean;
        emptyNodeClass?: string;
    };

    const Placeholder: {
        configure: (options?: PlaceholderOptions) => unknown;
    };

    export default Placeholder;
}
