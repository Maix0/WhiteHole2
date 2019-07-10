"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Schemas = {
    UserData: require("../models/userData"),
};
async function getUserList(guildID) {
    let userdatas = await Schemas.UserData.find({
        guildID: guildID
    })
        .exec();
    let uDataMid = {};
    let userdataSorted = [];
    userdatas.forEach(uData => {
        uDataMid[uData.pointsModule.points.toString()] = uData;
    });
    let sortedkeys = Object.keys(uDataMid).sort(function (a, b) {
        return Number(a) - Number(b);
    });
    sortedkeys.forEach((key) => {
        userdataSorted.unshift(uDataMid[key]);
    });
    return userdataSorted;
}
module.exports = {
    name: 'top',
    description: 'Show the server leaderboard',
    usage: "<?page>",
    permission: [],
    aliases: ["leaderboard"],
    async execute(message, args) {
        var page;
        if (!args[0]) {
            page = 0;
        }
        else if (!Number(args[0])) {
            return message.channel.send("need a valid page number");
        }
        else if (Number(args[0]) < 1) {
            return message.channel.send("need a valid page number");
        }
        else {
            page = Number(args[0]) - 1;
        }
        let userDataList = await getUserList(message.guild.id);
        if (userDataList.length < (page * 10)) {
            return message.channel.send("need a valid page number");
        }
        let tMessage = ["```py", "📋 Rank | Name", `Page [${page + 1}/${Math.floor(userDataList.length / 10) + 1}]`];
        for (let index = 0; index < 10; index++) {
            let userIndex = index + page * 10;
            let tUserData = userDataList[userIndex];
            if (userIndex < userDataList.length) {
                if (message.guild.members.has(tUserData.userID)) {
                    let tUser = message.guild.members.get(tUserData.userID);
                    tMessage.push(` [${userIndex + 1}]    > #${tUser.nickname ? tUser.nickname : tUser.user.username}${tUser === message.member ? "      <= You" : ""}`);
                    tMessage.push(`               Points: ${tUserData.pointsModule.points}`);
                }
            }
        }
        tMessage.push("-------------------------------------");
        let index = 0;
        userDataList.forEach((userData) => {
            index++;
            if (userData.userID == message.author.id) {
                tMessage.push(`😐 Rank: ${index}    Total Score: ${userData.pointsModule.points}`);
            }
        });
        tMessage.push("```");
        message.channel.send(tMessage.join("\n"));
    },
};
