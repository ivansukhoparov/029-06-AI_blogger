import { inject, injectable } from 'inversify';
import { ICommand } from '../interface.command';
import { GptService } from '../../app/gpt.service';
import { IGptService } from '../../app/interfaces/gpt.servise.interface';
import { PromptsService } from '../../app/prompts.service';
import { ContentRepository } from '../../app/content.repository';
import { UpdatePostContentCommandParamType } from '../../app/common/common';

@injectable()
export class UpdatePostContentCommand implements ICommand {
  name = 'UpdatePostContentCommand';

  constructor(
    @inject(GptService) private gptService: IGptService,
    @inject(PromptsService) private promptService: PromptsService,
    @inject(ContentRepository) private contentRepository: ContentRepository,
  ) {}

  async execute(params: UpdatePostContentCommandParamType): Promise<boolean> {
    const contentPlanItem = await this.contentRepository.getContentPlanItem({ id: params.postId });
    const prompt = this.promptService.generatePostPrompt(contentPlanItem);
    const rawContent = await this.gptService.jsonRequest(prompt);
    const updateDto = this._createUpdateDto(rawContent);
    return await this.contentRepository.updateContentPlanItem(contentPlanItem.id, updateDto);
    //TODO add code that will be generate pictures
  }

  private _createUpdateDto(rawContent: any) {
    return {
      updatedAt: new Date().toISOString(),
      isGenerated: true,
      keywords: rawContent.keywords,
      shortDescription: rawContent.description,
      textContent: rawContent.content,
      additionalKeyword: null,
      withImage: rawContent.with_image,
      imagePrompt: rawContent.image_prompt,
    };
  }
}
