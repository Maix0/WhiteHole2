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
const Perms = require("../permissions.json");
const Schemas = {
    Perms: require("../models/permission")
};
async function getPermissionData(guildID, userID) {
    let qPerms = await Schemas.Perms.findOne({
        guildID: guildID,
        userID: userID
    }).exec();
    if (!qPerms) {
        qPerms = new Schemas.Perms({
            _id: Mongoose.Types.ObjectId(),
            guildID: guildID,
            userID: userID,
            permission: 0
        });
        qPerms.save();
    }
    return qPerms;
}
function GetPermissionsObj(long) {
    var permission_value = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var permission_name = ["admin", "points"];
    const UserPermission = {};
    for (var index = 0; index < permission_name.length; index++) {
        var byte = long & 0xff;
        permission_value[index] = byte;
        long = (long - byte) / 256;
    }
    for (let index = 0; index < permission_value.length; index++) {
        const bit = permission_value[index];
        UserPermission[permission_name[index]] = bit;
    }
    return UserPermission;
}
;
function CreatePermissionsIntFromObj(permsOBJ) {
    let byteArray = Object.values(permsOBJ);
    var value = 0;
    for (var i = byteArray.length - 1; i >= 0; i--) {
        value = (value * 256) + byteArray[i];
    }
    return value;
}
;
module.exports = {
    permission: ["admin"],
    name: 'permission',
    description: 'Manage user permission',
    usage: "<user> grant|revoke|get <permission>",
    aliases: ["perms", "perm"],
    async execute(message, args) {
        let tUser = message.mentions.members.first();
        if (!tUser) {
            return message.channel.send(this.usage);
        }
        if (!args[1]) {
            return message.channel.send(this.usage);
        }
        switch (args[1]) {
            case "grant":
                if (!args[2]) {
                    return message.channel.send(this.usage);
                }
                if (!Perms.permissions.includes(args[2])) {
                    return message.channel.send(`Error : invalid permission \n List of all permission : \n \`${Perms.permissions.join(" ")}\``);
                }
                let uPermsData = await getPermissionData(message.guild.id, tUser.id);
                let uPermsList = GetPermissionsObj(uPermsData.permission);
                if (uPermsList[args[2]] === 1) {
                    return message.channel.send("Error : permission already granted");
                }
                else {
                    uPermsList[args[2]] = 1;
                    let nPerm = CreatePermissionsIntFromObj(uPermsList);
                    Schemas.Perms.UpdateOne({
                        _id: uPermsData._id
                    }, {
                        permission: CreatePermissionsIntFromObj(uPermsList)
                    }).exec()
                        .then(() => {
                        message.channel.send(`Permission \`${args[2]}\` has succesfully been granted to targeted user`);
                    });
                }
                break;
            case "revoke":
                if (!args[2]) {
                    return message.channel.send(this.usage);
                }
                let ruPermsData = await getPermissionData(message.guild.id, tUser.id);
                let ruPermsList = GetPermissionsObj(ruPermsData.permission);
                let ruPermsListActive = Object.keys(GetPermissionsObj(ruPermsData.permission)).map(value => { if (ruPermsList[value])
                    return value; });
                if (!ruPermsListActive.includes(args[2])) {
                    return message.channel.send("Error Can't revoke : Permission isn't granted to user targeted");
                }
                ruPermsList[args[2]] = 0;
                let nPerm = CreatePermissionsIntFromObj(ruPermsList);
                Schemas.Perms.UpdateOne({
                    _id: ruPermsData._id
                }, {
                    permission: CreatePermissionsIntFromObj(ruPermsList)
                }).exec()
                    .then(() => {
                    message.channel.send(`Permission \`${args[2]}\` has succesfully been revoked from targeted user`);
                });
                break;
            case "get":
                let userPdata = await getPermissionData(message.guild.id, tUser.id);
                let userPlist = GetPermissionsObj(userPdata.permission);
                return message.channel.send(` <@${tUser.id}>'s permission(s) : \n ${Object.keys(userPlist).map((value) => { if (userPlist[value])
                    return `\`${value}\``; }).join(" ")}`);
                break;
            default:
                return message.channel.send(this.usage);
        }
    }
};
