import {injectable} from "inversify";
import {TaskBaseType} from "./types/tasks";


@injectable()
export class SchedulerService{
    constructor() {
    }

    async createTask(command:string, time:Date, args:any){
        const createTaskDto:TaskBaseType ={
            commandName:command,
            executionTime:time.toISOString(),
            args:args,
            status:"pending",
        }
    }


}