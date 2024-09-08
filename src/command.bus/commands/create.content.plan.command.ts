import { inject, injectable } from 'inversify';
import { GptService } from '../../app/gpt.service';
import { IGptService } from '../../app/interfaces/gpt.servise.interface';
import { PromptsService } from '../../app/prompts.service';
import { ContentRepository } from '../../app/content.repository';
import { SchedulerService } from '../../scheduler/scheduler.service';
import { ContentItem } from '../../app/types/content';

import { ContentPlanParamsType, FREQUENCIES, TIMEFRAMES } from '../../app/common/common';
import { ICommand } from '../interface.command';
import { AppSettings } from '../../settings/app.settings';

@injectable()
export class CreateContentPlanCommand implements ICommand {
  public readonly name = 'CreateContentPlanCommand';

  constructor(
    @inject(AppSettings) private appSettings: AppSettings,
    @inject(GptService) private gptService: IGptService,
    @inject(PromptsService) private promptService: PromptsService,
    @inject(ContentRepository) private contentRepository: ContentRepository,
    @inject(SchedulerService) private schedulerService: SchedulerService,
  ) {}

  async execute(params: ContentPlanParamsType): Promise<boolean> {
    const prompt = this.promptService.generateContentPlanPrompt(params);
    const rawContentPlan = await this.gptService.jsonRequest(prompt);
    const contentAndScheduleTaskPromises = this._createContentAndScheduleTaskPromises(
      rawContentPlan.content_plan,
      params,
    );
    try {
      await Promise.all(contentAndScheduleTaskPromises);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  private _createContentAndScheduleTaskPromises(rawContentPlan: Array<any>, contentPlanParams: ContentPlanParamsType) {
    const startDate: string = contentPlanParams.startDate;
    const dayOffset: number = FREQUENCIES[contentPlanParams.frequency];
    const contentAndScheduleTaskPromises: Array<Promise<boolean>> = [];
    const [year, month, day] = [
      Number(startDate.split('-')[0]),
      Number(startDate.split('-')[1]) - 1,
      Number(startDate.split('-')[2]),
    ];

    let date: Date = new Date(Date.UTC(year, month, day));

    rawContentPlan.length = TIMEFRAMES[contentPlanParams.timeframe];

    for (let item of rawContentPlan) {
      contentAndScheduleTaskPromises.push(this._createContentAndScheduleTaskPromise(item, date));
      date = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + dayOffset));
    }
    const nextContentPlanSchedule = this.schedulerService.createTask(
      'CreateContentPlanCommand',
      {
        date: new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() - 1)),
        hours: 16,
        minutes: 0,
      },
      {
        startDate: new Date(Date.UTC(year, month, day)).toISOString().split('T')[0],
        timeframe: 'week',
        frequency: 'daily',
      },
      'content_plan_generate',
    );
    contentAndScheduleTaskPromises.push(nextContentPlanSchedule);
    return contentAndScheduleTaskPromises;
  }

  private async _createContentAndScheduleTaskPromise(item: any, date: Date) {
    const contentItem: ContentItem = new ContentItem(item, date);
    const postId = await this.contentRepository.createContentItem(contentItem);

    if (postId === null) return false;

    const publicationDate = new Date(date);
    publicationDate.setHours(publicationDate.getHours() + 9);

    const isGenerateTask = await this.schedulerService.createTask(
      'UpdatePostContentCommand',
      {
        date: date,
        hours: 0,
        minutes: 0,
      },
      { postId: postId },
      'content_generate',
    );

    const isPreviewSendTask = await this.schedulerService.createTask(
      'PublishPostCommand',
      {
        date: date,
        hours: 0,
        minutes: 5,
      },
      {
        postId: postId,
        platform: 'telegram',
        target: 420114791,
      },
      'content_preview',
    );

    const isPostTask = await this.schedulerService.createTask(
      'PublishPostCommand',
      {
        date: date,
        hours: 9,
        minutes: 0,
      },
      {
        postId: postId,
        platform: 'telegram',
        target: this.appSettings.telegramChanelId,
      },
      'content_publish',
    );

    return isPostTask && isGenerateTask && isPreviewSendTask;
  }
}
