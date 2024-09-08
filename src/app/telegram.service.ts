import { injectable } from 'inversify';

@injectable()
export class TelegramService {
  constructor() {}

  publicatePost(content: string) {
    return true;
  }
}
