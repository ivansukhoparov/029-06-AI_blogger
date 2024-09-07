import "reflect-metadata"

import {container} from "../src/composition.root";
import {GptService} from "../src/app/gpt.service";
import {GptServiceMock} from "../src/app/mock/gpt.service.mock";
import {IGptService} from "../src/app/interfaces/gpt.servise.interface";
import {ContentService} from "../src/app/content.service";
import {MongoDbAdapter} from "../src/app/adapters/mongodb.adapter";
import {env} from "../src/settings/app.settings";
import {CreateContentPlanCommand} from "../src/command.bus/commands/create.content.plan.command";
import {ICommand} from "../src/command.bus/interface.command";
import {TaskType} from "../src/scheduler/types/tasks";
import {SchedulerRepository} from "../src/scheduler/scheduler.repository";
import {UpdatePostContentCommand} from "../src/command.bus/commands/update.post.content.command";
require("dotenv").config();
env.MODE="test"
let createContentPlanCommand:ICommand
let updatePostContentCommand:UpdatePostContentCommand
let schedulerRepository:SchedulerRepository
describe("Content Service createContentPlan method", () => {

    beforeAll(async () => {
        const aiBloggerDb = container.resolve<MongoDbAdapter>(MongoDbAdapter)
        await aiBloggerDb.run();
        await aiBloggerDb.connect.dropDatabase()
        container.rebind<IGptService>(GptService).to(GptServiceMock).inSingletonScope()
        schedulerRepository = container.resolve<SchedulerRepository>(SchedulerRepository)
        createContentPlanCommand = container.resolve<ICommand>(CreateContentPlanCommand)
        updatePostContentCommand = container.resolve<UpdatePostContentCommand>(UpdatePostContentCommand)

    //    const commandBus = container.resolve<CommandBus>(CommandBus)
    })

    it("testing test ", async () => {
console.log(createContentPlanCommand)
        await createContentPlanCommand.execute({
            startDate: "2024-09-01",
            timeframe: "week",
            frequency: "daily",
        })
        expect(true).toBeTruthy()
    })

    // it("testing test ", async () => {
    //     let task: TaskType  = await schedulerRepository.getNearestTask()
    //     await updatePostContentCommand.execute({postId:task.args.postId,  targetPlatform:"telegram"})
    //     //  task  = await schedulerRepository.getNearestTask()
    //     // await updatePostContentCommand.execute({postId:task.args.postId,  targetPlatform:"telegram"})
    //     // task  =  await schedulerRepository.getNearestTask()
    //     // await updatePostContentCommand.execute({postId:task.args.postId,  targetPlatform:"telegram"})
    //     // task  =  await schedulerRepository.getNearestTask()
    //     // await updatePostContentCommand.execute({postId:task.args.postId,  targetPlatform:"telegram"})
    //     // task  =  await schedulerRepository.getNearestTask()
    //     // await updatePostContentCommand.execute({postId:task.args.postId,  targetPlatform:"telegram"})
    //     // task  =  await schedulerRepository.getNearestTask()
    //     // await updatePostContentCommand.execute({postId:task.args.postId,  targetPlatform:"telegram"})
    //     // task  =  await schedulerRepository.getNearestTask()
    //     // await updatePostContentCommand.execute({postId:task.args.postId,  targetPlatform:"telegram"})
    //     expect(true).toBeTruthy()
    // })
})