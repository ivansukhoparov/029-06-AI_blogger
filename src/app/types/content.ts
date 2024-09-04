export type RawContentPlanItem = {

    date: string
    topic: string
    title: string
    outline: string
    keywords: Array<string>
    content_type: string
    post_length: {
        min: number,   // Минимальное количество слов
        max: number    // Максимальное количество слов
    }
    language: string
    is_topic_exploration?: boolean
    with_picture?: boolean
}


export type ContentItemType = {
    createdAt: string
    updatedAt: string | null
    isPublicized: boolean
    isGenerated: boolean
    type: "main" | "additional"
    publicationDate: string
    topic: string
    title: string
    outline: string
    keywords: Array<string>
    contentType: string
    shortDescription: string | null
     textContent: string | null
    shortContentRu: string | null
    shortContentEn: string | null
    fullContentRu: string | null
    fullContentEn: string | null
    additionalKeyword: Array<string> | null
    with_image: boolean | null,
    image_prompt: string | null
    image: string | null
}

export class ContentItem {
    public id: string | null = null
    public createdAt: string
    public updatedAt: string | null = null
    public isPublicized: boolean = false
    public isGenerated: boolean = false
    public type: "main" | "additional" = "main"
    public publicationDate: string
    public topic: string
    public title: string
    public outline: string
    public keywords: Array<string>
    public contentType: string
    public shortDescription: string | null = null
    public textContent: string | null
    public shortContentRu: string | null = null
    public shortContentEn: string | null = null
    public fullContentRu: string | null = null
    public fullContentEn: string | null = null
    public additionalKeyword: Array<string> | null = null
    public withImage: boolean | null = null
    public imagePrompt: string | null = null
    public image: string | null = null

    constructor(item: any, date: Date) {
        this.createdAt = new Date().toISOString()
        this.publicationDate = date.toISOString().split("T")[0]
        this.topic = item.topic
        this.title = item.title
        this.outline = item.outline
        this.keywords = item.keywords
        this.contentType = item.content_type
        this.textContent =  null
    }
}


