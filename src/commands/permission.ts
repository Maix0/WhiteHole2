import * as Discord from "discord.js"
import * as Types from "../types"
const Mongoose = require("mongoose")
const Perms = require("../json/perms.json")
const Schemas = {
    Perms: require("../models/permission")
}
const StaticPerm = require("../static/permission")
module.exports = {
    permission: ["admin"],
    name: 'permission',
    description: 'Manage user permission',
    usage: "<user> grant|revoke|get <permission>",
    aliases: ["perms" , "perm"],
    async execute(message: Discord.Message, args: string[]) {
        let tUser = message.mentions.members.first()
        if (!tUser) {
            return message.channel.send(this.usage)
        }
        if (!args[1]) {
            return message.channel.send(this.usage)
        }

        switch (args[1]) {
            case "grant":
                if (!args[2]) {
                    return message.channel.send(this.usage)
                }
                if (!Perms.permissions.includes(args[2])) {
                    return message.channel.send(`Error : invalid permission \n List of all permission : \n \`${Perms.permissions.join(" ")}\``)
                }
                let uPermsData: Types.Perms = await StaticPerm.getFromIDs(message.guild.id, tUser.id)
                let uPermsList: Types.PermsList = StaticPerm.getObject(uPermsData.permission)
                if (uPermsList[args[2]] === 1) {
                    return message.channel.send("Error : permission already granted")
                } else {
                    uPermsList[args[2]] = 1
                    Schemas.Perms.updateOne({
                        _id: uPermsData._id
                    }, {
                        permission: StaticPerm.getNumber(uPermsList)
                    }).exec()
                    .then( () => {
                        message.channel.send(`Permission \`${args[2]}\` has succesfully been granted to targeted user`)
                    })
                }
                break;
            case "revoke":
                if (!args[2]) {
                    return message.channel.send(this.usage)
                }
                let ruPermsData: Types.Perms = await StaticPerm.getFromIDs(message.guild.id, tUser.id)
                let ruPermsList: Types.PermsList = StaticPerm.getObject(ruPermsData.permission)
                let ruPermsListActive: (string | undefined)[] = StaticPerm.getActive(ruPermsList)
                if(!ruPermsListActive.includes(args[2])){
                    return message.channel.send("Error Can't revoke : Permission isn't granted to user targeted")
                }
                ruPermsList[args[2]] = 0
                    Schemas.Perms.updateOne({
                        _id: ruPermsData._id
                    }, {
                        permission: StaticPerm.getNumber(ruPermsList)
                    }).exec()
                    .then( () => {
                        message.channel.send(`Permission \`${args[2]}\` has succesfully been revoked from targeted user`)
                    })
                break;
            case "get":
                let userPdata: Types.Perms = await StaticPerm.getFromIDs(message.guild.id, tUser.id)
                let userPlist: Types.PermsList = StaticPerm.getObject(userPdata.permission)
                return message.channel.send(` <@${tUser.id}>'s permission(s) : \n ${Object.keys(userPlist).map( (value) => {if(userPlist[value]) return `\`${value}\``} ).join(" ")}`)
            default:
                return message.channel.send(this.usage)
        }
    }
}