import {ContentService} from "../../src/app/content.service";
import {GptServiceMock} from "./mock/gpt.service.mock";
import {ContentRepository} from "../../src/app/content.repository";
import {PromptsService} from "../../src/app/prompts.service";
import exp = require("constants");
import {db} from "../../src/app/adapters/mongodb.adapter";



let contentService:ContentService

describe("Content Service createContentPlan method", ()=>{

    beforeAll(async ()=>{
        const dbTests = new db("mongodb://0.0.0.0:27017", "ai-blogger-tests");
        await dbTests.run();
        console.log("DB started")
        await dbTests.db.dropDatabase()
        contentService = new ContentService(new GptServiceMock(), new PromptsService(), new ContentRepository(dbTests))
    })

    it ("+ The method createMonthContentPlan should return true", async ()=>{

        const isCreated = await contentService.createContentPlan("2024-09-02")
        expect(isCreated).toBeTruthy()
    })
})