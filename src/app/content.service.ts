import {ContentItem, ContentItemType} from "./types/content";
import {PromptsService} from "./prompts.service";
import {ContentRepository} from "./content.repository";
import {IGptService} from "./interfaces/gpt.servise.interface";
import {inject, injectable} from "inversify";
import {GptService} from "./gpt.service";
import {SchedulerService} from "../scheduler/scheduler.service";
import {AppSettings} from "../settings/app.settings";
import {ContentPlanParamsType, FREQUENCIES, TIMEFRAMES} from "./common/common";

@injectable()
export class ContentService {

    constructor(@inject(GptService) private gptService: IGptService,
                @inject(PromptsService) private promptService: PromptsService,
                @inject(ContentRepository) private contentRepository: ContentRepository,
                @inject(SchedulerService) private schedulerService:SchedulerService,
                @inject(AppSettings) private appSettings: AppSettings) {
    }

// MOVED TO COMMAND
    // async createContentPlan(params: ContentPlanParamsType) {
    //     const timeframe = "week"
    //     const frequency = "daily"
    //     const prompt = this.promptService.generateContentPlanPrompt(params)
    //     const rawContentPlan = await this.gptService.jsonRequest(prompt)
    //     const contentPlanDto = this._contentPlanMapper(rawContentPlan.content_plan, params)
    //     const contentIds=  await this.contentRepository.extendContentPlan(contentPlanDto)
    // }

// MOVED TO COMMAND
//     async updatePostWithContent(publicationDate: string) {
//         const contentPlanItem = await this.contentRepository.getContentPlanItem({publicationDate})
//         const prompt = this.promptService.generatePostPrompt(contentPlanItem)
//         const content = await this.gptService.jsonRequest(prompt)
//         const updateDto = this._updateContentPlanItem(content)
//         return await this.contentRepository.updateContentPlanItem(contentPlanItem.id, updateDto)
//     }


    // async createAdditionalPost(publicationDate: string) {
    //     const postId = await this.contentRepository.addPost(this._post())
    //     if (postId) {
    //         const prompt = this.promptService.generateAdditionalPostPrompt()
    //         const content = await this.gptService.jsonRequest(prompt)
    //         const updateDto = this._updateContentPlanItem(content)
    //         await this.contentRepository.updateContentPlanItem(postId, updateDto)
    //         return content.content
    //     }
    // }

    // _updateContentPlanItem(rawContent: any) {
    //     return {
    //         updatedAt: new Date().toISOString(),
    //         isGenerated: true,
    //         keywords: rawContent.keywords,
    //         shortDescription: rawContent.description,
    //         shortContentRu: rawContent.content,
    //         additionalKeyword: null,
    //         with_image: rawContent.with_image,
    //         image_prompt: rawContent.image_prompt
    //     }
    // }
    //
    //
    // _contentPlanMapper(rawContentPlan: Array<any>, contentPlanParams:ContentPlanParamsType) {
    //     const startDate = contentPlanParams.startDate
    //     const dayOffset:number =  FREQUENCIES[contentPlanParams.frequency]
    //
    //     const contentPlan: Array<any> = rawContentPlan.length= TIMEFRAMES[contentPlanParams.timeframe]
    //     const mappedContentPlan: Array<any>  = []
    //     const year:number = Number(startDate.split("-")[0])
    //     const month:number = Number(startDate.split("-")[1]) - 1
    //     const day:number = Number(startDate.split("-")[2])
    //
    //     let date:Date = new Date(Date.UTC(year, month, day));
    //
    //     for (let item of contentPlan) {
    //         const contentItem: ContentItem = {
    //             createdAt: new Date().toISOString(),
    //             updatedAt: null,
    //             isPublicized: false,
    //             isGenerated: false,
    //             type: "main",
    //             publicationDate: date.toISOString().split("T")[0],
    //             topic: item.topic,
    //             title: item.title,
    //             outline: item.outline,
    //             keywords: item.keywords,
    //             contentType: item.content_type,
    //             shortDescription: null,
    //             shortContentRu: null,
    //             shortContentEn: null,
    //             fullContentRu: null,
    //             fullContentEn: null,
    //             additionalKeyword: null,
    //             withImage: null,
    //             image: null,
    //             imagePrompt: null
    //         }
    //         date = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + dayOffset));
    //         mappedContentPlan.push(contentItem)
    //     }
    //     return mappedContentPlan
    // }
    //
    // _post() {
    //
    //     let date = new Date();
    //
    //     const contentItem: ContentItemType = {
    //         createdAt: new Date().toISOString(),
    //         updatedAt: null,
    //         isPublicized: false,
    //         isGenerated: false,
    //         type: "main",
    //         publicationDate: date.toISOString().split("T")[0],
    //         topic: "item.topic",
    //         title: "item.title",
    //         outline: "item.outline",
    //         keywords: ["item.keywords"],
    //         contentType: "item.content_type",
    //         shortDescription: null,
    //         shortContentRu: null,
    //         shortContentEn: null,
    //         fullContentRu: null,
    //         fullContentEn: null,
    //         additionalKeyword: null,
    //         with_image: null,
    //         image: null,
    //         image_prompt: null
    //     }
    //
    //     return contentItem
    // }

}