import { ContentItem, ContentItemType } from './types/content';
import { inject, injectable } from 'inversify';
import { ContentSettings } from '../settings/content.settings';

import { ContentPlanParamsType } from './common/common';

@injectable()
export class PromptsService {
  constructor(@inject(ContentSettings) private contentSettings: ContentSettings) {}

  generateContentPlanPrompt(contentPlanParams: ContentPlanParamsType) {
    const promptSchema = this.generateContentPlanSchema(contentPlanParams.timeframe, contentPlanParams.frequency);
    return [
      {
        role: 'system',
        content: 'You are an AI content strategist.',
      },
      {
        role: 'user',
        content: `Generate a content plan for the blog with the theme: ${promptSchema.blog_theme}.`,
      },
      {
        role: 'user',
        content: "Please return only the 'content_plan' as a JSON object.",
      },
      {
        role: 'user',
        content: JSON.stringify(promptSchema),
      },
    ];
  }

  generatePostPrompt(contentItem: ContentItem) {
    const promptSchema = this.generatePostSchema(contentItem);
    return [
      { role: 'system', content: 'You are an AI blogger, tasked with generating complete blog post.' },
      {
        role: 'user',
        content: `Generate a complete blog post on the following details::\n
                         ${JSON.stringify(promptSchema)}\n
                         Provide the full text of the post directly.\n
                         write everything in the first person, remembering that you are an artificial intelligence.\n
                         write in Russian.\n
                         Fields  "keywords","description","image_prompt" write in English\n
                         Also, generate short description about 50-100 word length("short_description" field in response).\n
                         Feel free to modify or add keywords as necessary.\n
                         Decide whether an image is needed("with_image" field in response), and if so, include a prompt for the image("image_prompt" field in response) .
                         Make sure to mention the news sources and provide hyperlinks to them in the text. Format the content for publication in Telegram, using only HTML tags that are supported by Telegram.
                        `,
      },
      // {
      //     role: "user",
      //     content: JSON.stringify({
      //         temperature: 0.7,
      //         top_p: 1,
      //         frequency_penalty: 0.2,
      //         presence_penalty: 0.1
      //     }
      //     )
      // }
    ];
  }

  generateAdditionalPostPrompt() {
    const promptSchema = this.generateAdditionalPostSchema();
    console.log(promptSchema);
    return [
      { role: 'system', content: 'You are an AI blogger, tasked with generating complete blog post.' },
      {
        role: 'user',
        content: `
                Find recent news related to the philosophy of consciousness, artificial intelligence, technology, or their impact on humanity over the past few days. 
                Analyze these news items and write a post in line with the theme and strategy of the blog. 
                Include a brief analysis of the news, your own reflections, and suggest some conclusionsGenerate a complete blog post on the following details::\n
                         ${JSON.stringify(promptSchema)}\n
                         Provide the full text of the post directly.
                         write everything in the first person, remembering that you are an artificial intelligence.
                         write in Russian.
                         Fields  "keywords","description","image_prompt" write in English
                         Also, generate short description about 50-100 word length("description" field in response).
                         Feel free to modify or add keywords as necessary.
                         Decide whether an image is needed("with_image" field in response), and if so, include a prompt for the image("image_prompt" field in response) .
                        Make sure to mention the news sources and provide hyperlinks to them in the text. Format the content for publication in Telegram, using only HTML tags that are supported by Telegram.
`,
      },
      {
        role: 'user',
        content: JSON.stringify({
          temperature: 0.7,
          top_p: 1,
          frequency_penalty: 0.2,
          presence_penalty: 0.1,
        }),
      },
    ];
  }

  generateContentPlanSchema(timeframe: string, frequency: string) {
    return {
      request_type: 'get_content_plan',
      timeframe: timeframe,
      blog_theme: this.contentSettings.blogTheme,
      main_topics: this.contentSettings.topics.main,
      additional_topics: this.contentSettings.topics.additional,
      content_types: this.contentSettings.contentType,
      post_frequency: frequency,
      preferred_days: this.contentSettings.preferredDays,
      post_length: this.contentSettings.postLength,
      language: 'ru',
      keywords: this.contentSettings.keywords,
      response_format: this.contentSettings.contentPlanResponseFormat,
      writing_style: {
        tone: 'adaptive',
      },
      persona: this.contentSettings.writingStyle.persona,
      flexibility: this.contentSettings.contentPlanFlexibility,
      content_uniqueness: 'high',
    };
  }

  generatePostSchema(contentItem: ContentItem) {
    return {
      request_type: 'generate_post',
      blog_theme: this.contentSettings.blogTheme,
      topic: contentItem.topic,
      title: contentItem.title,
      outline: contentItem.outline,
      keywords: contentItem.keywords,
      language: 'ru',
      format: this.contentSettings.postFormat,
      writing_style: this.contentSettings.writingStyle,
      response_format: this.contentSettings.postResponseFormat,
      post_length: this.contentSettings.postLength,
    };
  }

  generateAdditionalPostSchema() {
    return {
      request_type: 'generate_post',
      blog_theme: this.contentSettings.blogTheme,
      language: 'ru',
      format: this.contentSettings.postFormat,
      writing_style: 'HTML', // this.contentSettings.writingStyle,
      response_format: this.contentSettings.postResponseFormat,
      post_length: this.contentSettings.postLength,
    };
  }
}
