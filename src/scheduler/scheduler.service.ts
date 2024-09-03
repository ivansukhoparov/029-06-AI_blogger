import {inject, injectable} from "inversify";
import {TaskBaseType} from "./types/tasks";
import {SchedulerRepository} from "./scheduler.repository";


@injectable()
export class SchedulerService {
    constructor(@inject(SchedulerRepository) private scheduleRepository: SchedulerRepository) {
    }


    async createTask(command: string, time: Date, args: any) {
        const createTaskDto: TaskBaseType = {
            commandName: command,
            executionTime: time.toISOString(),
            args: args,
            status: "pending",
        }
        return await this.scheduleRepository.createTask(createTaskDto)

    }


}