import mongooseServices from "../../../common/services/mongoose.services";
import shortid from "shortid";
import debug from "debug";
import { CreateUserDto } from "../dto/create.user.dto";
import { PatchUserDto } from "../dto/patch.user.dto";
import { PutUserDto } from "../dto/put.user.dto";
const log: debug.IDebugger = debug("app:users-dao");
class UsersDao {
  Schema = mongooseServices.getMongoose().Schema;
  userSchema = new this.Schema({
    _id: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: String, required: true, default: 2 },
  });
  User = mongooseServices.getMongoose().model("Users", this.userSchema);
  constructor() {
    log("Created new instance of UsersDao");
  }
  async addUser(userFields: CreateUserDto) {
    const userId = shortid.generate();
    const user = new this.User({
      _id: userId,
      isAdmin: 2,
      ...userFields,
    });
    await user.save();
    return userId;
  }
  async getUserByUsername(username: string) {
    return this.User.findOne({ username: username }).exec();
  }
  async getUserByUsernameWithPassword(username: string) {
    const user = await this.User.findOne({ username: username }).exec();
    if (!user) return null;
    return user;
  }
  async removeUserById(userId: string) {
    return this.User.deleteOne({ _id: userId }).exec();
    // return userId;
  }

  async getUserById(userId: string) {
    return this.User.findOne({ _id: userId }).populate("username").exec();
  }
  async getUsers(limit: number = 25, page: number = 0) {
    const totalUser = (await this.User.find()).length;
    const totalPage = totalUser / limit;
    const skip = limit * (page - 1) < 0 ? 0 : limit * (page - 1);

    return {
      meta: {
        totalCount: totalUser,
        totalPage: Math.ceil(totalPage),
      },
      data: await this.User.find().limit(limit).skip(skip).exec(),
    };
  }
  async updateUserById(userId: string, userFields: PatchUserDto | PutUserDto) {
    const existingUser = await this.User.findOneAndUpdate(
      { _id: userId },
      { $set: userFields },
      { new: true }
    ).exec();
    return existingUser;
  }
}
export default new UsersDao();
