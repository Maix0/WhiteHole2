import * as Mongoose from "mongoose";

const permissionSchema = new Mongoose.Schema({
    _id: Mongoose.Schema.Types.ObjectId,
    guildID: String,
    userID: String,
    permission: Number
})

module.exports = Mongoose.model("permission", permissionSchema)