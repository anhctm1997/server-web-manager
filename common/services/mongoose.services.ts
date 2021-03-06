import mongoose from "mongoose";
import { key } from "../../configs/constant/key";
import debug from "debug";
const log: debug.IDebugger = debug("app:mongoose-service");
class MongooseServices {
  private count = 0;
  private mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
  };
  constructor() {
    this.connectWithRetry();
  }

  getMongoose() {
    return mongoose;
  }
  connectWithRetry = async () => {
    try {
      await mongoose.connect(key.uri, this.mongooseOptions);
      console.log("MongoDB is connected");
    } catch (err) {
      const retrySeconds = 5;
      console.log(
        `MongoDB connection unsuccessful (will retry #${++this
          .count} after ${retrySeconds} seconds):`,
        err
      );
      setTimeout(this.connectWithRetry, retrySeconds * 1000);
    }
  };
}

export default new MongooseServices();
