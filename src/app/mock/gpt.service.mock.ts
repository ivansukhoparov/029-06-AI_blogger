import OpenAI from 'openai';
import 'dotenv';
import { config } from 'dotenv';
import { jsonContentPlanItemTestData, jsonPostContentTestData } from './gpt.responce.data.set';
import { writeDownToFile } from '../../utils/fs';
import { IGptService } from '../interfaces/gpt.servise.interface';
import { injectable } from 'inversify';

config();

const openai = new OpenAI();

@injectable()
export class GptServiceMock implements IGptService {
  constructor() {}
  async jsonRequest(promptMessage: any): Promise<any> {
    const requestType = this._getRequestTypeFromPrompt(promptMessage);
    if (requestType === 'get_content_plan') {
      return jsonContentPlanItemTestData;
    } else if (requestType === 'generate_post') {
      return jsonPostContentTestData;
    } else {
      return null;
    }
  }

  private _getRequestTypeFromPrompt(prompt: any): string {
    let requestType = JSON.stringify(prompt).split(`\\"request_type\\":`)[1].split(`\\"`)[1];
    if (requestType === 'get_content_plan' || requestType === 'generate_post') {
      return requestType;
    } else {
      return 'other';
    }
  }
}
