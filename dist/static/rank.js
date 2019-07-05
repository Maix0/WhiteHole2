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
const Schemas = {
    Rank: require("../models/rank")
};
module.exports = {
    //querry
    async getRolebyIDs(guildId, roleID) {
        let querry = await Schemas.Rank.findOne({
            guildID: guildId,
            roleID: roleID
        }).exec();
        return querry;
    },
    async getRoleByUID(uID) {
        let querry = await Schemas.Rank.findOne({
            _id: uID
        }).exec();
        return querry;
    },
    async GetRolesOrdered(guildID) {
        let roles = await Schemas.Rank.find({
            guildID: guildID
        })
            .sort({
            points: "asc"
        })
            .exec();
        return roles;
    },
    //create
    createRole(guildID, roleID, points) {
        let rank = Schemas.Rank({
            _id: Mongoose.Types.ObjectId(),
            guildID: guildID,
            roleID: roleID,
            points: points
        });
        rank.save();
        return rank;
    },
    //private
    //update
    updateOneFromIDs(guildID, roleID, points) {
        Schemas.Rank.findOneAndUpdate({
            guildID: guildID,
            roleID: roleID
        }, {
            points: points
        }).exec();
    }
};
