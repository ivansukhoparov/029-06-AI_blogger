import {inject, injectable} from "inversify";
import TelegramBot from "node-telegram-bot-api";
import {Stream} from "stream";
import {AppSettings} from "../../settings/app.settings";


@injectable()
export class TelegramAdapter {
    private readonly telegramBot: TelegramBot

    constructor(@inject(AppSettings) private appSettings: AppSettings) {
        this.telegramBot = new TelegramBot(appSettings.telegramApiKey, {polling: true});
    }

    get bot() {
        return this.telegramBot
    }

    async sendMessage(chatId: number, message: string) {
        try {
            await this.bot.sendMessage(chatId, message)
        } catch (err) {
            console.log(err)
        }
    }

    async sendPhoto(chatId: TelegramBot.ChatId,
                    photo: string | Stream | Buffer,
                    options?: TelegramBot.SendPhotoOptions,
                    //fileOptions?: TelegramBot.FileOptions
    ) {
        try {
            await this.bot.sendPhoto(chatId, photo, options)
        } catch (err) {
            console.log(err)
        }
    }
}