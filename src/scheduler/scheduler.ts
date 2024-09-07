import {inject, injectable} from "inversify";
import {SchedulerRepository} from "./scheduler.repository";
import {TaskType} from "./types/tasks";
import {sleep} from "../utils/sleep";
import {TIME} from "../utils/times";
import {CommandBus} from "../command.bus/command.bus";
import {ICommand} from "../command.bus/interface.command";
import {TelegramAdapter} from "../app/adapters/telegram.adapter";

@injectable()
export class Scheduler {

    constructor(@inject(SchedulerRepository) private schedulerRepository: SchedulerRepository,
                @inject(TelegramAdapter) private telegramAdapter:TelegramAdapter,
                @inject(CommandBus) private commandBus: CommandBus) {
    }

    async start() {
console.log("Scheduler has been started")
        this.telegramAdapter.serviceMsg("Scheduler has been started")
        const isFirstRun = await this.firstRunCheck()
        if (isFirstRun){
            this.telegramAdapter.serviceMsg("There are no tasks in list. Content plan has been created")
        }else{
            this.telegramAdapter.serviceMsg("There are tasks in list.")
        }
        let isActive = true
        while (isActive) {
            // get the next nearest task from DB.
            const task: TaskType | null = await this.schedulerRepository.getNearestTask()

            if (task === null) {
                await sleep(TIME.day)
            } else {
                this.telegramAdapter.serviceMsg("task has been fount")
                // Calculate the time needed before executing the task.
                const currentTime: Date = new Date()
                const executionTime: Date = new Date(task.executionTime)
                const sleepTime: number = executionTime.getTime() - currentTime.getTime()
                this.telegramAdapter.serviceMsg("sleepTime " + sleepTime)
                // Wait if the execution time has not passed.
                if (sleepTime > 0) {
                    await sleep(sleepTime)
                }

                // Execute task and update task status
                try {
                    const isExecuted = await this.commandBus.command<ICommand>(task.commandName).execute(task.args)
                    if (isExecuted) {
                        await this.schedulerRepository.updateTaskStatus(task.id, "success")
                        this.telegramAdapter.serviceMsg("task has been success")
                    } else {
                        await this.schedulerRepository.updateTaskStatus(task.id, "failed")
                        this.telegramAdapter.serviceMsg("task has been failed")
                    }
                } catch (err) {
                    await this.schedulerRepository.updateTaskStatus(task.id, "failed")
                    this.telegramAdapter.serviceMsg("task has been failed")
                    console.log(err)
                }

            }
        }
    }

    async firstRunCheck(){
        const task: TaskType | null = await this.schedulerRepository.getNearestTask()
        if (task === null){
            const today = new Date()
            const dayOfWeek = today.getDay();
            const daysUntilMonday = (8 - dayOfWeek) % 7;
            const nextMonday = new Date(today);
            nextMonday.setDate(today.getDate() + daysUntilMonday);
            await this.commandBus.command("CreateContentPlanCommand").execute(
                {
                    startDate: nextMonday.toISOString().split("T")[0],
                    timeframe: "week",
                    frequency: "daily",
                }
            )
            return true
        }
        return false
    }
}