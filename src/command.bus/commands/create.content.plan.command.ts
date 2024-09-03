import {inject, injectable} from "inversify";
import {GptService} from "../../app/gpt.service";
import {IGptService} from "../../app/interfaces/gpt.servise.interface";
import {PromptsService} from "../../app/prompts.service";
import {ContentRepository} from "../../app/content.repository";
import {SchedulerService} from "../../scheduler/scheduler.service";
import {ContentItem} from "../../app/types/content";

import {ContentPlanParamsType, FREQUENCIES, TIMEFRAMES} from "../../app/common/frequency";
import {ICommand} from "../interface.command";

@injectable()
export class CreateContentPlanCommand implements ICommand {
    name = "CreateContentPlanCommand"

    constructor(@inject(GptService) private gptService: IGptService,
                @inject(PromptsService) private promptService: PromptsService,
                @inject(ContentRepository) private contentRepository: ContentRepository,
                @inject(SchedulerService) private schedulerService: SchedulerService) {
    }

    async execute(params: ContentPlanParamsType) {
        const prompt = this.promptService.generateContentPlanPrompt(params)
        const rawContentPlan = await this.gptService.jsonRequest(prompt)
        const contentAndScheduleTaskPromises =
            this._createContentAndScheduleTaskPromises(rawContentPlan.content_plan, params)
        try {
            await Promise.all(contentAndScheduleTaskPromises)
            return true
        } catch (err) {
            console.log(err)
            return false
        }
    }

    private _createContentAndScheduleTaskPromises(rawContentPlan: Array<any>, contentPlanParams: ContentPlanParamsType) {
        const startDate: string = contentPlanParams.startDate
        const dayOffset: number = FREQUENCIES[contentPlanParams.frequency]
        const contentAndScheduleTaskPromises: Array<Promise<boolean>> = []
        const [year, month, day] = [
            Number(startDate.split("-")[0]),
            Number(startDate.split("-")[1]) - 1,
            Number(startDate.split("-")[2])]

        let date: Date = new Date(Date.UTC(year, month, day));

        rawContentPlan.length = TIMEFRAMES[contentPlanParams.timeframe]

        for (let item of rawContentPlan) {
            contentAndScheduleTaskPromises.push(this._createContentAndScheduleTaskPromise(item, date))
            date = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + dayOffset));
        }
        return contentAndScheduleTaskPromises
    }

    private async _createContentAndScheduleTaskPromise(item: any, date: Date) {
        const contentItem: ContentItem = new ContentItem(item, date)
        const postId = await this.contentRepository.createContentItem(contentItem)

        if (postId === null) return false

        const publicationDate = new Date(date)
        publicationDate.setHours(publicationDate.getHours() + 9)

        return await this.schedulerService.createTask(
            "PublicPostCommand",
            publicationDate,
            {postId: postId}
        )
    }
}


