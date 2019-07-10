import {
    Ranks
} from "../types";
import * as Mongoose from "mongoose"
const Schemas = {
    Rank: require("../models/rank")
}


//querry
export async function getRolebyIDs(guildId: string, roleID: string): Promise < void | Ranks > {
    let querry = await Schemas.Rank.findOne({
        guildID: guildId,
        roleID: roleID
    }).exec()
    return querry
}
export async function getRoleByUID(uID: any) {
    let querry = await Schemas.Rank.findOne({
        _id: uID
    }).exec()
    return querry
}
export async function GetRolesOrdered(guildID: string) {
    let roles = await Schemas.Rank.find({
            guildID: guildID
        })
        .sort({
            points: "asc"
        })
        .exec();
    return roles
}
//create
export function createRole(guildID: string, roleID: string, points: number) {
    let rank = Schemas.Rank({
        _id: Mongoose.Types.ObjectId(),
        guildID: guildID,
        roleID: roleID,
        points: points
    })
    rank.save()
    return rank
}
//private
//update
export function updateOneFromIDs(guildID: string, roleID: string, points: number): void {
    Schemas.Rank.findOneAndUpdate({
        guildID: guildID,
        roleID: roleID
    }, {
        points: points
    }).exec()
}