import * as Mongoose from "mongoose";

const RankSchema = new Mongoose.Schema({
    _id: Mongoose.Schema.Types.ObjectId,
    guildID: String,
    roleID: String,
    points: Number
})

module.exports = Mongoose.model("rank", RankSchema)