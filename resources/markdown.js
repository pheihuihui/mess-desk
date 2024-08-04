import init, { markdown_to_html } from "./pkg/markdown_reader.js"
init().then(() => {
    window.markdownToHtml = markdown_to_html
})
