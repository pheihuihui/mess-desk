export { };

declare global {

    interface Window {
        markdownToHtml: (input: string) => string
    }

    namespace JSX {
        interface IntrinsicElements {
            ElemBefore: React.ReactNode;
        }
    }
    
}