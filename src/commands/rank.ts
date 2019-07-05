import * as Discord from "discord.js"
import * as Types from "../types"
const Schemas = {
    UserData: require("../models/userData"),
    Rank: require("../models/rank")
}

const StaticRole = require("../static/rank")
function rankCreateBar(cRolePoints: number, uPoints: number, nRolePoints: number) {
    let pbPercentage = Math.round((uPoints - cRolePoints) / (nRolePoints - cRolePoints) * 10)
    let pb = ""
    for (let index = 0; index < pbPercentage; index++) {
        pb += "@"

    }
    for (let index = pb.length; index < 10; index++) {
        pb += "="
    }
    return pb
}
async function getUserDataFromID(guildID: string, userID: string) {
    let userdata = await Schemas.UserData.findOne({
        guildID: guildID,
        userID: userID
    }).exec();
    return userdata
}
module.exports = {
    name: 'rank',
    description: 'show your server rank',
    permission: [],
    usage: "<?user>",
    aliases: ["profile"],
    async execute(message: Discord.Message, args: string[]) {
        let rUser: Discord.GuildMember = message.mentions.members.first() ? message.mentions.members.first() : message.member
        let rUserData: Types.UserData = await getUserDataFromID(message.guild.id, rUser.id)
        let gRoles: Types.Ranks[] = await StaticRole.GetRolesOrdered(message.guild.id)
        let gRoleBefore: Types.Ranks[] = []
        let gRoleAfter: Types.Ranks[] = []
        let rRoles:any = {}
        gRoles.forEach((role) => {
            if (role.points <= rUserData.pointsModule.points) {
                gRoleBefore.unshift(role)
            } else if (role.points > rUserData.pointsModule.points) {
                gRoleAfter.push(role)
            }
        })

        if (!gRoleBefore[0]) {
            rRoles.before = {
                role: {
                    name: "None"
                },
                points: 0
            }
        } else {
            rRoles.before = {
                role: message.guild.roles.get(gRoleBefore[0].roleID),
                points: gRoleBefore[0].points
            }
        }
        if (!gRoleAfter[0]) {
            rRoles.after = {
                role: {
                    name: "None"
                },
                points: Infinity
            }
        } else {
            rRoles.after = {
                role: message.guild.roles.get(gRoleAfter[0].roleID),
                points: gRoleAfter[0].points
            }
        }
        let rMessage = ["```py",
            `📑Rank Card Of #${rUser.nickname ? rUser.nickname: rUser.user.username}📑`,
            `You have ${rUserData.pointsModule.points} points`,
            `${rRoles.before.points} [${rankCreateBar(rRoles.before.points,rUserData.pointsModule.points,rRoles.after.points)}] ${rRoles.after.points}`,
            `Next Rank : ${rRoles.after.role.name} at ${rRoles.after.points}`,
            `Current Rank : ${rRoles.before.role.name} at ${rRoles.before.points}`,
            "```"
        ]
        message.channel.send(rMessage.join("\n"))
    },
};