import * as Types from "../types";

const Mongoose = require("mongoose")
const Schemas = {
    Perms: require("../models/permission")
}
// module.exports = {
export let _permissionArrayLenght = 8
//          Private
export function _createBitArray(num: number): number[] {
    return num.toString(2).split("").map(str => Number(str)).reverse()
}
//          Querry
export async function getFromIDs(guildID: string, userID: string): Promise < Types.Perms > {
    let querry = await Schemas.Perms.findOne({
        guildID: guildID,
        userID: userID
    }).exec()
    if (!querry) {
        querry = createData(guildID, userID)
    }
    return querry
}
//          Create
export function createData(guildID: string, userID: string): Types.Perms {
    let permData = new Schemas.Perms({
        _id: Mongoose.Types.ObjectId(),
        guildID: guildID,
        userID: userID,
        permission: 0
    })
    permData.save()
    return permData
}
export function getObject(permNum: number): {
    [any: string]: number
} {
    let permValue: number[] = _createBitArray(permNum).concat(new Array(_permissionArrayLenght - _createBitArray(permNum).length < 0 ? 0 : _permissionArrayLenght - _createBitArray(permNum).length).fill(0))
    let permName: string[] = require("../json/perms.json")
    let permObj: {
        [any: string]: number
    } = {}
    for (let index = 0; index < permValue.length; index++) {
        if (permName[index]) {
            permObj[permName[index]] = permValue[index]
        }
    }
    return permObj
}
export function getNumber(permObject: {
    [any: string]: number
}): number {
    let byteArray = Object.values(permObject)
    let pow = 0;
    let n = 0;
    for (var i = byteArray.length - 1; i >= 0; i--) {
        if (byteArray[i] === 1) {
            n += Math.pow(2, pow);
        }
        pow++;
    }
    return n;
}
export function getActive(permObject: {
    [any: string]: number
}): (string | void)[] {
    let ActivePerm: (string | void)[] = Object.keys(permObject).map(key => {
        if (permObject[key] === 1) return key
    })
    return ActivePerm
}
// Update
export function updateOneFromIDs(guildID: string, userID: string, permInt: number): void {
    Schemas.Perms.findOneAndUpdate({
        guildID: guildID,
        userID: userID
    }, {
        permission: permInt
    }).exec()
}
export function updateOneFromUID(uID: string, permInt: number): void {
    Schemas.Perms.findOneAndUpdate({
        _id: uID
    }, {
        permission: permInt
    }).exec()
}