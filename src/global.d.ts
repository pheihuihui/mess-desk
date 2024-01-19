export declare global {
    interface Window {
        initDB: () => any
        markdownToHtml: (input: string) => string
        twttr: any
        debugging: {
            fromHash: any
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
