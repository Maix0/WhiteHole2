"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Schemas = {
    UserData: require("../models/userData"),
    Rank: require("../models/rank")
};
async function GetRoles(guildID) {
    let roles = await Schemas.Rank.find({
        guildID: guildID
    })
        .sort({
        points: "asc"
    })
        .exec();
    return roles;
}
function rankCreateBar(cRolePoints, uPoints, nRolePoints) {
    let pbPercentage = Math.round((uPoints - cRolePoints) / (nRolePoints - cRolePoints) * 10);
    let pb = "";
    for (let index = 0; index < pbPercentage; index++) {
        pb += "@";
    }
    for (let index = pb.length; index < 10; index++) {
        pb += "=";
    }
    return pb;
}
async function getUserDataFromID(guildID, userID) {
    let userdata = await Schemas.UserData.findOne({
        guildID: guildID,
        userID: userID
    }).exec();
    return userdata;
}
module.exports = {
    name: 'rank',
    description: 'show your server rank',
    permission: [],
    usage: "<user>",
    aliases: ["profile"],
    async execute(message, args) {
        let rUser = message.mentions.members.first() ? message.mentions.members.first() : message.member;
        let rUserData = await getUserDataFromID(message.guild.id, rUser.id);
        let gRoles = await GetRoles(message.guild.id);
        let gRoleBefore = [];
        let gRoleAfter = [];
        let rRoles = {};
        gRoles.forEach((role) => {
            if (role.points <= rUserData.pointsModule.points) {
                gRoleBefore.unshift(role);
            }
            else if (role.points > rUserData.pointsModule.points) {
                gRoleAfter.push(role);
            }
        });
        if (!gRoleBefore[0]) {
            rRoles.before = {
                role: {
                    name: "None"
                },
                points: 0
            };
        }
        else {
            rRoles.before = {
                role: message.guild.roles.get(gRoleBefore[0].roleID),
                points: gRoleBefore[0].points
            };
        }
        if (!gRoleAfter[0]) {
            rRoles.after = {
                role: {
                    name: "None"
                },
                points: Infinity
            };
        }
        else {
            rRoles.after = {
                role: message.guild.roles.get(gRoleAfter[0].roleID),
                points: gRoleAfter[0].points
            };
        }
        let rMessage = ["```py",
            `📑Rank Card Of #${rUser.nickname ? rUser.nickname : rUser.user.username}📑`,
            `You have ${rUserData.pointsModule.points} points`,
            `${rRoles.before.points} [${rankCreateBar(rRoles.before.points, rUserData.pointsModule.points, rRoles.after.points)}] ${rRoles.after.points}`,
            `Next Rank : ${rRoles.after.role.name} at ${rRoles.after.points}`,
            `Current Rank : ${rRoles.before.role.name} at ${rRoles.before.points}`,
            "```"
        ];
        message.channel.send(rMessage.join("\n"));
    },
};
