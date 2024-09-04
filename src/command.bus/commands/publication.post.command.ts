import {inject, injectable} from "inversify";
import {ICommand} from "../interface.command";
import {ContentRepository} from "../../app/content.repository";
import {UpdatePostContentCommandParamType} from "../../app/common/common";
import {ContentItem} from "../../app/types/content";
import {TelegramService} from "../../app/telegram.service";


@injectable()
export class PublicationPostCommand implements ICommand {
    name = "PublicationPostCommand"

    constructor(@inject(ContentRepository) private contentRepository: ContentRepository,
                @inject(TelegramService) private telegramService:TelegramService
                ) {
    }

    async execute(params: UpdatePostContentCommandParamType): Promise<boolean> {
        const post:ContentItem = await this.contentRepository.getContentPlanItem({id:params.postId})
        const textContent = post.textContent
        const isSent = await this.telegramService.publicatePost(textContent)
        return isSent
    }

}