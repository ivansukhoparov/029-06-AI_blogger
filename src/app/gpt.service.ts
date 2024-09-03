import OpenAI from "openai";
import {writeDownToFile} from "../utils/fs";
import {IGptService} from "./interfaces/gpt.servise.interface";
import {injectable} from "inversify";


@injectable()
export class GptService implements IGptService {
    private openai:OpenAI
    constructor() {
        this.openai = new OpenAI();
    }

    async jsonRequest(promptMessage: any): Promise<any> {
        try {
            const time = new Date().toISOString().replaceAll(":", ".")

            const requestType = this._getRequestTypeFromPrompt(promptMessage)
            writeDownToFile(promptMessage, `${time}--1-${requestType}_request.json`)

            const response = await this.openai.chat.completions.create({
                model: "gpt-4o",
                messages: promptMessage
            });
            writeDownToFile(response, `${time}--2-${requestType}_response.json`)

            const rawString = response.choices[0].message.content
            let jsonString: string
            let json: any

            try {
                jsonString = rawString
                    .replace(/```json\n|```/g, '')

                json = JSON.parse(jsonString)
            } catch {
                jsonString = rawString
                    .replace(/```json\n|```/g, '')
                    .replace(/[\n\r\t]/g, '')

                json = JSON.parse(jsonString)
            }

            writeDownToFile(json, `${time}--3-${requestType}_parsed_response.json`)

            return json;
        } catch (err) {
            console.log(err)
        }
    }

    private _getRequestTypeFromPrompt(prompt: any): string {
        let requestType = JSON.stringify(prompt).split(`\\"request_type\\":`)[1].split(`\\"`)[1]
        if (requestType === "get_content_plan" || requestType === "generate_post") {
            return requestType
        } else {
            return "other"
        }
    }
}




















