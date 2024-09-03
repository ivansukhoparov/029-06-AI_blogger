import {MongoDbAdapter} from "./adapters/mongodb.adapter";
import {Collection, ObjectId} from "mongodb";
import {inject, injectable} from "inversify";
import {ContentItem} from "./types/content";


@injectable()
export class ContentRepository {
    private content: Collection<any>

    constructor(@inject(MongoDbAdapter) private db: MongoDbAdapter) {
        this.content = this.db.connect.collection<any>("content")
    }

    async extendContentPlan(contentPlan: Array<any>) {
        try {
            const isInserted = await this.content.insertMany(contentPlan)
            const ids = Object
                .values(isInserted.insertedIds)
                .map(el => {
                    return el.toString()
                })
            return ids
        } catch (err) {
            console.log(err)
            return null
        }
    }

    async addPost(post: any) {
        try {
            const addedPost = await this.content.insertOne(post)
            return addedPost.insertedId.toString()
        } catch (err) {
            console.log(err)
            return false
        }

    }

    async createContentItem(contentItem: ContentItem): Promise<string | null> {
        try {
            const createdItem = await this.content.insertOne(contentItem)
            if (!createdItem.insertedId) {
                return null
            }
            return createdItem.insertedId.toString()
        } catch (err) {
            console.log(err)
            return null
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