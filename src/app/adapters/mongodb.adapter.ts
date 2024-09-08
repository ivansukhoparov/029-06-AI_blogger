import { Db, MongoClient, WithId } from 'mongodb';
import { inject, injectable } from 'inversify';
import { AppSettings } from '../../settings/app.settings';
import { sleep } from '../../utils/sleep';
import { TIME } from '../../utils/times';

@injectable()
export class MongoDbAdapter {
  private client: MongoClient;
  private dataBase: Db;

  constructor(@inject(AppSettings) private appSettings: AppSettings) {
    this.client = new MongoClient(this.appSettings.mongoUri);
  }

  async init() {
    console.log('Connect to mongo server ' + this.appSettings.mongoUri);
    let isSuccess = await this.run();
    while (!isSuccess) {
      console.log('Retry in one minute');
      await sleep(TIME.minute);
      isSuccess = await this.run();
    }
  }

  async run() {
    try {
      // Connect to server
      await this.client.connect();
      // Check connection
      await this.client.db('admin').command({ ping: 1 });
      this.dataBase = this.client.db(this.appSettings.mongoDbName);
      console.log('Mongo server connection successful to: ' + this.appSettings.mongoUri + this.appSettings.mongoDbName);
      return true;
    } catch {
      await this.client.close();
      console.log('Mongo server connection failed');
      return false;
    }
  }

  get connect() {
    return this.dataBase;
  }

  mapper<T>(input: WithId<Omit<T, 'id'>>): T {
    const keys = Object.keys(input);
    return keys.reduce((acc: any, key: string) => {
      if (key === '_id') acc.id = input._id.toString();
      else acc[key] = input[key];
      return acc;
    }, {});
  }
}
