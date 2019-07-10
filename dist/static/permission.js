"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Mongoose = require("mongoose");
const Schemas = {
    Perms: require("../models/permission")
};
// module.exports = {
exports._permissionArrayLenght = 8;
//          Private
function _createBitArray(num) {
    return num.toString(2).split("").map(str => Number(str)).reverse();
}
exports._createBitArray = _createBitArray;
//          Querry
async function getFromIDs(guildID, userID) {
    let querry = await Schemas.Perms.findOne({
        guildID: guildID,
        userID: userID
    }).exec();
    if (!querry) {
        querry = createData(guildID, userID);
    }
    return querry;
}
exports.getFromIDs = getFromIDs;
//          Create
function createData(guildID, userID) {
    let permData = new Schemas.Perms({
        _id: Mongoose.Types.ObjectId(),
        guildID: guildID,
        userID: userID,
        permission: 0
    });
    permData.save();
    return permData;
}
exports.createData = createData;
function getObject(permNum) {
    let permValue = _createBitArray(permNum).concat(new Array(exports._permissionArrayLenght - _createBitArray(permNum).length < 0 ? 0 : exports._permissionArrayLenght - _createBitArray(permNum).length).fill(0));
    let permName = require("../json/perms.json");
    let permObj = {};
    for (let index = 0; index < permValue.length; index++) {
        if (permName[index]) {
            permObj[permName[index]] = permValue[index];
        }
    }
    return permObj;
}
exports.getObject = getObject;
function getNumber(permObject) {
    let byteArray = Object.values(permObject);
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
exports.getNumber = getNumber;
function getActive(permObject) {
    let ActivePerm = Object.keys(permObject).map(key => {
        if (permObject[key] === 1)
            return key;
    });
    return ActivePerm;
}
exports.getActive = getActive;
// Update
function updateOneFromIDs(guildID, userID, permInt) {
    Schemas.Perms.findOneAndUpdate({
        guildID: guildID,
        userID: userID
    }, {
        permission: permInt
    }).exec();
}
exports.updateOneFromIDs = updateOneFromIDs;
function updateOneFromUID(uID, permInt) {
    Schemas.Perms.findOneAndUpdate({
        _id: uID
    }, {
        permission: permInt
    }).exec();
}
exports.updateOneFromUID = updateOneFromUID;
