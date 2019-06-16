"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = __importStar(require("discord.js"));
const fs = __importStar(require("fs"));
const Mongoose = require("mongoose");
// import * as Mongoose from "mongoose"
const config = require("./config.json");
const Schemas = {
    UserData: require("./models/userData"),
    Rank: require("./models/rank"),
    Perms: require("./models/permission")
};
const StatusMessage = require("./status.json");
const bot = new Discord.Client({
    disableEveryone: true
});
bot.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    if (!command.usage) {
        console.log(`Missing usage: ${command.name}`);
    }
    if (!command.permission) {
        console.log(`Missing permission: ${command.name}`);
    }
    if (!command.description) {
        console.log(`Missing Description: ${command.name}`);
    }
    if (command.permission) {
        command.permission = command.permission.map(value => value.toLowerCase());
    }
    bot.commands.set(command.name, command);
}
Mongoose.connect(config._DataBaseURL, {
    useNewUrlParser: true,
    user: config._dbusername,
    pass: config._dbpassword,
    dbName: config._dbname
} /* {
    
    useNewUrlParser: true
} */).then(() => {
    console.log("Connected To DataBase");
});
bot.on("ready", async function () {
    console.log("White Hole V2 [BETA] Online");
    let statusCounter = 0;
    bot.user.setPresence(StatusMessage[statusCounter]).catch((err) => {
        if (err)
            console.log(err);
    });
    setInterval(() => {
        bot.user.setPresence(StatusMessage[statusCounter]).then((user) => { }).catch((err) => {
            if (err) {
                console.log(err);
            }
        });
        statusCounter += 1;
        if (statusCounter >= StatusMessage.length) {
            statusCounter = 0;
        }
    }, 900000);
});
bot.on("message", async function (message) {
    if (message.author.bot)
        return;
    let userdata = await GetUserData(message);
    await PointsModules(userdata, message);
    if (!message.content.startsWith(config._PREFIX))
        return;
    if (message.channel.type !== "text")
        return;
    const args = message.content.slice(config._PREFIX.length).trim().split(/ +/g);
    const commandName = args.shift().toLowerCase();
    const command = bot.commands.get(commandName) ||
        bot.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command)
        return;
    if (command.permission.length) {
        let uPermsData = await getPermissionData(message.guild.id, message.author.id);
        let uPermsList = GetPermissionsObj(uPermsData.permission);
        let uActivePerms = Object.keys(uPermsList).filter(function (value, index, array) {
            if (uPermsList[value]) {
                return value.toLowerCase();
            }
        });
        let uHasPermission = false;
        uActivePerms.forEach(function (perm) {
            if (command.permission.includes(perm)) {
                uHasPermission = true;
            }
        });
        if (!uHasPermission) {
            return message.channel.send(`Error Missing permission : \n \`${command.permission.join(" ")}\``);
        }
    }
    try {
        command.execute(message, args);
    }
    catch (err) {
        if (err)
            console.log(err);
    }
});
bot.login(config._TOKEN);
async function PointsModules(userdata, message) {
    if ((userdata.pointsModule.lastMessage + config._PointsDelay < message.createdTimestamp) && (!message.content.startsWith(config._PREFIX))) {
        userdata.pointsModule.points += Math.floor(Math.random() * 10 + 10);
        userdata.pointsModule.lastMessage = message.createdTimestamp;
        UpdateUserData(userdata);
        let OrderedRoles = await GetRoles(message.guild.id);
        OrderedRoles.forEach((role) => {
            if (userdata.pointsModule.points >= role.points) {
                if (!message.member.roles.has(role.roleID)) {
                    message.member.addRole(role.roleID);
                    message.channel.send(" Hey, You got a new role !");
                }
            }
        });
    }
}
async function GetUserData(message) {
    let userdata = await Schemas.UserData.findOne({
        guildID: message.guild.id,
        userID: message.author.id
    }).exec();
    if (!userdata) {
        userdata = new Schemas.UserData({
            _id: Mongoose.Types.ObjectId(),
            guildID: message.guild.id,
            userID: message.author.id,
            pointsModule: {
                level: 0,
                points: 0,
                lastMessage: 0
            }
        });
        userdata.save();
    }
    return userdata;
}
async function UpdateUserData(userdata) {
    let update = await Schemas.UserData.updateOne({
        _id: userdata._id
    }, userdata);
}
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
