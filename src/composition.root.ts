import {Container} from "inversify";
import {AppSettings} from "./settings/app.settings";
import {ContentSettings} from "./settings/content.settings";
import {MongoDbAdapter} from "./app/adapters/mongodb.adapter";
import {GptService} from "./app/gpt.service";
import {IGptService} from "./app/interfaces/gpt.servise.interface";
import {ContentRepository} from "./app/content.repository";
import {PromptsService} from "./app/prompts.service";
import {ContentService} from "./app/content.service";
import {SchedulerRepository} from "./scheduler/scheduler.repository";
import {SchedulerService} from "./scheduler/scheduler.service";
import {ICommand} from "./command.bus/interface.command";
import {CommandBus} from "./command.bus/command.bus";
import {Scheduler} from "./scheduler/scheduler";
import {TelegramAdapter} from "./app/adapters/telegram.adapter";
import {CreateContentPlanCommand} from "./command.bus/commands/create.content.plan.command";
import {PublicationPostCommand} from "./command.bus/commands/publication.post.command";
import {UpdatePostContentCommand} from "./command.bus/commands/update.post.content.command";


export const container = new Container()

// Settings:
container.bind<AppSettings>(AppSettings).toSelf().inSingletonScope()
container.bind<ContentSettings>(ContentSettings).toSelf().inSingletonScope()

// Adapters:
container.bind<MongoDbAdapter>(MongoDbAdapter).toSelf().inSingletonScope()
container.bind<IGptService>(GptService).toSelf().inSingletonScope()
container.bind<TelegramAdapter>(TelegramAdapter).toSelf().inSingletonScope()

// Repositories:
container.bind<ContentRepository>(ContentRepository).toSelf().inSingletonScope()
container.bind<SchedulerRepository>(SchedulerRepository).toSelf().inSingletonScope()

// Services:
container.bind<PromptsService>(PromptsService).toSelf().inSingletonScope()
container.bind<SchedulerService>(SchedulerService).toSelf().inSingletonScope()

// COMMANDS:CreateContentPlanCommand
container.bind<ICommand>("ICommand").to(CreateContentPlanCommand).inSingletonScope()
container.bind<ICommand>("ICommand").to(PublicationPostCommand).inSingletonScope()
container.bind<ICommand>("ICommand").to(UpdatePostContentCommand).inSingletonScope()
// The command bus binding after all commands have been bound.
container.bind(CommandBus).to(CommandBus).inSingletonScope()

container.bind<ContentService>(ContentService).toSelf().inSingletonScope()
container.bind<Scheduler>(Scheduler).toSelf().inSingletonScope()