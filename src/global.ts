export { };

declare global {

    interface Window {
        markdownToHtml: (input: string) => string
    }

}