const DESQ_NEW_IMAGE = 'http://localhost:8080/desq'

chrome.runtime.onMessage.addListener((msg, sneder, sendResp) => {
    if (msg && msg.type == 'saving-image' && msg.src) {
        fetch(msg.src)
            .then(x => x.blob())
            .then(blobToBase64)
            .then(b => navigator.clipboard.writeText(b as string)
            )
            .then(() => {
                window.open(DESQ_NEW_IMAGE, '_blank')
            })
    }
})


const blobToBase64 = (blob: Blob) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = _ => resolve(reader.result)
        reader.onerror = _ => reject()
        reader.readAsDataURL(blob)
    })
}
