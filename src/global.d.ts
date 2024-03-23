export declare global {
    interface Window {
        initDB: () => any
        markdownToHtml: (input: string) => string
        twttr: any
        debugging: {
            fromHash: any
        }
        katex: {
            render: (input: string, elem: HTMLElement, params: { throwOnError: boolean }) => void
        }
    }

    interface EventTarget {
        value: any
    }

    namespace JSX {
        interface IntrinsicElements {
            ElemBefore: React.ReactNode
        }
    }
}
