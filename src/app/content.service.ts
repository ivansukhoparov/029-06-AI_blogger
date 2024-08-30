import {ContentItem} from "./types/content";
import {PromptsService} from "./prompts.service";
import {ContentRepository} from "./content.repository";
import {IGptService} from "./interfaces/gpt.servise.interface";
import {inject} from "inversify";
import {GptService} from "./gpt.service";

export class ContentService {

    constructor(@inject(GptService) private gptService: IGptService,
                @inject(PromptsService) private promptService: PromptsService,
                @inject(ContentRepository) private contentRepository: ContentRepository) {
    }

    async createContentPlan(startDate: string) {
        const timeframe = "3 days"
        const frequency = "daily"

        const prompt = this.promptService.generateContentPlanPrompt(timeframe, frequency)
        const rawContentPlan = await this.gptService.jsonRequest(prompt)
        const contentPlanDto = this._contentPlanMapper(rawContentPlan.content_plan, startDate)
        return await this.contentRepository.extendContentPlan(contentPlanDto)
    }

    async updatePostWithContent(publicationDate: string) {
        const contentPlanItem = await this.contentRepository.getContentPlanItem({publicationDate})
        const prompt = this.promptService.generatePostPrompt(contentPlanItem)
        const content = await this.gptService.jsonRequest(prompt)
        const updateDto = this._updateContentPlanItem(content)
        return await this.contentRepository.updateContentPlanItem(contentPlanItem.id, updateDto)
    }

    _updateContentPlanItem(rawContent: any) {
        console.log("rawContent", rawContent)
        return {
            updatedAt: new Date().toISOString(),
            isGenerated: true,
            //      keywords: rawContent.keywords,
            shortDescription: rawContent.description,
            shortContentRu: rawContent.content,
            additionalKeyword: null,
            with_image: rawContent.with_image,
            image_prompt: rawContent.image_prompt
        }
    }

    _contentPlanMapper(rawContentPlan: any, startDate: string) {
        const mappedContentPlan = []
        const year = Number(startDate.split("-")[0])
        const month = Number(startDate.split("-")[1]) - 1
        const day = Number(startDate.split("-")[2])

        let date = new Date(Date.UTC(year, month, day));

        for (let item of rawContentPlan) {
            const contentItem: ContentItem = {
                createdAt: new Date().toISOString(),
                updatedAt: null,
                isPublicized: false,
                isGenerated: false,
                type: "main",
                publicationDate: date.toISOString().split("T")[0],
                topic: item.topic,
                title: item.title,
                outline: item.outline,
                keywords: item.keywords,
                contentType: item.content_type,
                shortDescription: null,
                shortContentRu: null,
                shortContentEn: null,
                fullContentRu: null,
                fullContentEn: null,
                additionalKeyword: null,
                with_image: null,
                image: null,
                image_prompt: null
            }
            date = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1));
            mappedContentPlan.push(contentItem)
        }
        return mappedContentPlan
    }

}