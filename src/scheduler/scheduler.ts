import {inject, injectable} from "inversify";
import {SchedulerRepository} from "./scheduler.repository";
import {TaskType} from "./types/tasks";
import {sleep} from "../utils/sleep";
import {TIME} from "../utils/times";
import {CommandBus} from "../command.bus/command.bus";
import {ICommand} from "../command.bus/interface.command";

@injectable()
export class Scheduler {

    constructor(@inject(SchedulerRepository) private schedulerRepository: SchedulerRepository,
                @inject(CommandBus) private commandBus: CommandBus) {
    }

    async start() {
        let isActive = true
        while (isActive) {
            // get the next nearest task from DB.
            const task: TaskType | null = await this.schedulerRepository.getNearestTask()

            if (task === null) {
                await sleep(TIME.day)
            } else {
                // Calculate the time needed before executing the task.
                const currentTime: Date = new Date()
                const executionTime: Date = new Date(task.executionTime)
                const sleepTime: number = executionTime.getTime() - currentTime.getTime()

                // Wait if the execution time has not passed.
                if (sleepTime > 0) {
                    await sleep(sleepTime)
                }

                // Execute task and update task status
                try {
                    const isExecuted = await this.commandBus.command<ICommand>(task.commandName).execute(task.args)
                    if (isExecuted) {
                        await this.schedulerRepository.updateTaskStatus(task.id, "success")
                    } else {
                        await this.schedulerRepository.updateTaskStatus(task.id, "failed")
                    }
                } catch (err) {
                    await this.schedulerRepository.updateTaskStatus(task.id, "failed")
                    console.log(err)
                }

            }
        }
    }

}