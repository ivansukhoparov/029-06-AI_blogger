import { inject, injectable } from 'inversify';
import { ICommand } from '../interface.command';
import { ContentRepository } from '../../app/content.repository';
import { PublicationPostCommandType, UpdatePostContentCommandParamType } from '../../app/common/common';
import { ContentItem } from '../../app/types/content';
import { TelegramService } from '../../app/telegram.service';
import { TelegramAdapter } from '../../app/adapters/telegram.adapter';

@injectable()
export class PublicationPostCommand implements ICommand {
  name = 'PublishPostCommand';

  constructor(
    @inject(ContentRepository) private contentRepository: ContentRepository,
    @inject(TelegramAdapter) private telegramAdapter: TelegramAdapter,
  ) {}

  async execute(params: PublicationPostCommandType): Promise<boolean> {
    const post: ContentItem = await this.contentRepository.getContentPlanItem({ id: params.postId });
    const textContent = post.textContent;
    await this.telegramAdapter.sendMessage(Number(params.target), textContent);
    return true;
  }
}
