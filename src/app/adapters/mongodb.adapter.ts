import {Db, MongoClient} from "mongodb";
import {inject, injectable} from "inversify";
import {AppSettings} from "../../settings/app.settings";
import {sleep} from "../../utils/sllep";


// export class db {
//     private client: MongoClient
//     private dataBase: Db
//
//     constructor(private mongoUri: string, private bdName: string) {
//
//     }
//
//     async run() {
//         this.client = new MongoClient(this.mongoUri)
//         try {
//             // Connect to server
//             await this.client.connect();
//             console.log("connect");
//             // Check connection
//             await this.client.db("admin").command({ping: 1});
//             console.log("Mongo server connection successful");
//             console.log("DB connected to " + this.mongoUri);
//             this.dataBase = this.client.db(this.bdName)
//             return true;
//         } catch {
//             await this.client.close();
//             console.log("Mongo server connection failed");
//             return false;
//         }
//     }
//
//     get db() {
//         return this.dataBase
//     }
//
// }

@injectable()
export class MongoDbAdapter {
    private client: MongoClient
    private dataBase: Db

    constructor(@inject(AppSettings) private appSettings: AppSettings) {
        this.client = new MongoClient(this.appSettings.mongoUri)
    }

    async init() {
        console.log("Connect to mongo server " + this.appSettings.mongoUri);
        let isSuccess = await this.run();
        while (!isSuccess) {
            console.log("Retry in 30 seconds");
            await sleep(30 * 1000)
            isSuccess = await this.run()
        }
    }

    async run() {
        try {
            // Connect to server
            await this.client.connect();
            // Check connection
            await this.client.db("admin").command({ping: 1});
            console.log("Mongo server connection successful");
            this.dataBase = this.client.db(this.appSettings.mongoDbName)
            return true;
        } catch {
            await this.client.close();
            console.log("Mongo server connection failed");
            return false;
        }
    }

    get connect() {
        return this.dataBase
    }

}
