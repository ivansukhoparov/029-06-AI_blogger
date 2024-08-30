import {MongoDbAdapter} from "./adapters/mongodb.adapter";
import {Collection, ObjectId} from "mongodb";
import {inject, injectable} from "inversify";


@injectable()
export class ContentRepository {
    private content: Collection<any>

    constructor(@inject(MongoDbAdapter) private db: MongoDbAdapter) {
        this.content = this.db.connect.collection<any>("content")
    }

    async extendContentPlan(contentPlan: Array<any>) {
        try {
            await this.content.insertMany(contentPlan)
            return true
        } catch (err) {
            console.log(err)
            return false
        }

    }

    async getContentPlanItem(where: any) {
        try {
            const dbResponse = await this.content.findOne(where)
            return this._mapper(dbResponse)
        } catch (err) {
            console.log(err)
        }
    }

    async updateContentPlanItem(id: string, updateDto: any) {
        try {
            const isUpdated = await this.content.updateOne(
                {_id: new ObjectId(id)},
                {$set: updateDto},
            )
            return isUpdated.matchedCount === 1
        } catch (err) {
            console.log(err)
        }
    }

    _mapper(input: any) {
        const keys = Object.keys(input)
        return keys.reduce((acc: any, key: string) => {
            if (key === "_id") acc.id = input._id.toString()
            else acc[key] = input[key]
            return acc
        }, {})
    }
}