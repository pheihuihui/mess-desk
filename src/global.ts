export { };

declare global {

    interface Window {
        markdownToHtml: (input: string) => string
        twttr: any
    }

    namespace JSX {
        interface IntrinsicElements {
            ElemBefore: React.ReactNode;
        }
    }

}