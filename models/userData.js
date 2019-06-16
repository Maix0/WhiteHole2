"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Mongoose = __importStar(require("mongoose"));
const userData = new Mongoose.Schema({
    _id: Mongoose.Schema.Types.ObjectId,
    guildID: String,
    userID: String,
    pointsModule: {
        level: Number,
        points: Number,
        lastMessage: Number
    }
});
module.exports = Mongoose.model("userData", userData);
