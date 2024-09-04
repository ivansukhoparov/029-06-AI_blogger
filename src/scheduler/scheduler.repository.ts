import {WithId, Collection, InsertOneResult,UpdateResult, ObjectId} from "mongodb";
import {inject, injectable} from "inversify";
import {MongoDbAdapter} from "../app/adapters/mongodb.adapter";
import {TaskBaseType, TaskCreateDto, TaskStatus, TaskType} from "./types/tasks";




@injectable()
export class SchedulerRepository {
    private schedule: Collection<any>

    constructor(@inject(MongoDbAdapter) private dbAdapter: MongoDbAdapter) {
        this.schedule = this.dbAdapter.connect.collection<TaskBaseType>("schedule")
    }

    async getPendingTasksCount():Promise<number|null>{
        try{
            return await this.schedule.countDocuments({status:"pending"})
        }catch (err){
            console.log(err)
            return null
        }
    }

    async createTask (taskDto:TaskCreateDto):Promise<boolean>{
        try {
            const task:InsertOneResult<TaskCreateDto> = await this.schedule.insertOne(taskDto)
            return !!task.insertedId;
        }catch (err){
            console.log(err)
            return false
        }
    }

    async updateTaskStatus(id:string, status:TaskStatus):Promise<boolean>{
        try {
            const isUpdated:UpdateResult<TaskBaseType> = await this.schedule.updateOne(
                {_id:new ObjectId(id)},
                {$set:{status:status}})
            return !!isUpdated.matchedCount
        }catch (err) {
            console.log(err)
            return false
        }
    }

    async getNearestTask():Promise<TaskType|null> {
        try {
            const tasks:Array<WithId<TaskBaseType>> = await this.schedule
                .find({status: "pending"})
                .sort("executionTime", -1)
                .limit(1)
                .toArray()

            if (tasks.length > 0) {
                return this.dbAdapter.mapper<TaskType>(tasks[0])
            } else {
                return null
            }
        } catch (err) {
            console.log(err)
            return null
        }
    }
}