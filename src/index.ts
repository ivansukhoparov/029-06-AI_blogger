import "reflect-metadata"
import {MongoDbAdapter} from "./app/adapters/mongodb.adapter";
import {container} from "./composition.root";
import {AppSettings} from "./settings/app.settings";


// export const aiBloggerDb = new db("mongodb://0.0.0.0:27017", "ai-blogger");

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

const db = container.resolve<MongoDbAdapter>(MongoDbAdapter)
db.init()

