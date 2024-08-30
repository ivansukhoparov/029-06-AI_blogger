import {Container} from "inversify";
import {AppSettings} from "./settings/app.settings";
import {ContentSettings} from "./settings/contentSettings";
import {MongoDbAdapter} from "./app/adapters/mongodb.adapter";
import {GptService} from "./app/gpt.service";
import {IGptService} from "./app/interfaces/gpt.servise.interface";
import {ContentRepository} from "./app/content.repository";
import {PromptsService} from "./app/prompts.service";
import {ContentService} from "./app/content.service";


export const container = new Container()

// Settings:
container.bind<AppSettings>(AppSettings).toSelf().inSingletonScope()
container.bind<ContentSettings>(ContentSettings).toSelf().inSingletonScope()

// Adapters:
container.bind<MongoDbAdapter>(MongoDbAdapter).toSelf().inSingletonScope()
container.bind<IGptService>(GptService).toSelf().inSingletonScope()

// Repositories:
container.bind<ContentRepository>(ContentRepository).toSelf().inSingletonScope()

// Services:
container.bind<PromptsService>(PromptsService).toSelf().inSingletonScope()

container.bind<ContentService>(ContentService).toSelf().inSingletonScope()