import * as Mongoose from "mongoose";

const userData = new Mongoose.Schema({
    _id: Mongoose.Schema.Types.ObjectId,
    guildID: String,
    userID: String,
    pointsModule: {
        level: Number,
        points: Number,
        lastMessage: Number
    }
})

module.exports = Mongoose.model("userData", userData)