import OpenAI from "openai";
import "dotenv"
import {config} from "dotenv";
import {rawContentPlanItemTestData} from "./gpt.responce.data.set";
import {writeDownToFile} from "../../../src/utils/fs";
import {IGptService} from "../../../src/app/interfaces/gpt.servise.interface";

config()

const openai = new OpenAI();

export class GptServiceMock implements  IGptService{
    constructor() {
    }
    async jsonRequest(promptMessage: any):Promise<any> {
        return rawContentPlanItemTestData
    }

    private _getRequestTypeFromPrompt(prompt: any): string {
        return "other"
    }

}
