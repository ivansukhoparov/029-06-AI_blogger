
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


export type ContentItem = {
    createdAt:  string
    updatedAt: string | null
    isPublicized: boolean
    isGenerated:boolean
    type: "main" | "additional"
    publicationDate: string
    topic: string
    title: string
    outline: string
    keywords: Array<string>
    contentType: string
    shortDescription:string|null
    shortContentRu: string|null
    shortContentEn: string|null
    fullContentRu:string|null
    fullContentEn:string|null
    additionalKeyword:Array<string> |null
    with_image: boolean|null,
    image_prompt:string|null
    image:string|null
}
