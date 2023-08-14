export { };

declare global {

    interface Window {
        markdownToHtml: (input: string) => string
        populateOneFile: (fileName: string, content: Blob) => void
        findOneFile: (name: string) => Promise<Blob>
        twttr: any
    }

    namespace JSX {
        interface IntrinsicElements {
            ElemBefore: React.ReactNode;
        }
    }

}