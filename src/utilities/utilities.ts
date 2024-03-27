import { DBStorage } from "../meta"

export const formatDate = (date?: DBStorage.DateInfo) => (date ? `${date.yyyy ?? "????"}/${date.mm ?? "??"}/${date.dd ?? "??"}` : "????/??/??")
export const formatPeriod = (from?: DBStorage.DateInfo, to?: DBStorage.DateInfo) => `${formatDate(from)} - ${formatDate(to)}`

export async function hashBlob(content: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsArrayBuffer(content)
        reader.onloadend = async function () {
            const hashBuffer = await crypto.subtle.digest("SHA-1", reader.result as BufferSource)
            const hashHex = Array.from(new Uint8Array(hashBuffer))
                .map((b) => b.toString(16).padStart(2, "0"))
                .join("")
            resolve(hashHex)
        }
    })
}

export async function _blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(blob)
        reader.onloadend = function () {
            const base64data = reader.result as string
            resolve(base64data)
        }
    })
}

export async function getImageFromClipboard() {
    return navigator.clipboard
        .read()
        .then((items) => {
            for (let item of items) {
                if (item.types.includes("image/png")) {
                    return item.getType("image/png").then((blob) => {
                        return URL.createObjectURL(blob)
                    })
                }
            }
        })
        .catch((_) => {
            console.log("not focused")
        })
}
