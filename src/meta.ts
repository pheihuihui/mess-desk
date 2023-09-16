export namespace DBStorage {
    export interface PageArchive {
        src: string
        domain: string
        title: string
        timestamp: number
        content: string
    }

    export interface DateInfo {
        yyyy?: number
        mm?: number
        dd?: number
    }

    export interface PersonInfo {
        id: string
        name: string
        birth?: DateInfo
        death?: DateInfo
        img?: string
        description?: string
    }

    export interface ImageInfo {
        imageUrl: string
        thumbnailUrl: string
        description: string
        tags: string[]
    }
}
