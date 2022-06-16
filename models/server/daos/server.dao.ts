import mongooseServices from "../../../common/services/mongoose.services";
import shortid from "shortid";
import debug from "debug";
import { CreateServerDto } from "../dto/create.server.dto";
import { PutServerDto } from "../dto/put.server.dto";
import { PatchServerDto } from "../dto/patch.server.dto";
const log: debug.IDebugger = debug("app:servers-dao");
class ServersDao {
  Schema = mongooseServices.getMongoose().Schema;
  serverSchema = new this.Schema({
    name: {
      type: String,
      require: true,
    },

    password: {
      type: String,
      require: true,
    },
    ip: {
      type: String,
      require: true,
    },
    status: {
      type: String,
      require: true,
      default: "on",
    },
    cpu: {
      type: String,
      require: true,
    },
    ram: {
      type: Number,
      require: true,
      default: 1,
    },
    http: {
      type: Boolean,
      require: true,
      default: true,
    },
    https: {
      type: Boolean,
      require: true,
      default: true,
    },
  });
  Server = mongooseServices.getMongoose().model("Servers", this.serverSchema);
  constructor() {
    log("Created new instance of ServersDao");
  }
  async addServer(serverFields: CreateServerDto) {
    const serverId = shortid.generate();
    const server = new this.Server({
      _id: serverId,
      ...serverFields,
    });
    await server.save();
    return serverId;
  }
  async getServerByServerName(name: string) {
    return this.Server.findOne({ name: name }).exec();
  }
  async getServerByIdWithPassword(serverid: string) {
    return this.Server.findOne({ _id: serverid })
      .select("_id servername permissions +password")
      .exec();
  }
  async removeServerById(serverId: string) {
    return this.Server.deleteOne({ _id: serverId }).exec();
    // return serverId;
  }
  async getServerById(serverId: string) {
    return this.Server.findOne({ _id: serverId }).populate("server").exec();
  }
  async getServers(limit = 25, page = 0) {
    return this.Server.find()
      .limit(limit)
      .skip(limit * page)
      .exec();
  }
  async updateServerById(
    serverId: string,
    serverFields: PatchServerDto | PutServerDto
  ) {
    const existingServer = await this.Server.findOneAndUpdate(
      { _id: serverId },
      { $set: serverFields },
      { new: true }
    ).exec();
    return existingServer;
  }
}
export default new ServersDao();
