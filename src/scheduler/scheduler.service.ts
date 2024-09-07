import {inject, injectable} from "inversify";
import {TaskBaseType} from "./types/tasks";
import {SchedulerRepository} from "./scheduler.repository";

export type SetTaskTimeParamType = {
    date: Date,
    hours?: number
    minutes?: number
}

@injectable()
export class SchedulerService {
    constructor(@inject(SchedulerRepository) private scheduleRepository: SchedulerRepository) {
    }

    async createTask(command: string, time: SetTaskTimeParamType, args: any, description: string) {
        const createTaskDto: TaskBaseType = {
            commandName: command,
            executionTime: this._setTaskTime(time).toISOString(),
            args: args,
            status: "pending",
            description: description
        }
        return await this.scheduleRepository.createTask(createTaskDto)
    }

    private _setTaskTime(params: SetTaskTimeParamType) {
        const newDate = new Date(params.date)
        if (params.hours) {
            newDate.setHours(newDate.getHours() + params.hours)
        }
        if (params.minutes) {
            newDate.setMinutes(newDate.getMinutes() + params.minutes)
        }
        return newDate
    }
}