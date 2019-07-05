import * as Discord from "discord.js"
const Mongoose = require("mongoose")
import * as Types from "../types";
const Schema = {
    Rank: require("../models/rank")
}
async function getRoleFromID(guildID: string, roleID: string) {
    let qRole = await Schema.Rank.findOne({
        guildID: guildID,
        roleID: roleID,
    }).exec()
    return qRole
}
async function checkNumber(num: any) {
    if (Number(num)) {
        if (Number(num) >= 0) {
            return true
        }
    }
    return false
}

module.exports = {
    permission : ["admin"],
    name: 'role',
    description: 'manage roles',
    usage: "create|delete|set <role>  <points>",
    aliases: [],
    async execute(message: Discord.Message, args: string[]) {
        if (!args) {
            return message.channel.send(`Usage : ${this.usage}`)
        }
        let mRole = message.mentions.roles.first()
        if (!mRole) {
            return message.channel.send(`Usage : ${this.usage}`)
        }
        if (!args[0]) {
            return message.channel.send(`Usage : ${this.usage}`)
        }
        let qRole = await getRoleFromID(message.guild.id, mRole.id)
        switch (args[0]) {
            case "create":
                if (qRole) {
                    return message.channel.send("role allready created")
                }
                if (checkNumber(args[2])) {
                    let nRank: Types.Ranks | any = new Schema.Rank({
                        _id: Mongoose.Types.ObjectId(),
                        guildID: message.guild.id,
                        roleID: mRole.id,
                        points: args[2]

                    });
                    nRank.save();
                    message.channel.send(`Created new role ${mRole.name} at ${nRank.points} pts`)
                } else {
                    return message.channel.send("need pts number (>=0)")
                }
                break;
            case "delete":
                if (!qRole) {
                    return message.channel.send("Error , Role isn't setup")
                }
                Schema.Rank.findOneAndRemove({
                    _id: qRole._id
                }).then((e: any) => {
                    console.log(e)
                    message.channel.send("role deleted")
                })
                break
            case "set":
                if (!qRole) {
                    return message.channel.send("Role isn't setup")
                }
                if (checkNumber(args[2])) {
                    Schema.Rank.findOneAndUpdate({
                        _id: qRole._id
                    }, {
                        points: Number(args[2])
                    })
                    message.channel.send("Role updated")
                }
                break;
            default:
                return message.channel.send(this.usage)
        }
    }
}