import {injectable} from "inversify";

require("dotenv").config();


export const env = process.env

@injectable()
export class AppSettings {
    public readonly mode: string
    public readonly  mongoUri: string
    public readonly  mongoDbName: string
    public readonly  telegramApiKey: string
public readonly telegramChanelId:number
    public readonly postTime :string
    constructor() {
        this.mode = env.MODE ? env.MODE : APP_MODES.test
        this.mongoUri = env.MONGO_URI ? env.MONGO_URI : "mongodb://0.0.0.0:27017"
        this.mongoDbName = this.mode === "prod" ? "ai-blogger" : `ai-blogger_${this.mode}`
        this.telegramApiKey = env.TELEGRAM_API_KEY
        this.telegramChanelId = Number(env.TELEGRAM_CHANEL_ID)
        this.postTime = "09:00"
    }

}

type AppModes = "dev" | "prod" | "test"

export const APP_MODES = {
    development:"dev",
    production:"prod",
    test:"test"
}