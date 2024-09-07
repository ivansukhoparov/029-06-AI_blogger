import "reflect-metadata"
import {MongoDbAdapter} from "./app/adapters/mongodb.adapter";
import {container} from "./composition.root";
import {AppSettings} from "./settings/app.settings";
import {Scheduler} from "./scheduler/scheduler";
import {GptService} from "./app/gpt.service";


// export const aiBloggerDb = container.resolve<MongoDbAdapter>(MongoDbAdapter)

// const s = async () => {
//     await aiBloggerDb.run();
//     console.log("DB started")
//      const contentService = new ContentService(new GptService(), new PromptsService(), new ContentRepository(aiBloggerDb))
//     console.log("ContentService started")
//      const isCreated = await contentService.createContentPlan("2024-08-29")
//      console.log("result", isCreated)
// }
// const s = async () => {
//     await aiBloggerDb.run();
//     console.log("DB started")
//      const contentService = new ContentService(new GptService(), new PromptsService(), new ContentRepository(aiBloggerDb))
//     console.log("ContentService started")
//      const isCreated = await contentService.updatePostWithContent("2024-09-03")
//      console.log("result", isCreated)
// }
//  s()

const set = container.resolve(AppSettings)
console.log(set)
// export const global = container.resolve<ContentSettings>(ContentSettings);
// const db = container.resolve<MongoDbAdapter>(MongoDbAdapter)
// db.init()

// const s = async () => {
//     const aiBloggerDb = container.resolve<MongoDbAdapter>(MongoDbAdapter)
//     await aiBloggerDb.init();
//     console.log("DB started")
//     const scheduler = container.resolve<Scheduler>(Scheduler)
//     scheduler.start()
// }
// s()

const tets = async () => {
    const gpt = container.resolve<GptService>(GptService)
    const gptConnection = await gpt.test()

}

const start = async () => {
    const gpt = container.resolve<GptService>(GptService)
    const gptConnection = await gpt.test()
    if (gptConnection === false) return
    const aiBloggerDb = container.resolve<MongoDbAdapter>(MongoDbAdapter)
    await aiBloggerDb.init();
    console.log("DB started")
    const scheduler = container.resolve<Scheduler>(Scheduler)
    scheduler.start()
}

start()