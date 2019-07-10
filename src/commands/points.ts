import * as Discord from "discord.js"
const Mongoose = require("mongoose")
import * as Types from "../types"
const Schemas: any = {
    UserData: require("../models/userData")
}

async function createUserData(guildID: string, userID: string) {
    let userdata = Schemas.UserData({
        _id: Mongoose.Types.ObjectId(),
        guildID: guildID,
        userID: userID,
        pointsModule: {
            points: 0,
            level: 0,
            lastMessage: 0
        }
    })
    userdata.save()
    return userdata
}

async function getUserData(guildID: string, userID: string): Promise < Types.UserData | null > {
    let userdata: Types.UserData | null = await Schemas.UserData.findOne({
        guildID: guildID,
        userID: userID
    }).exec()
    return userdata
}

async function UpdateUserPoints(_id: any, points: number) : Promise<void> {
    let querry = await Schemas.UserData.updateOne({
        _id: _id
    }, {
        pointsModule: {
            points: points
        }
    }).exec()
}
function checkNumber(num:any) : boolean{
    if(!Number(num)){
        return false
    }
    if(!(Number(num) > 0)){
        return false
    }

    return true
}
module.exports = {
    permission: ["points", "admin"],
    name: "points",
    description: "Manage users points",
    usage: "<user> add|remove|set <points> <?createUser>",
    aliases: ["point"],
    async execute(message: Discord.Message, args: string[]) {
        let tUser = message.mentions.members.first()
        if (!tUser) {
            return message.channel.send(this.usage)
        }
        let userData : Types.UserData | any = await getUserData(message.guild.id,tUser.id)
        if(!userData && (Boolean(args[3]) == false)){
            return message.channel.send("Error: userData isn't created")
        } else if(Boolean(args[3]) && !userData) {
            userData = await createUserData(message.guild.id, tUser.id)
        }
        let ogPoints = userData.pointsModule.points
        switch (args[1]) {
            case "add":
                if(!args[2]){
                    return message.channel.send(this.usage)
                }
                if(!checkNumber(args[2])){
                    return message.channel.send(this.usage)
                }
                userData.pointsModule.points += Number(args[2])
                UpdateUserPoints(userData._id, userData.pointsModule.points).then(() => {
                    message.channel.send(`Succesfuly updated <@${tUser.id}>'s points from \`${ogPoints}\` to \`${userData.pointsModule.points}\` `)
                })
                break;
            case "remove":
                if(!args[2]){
                    return message.channel.send(this.usage)
                }
                if(!checkNumber(args[2])){
                    return message.channel.send(this.usage)
                }
                userData.pointsModule.points -= Number(args[2])
                if(userData.pointsModule.points < 0) userData.pointsModule.points = 0;
                UpdateUserPoints(userData._id, userData.pointsModule.points).then(() => {
                    message.channel.send(`Succesfuly updated <@${tUser.id}>'s points from \`${ogPoints}\` to \`${userData.pointsModule.points}\` `)
                })
                break;
            case "set":
                if(!args[2]){
                    return message.channel.send(this.usage)
                }
                if(!checkNumber(args[2])){
                    return message.channel.send(this.usage)
                }
                userData.pointsModule.points = Number(args[2])
                UpdateUserPoints(userData._id, userData.pointsModule.points).then(() => {
                    message.channel.send(`Succesfuly updated <@${tUser.id}>'s points from \`${ogPoints}\` to \`${userData.pointsModule.points}\` `)
                })
                break;

            default:
                return message.channel.send(this.usage)
        }
    }
}