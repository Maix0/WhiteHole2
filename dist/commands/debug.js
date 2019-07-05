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
// wh?command args[0], args[1], args[2], args[3]
// wh?command raw, datatype, <user>, args[3]
const Schemas = {
    UserData: require("../models/userData"),
    Rank: require("../models/rank"),
    Perms: require("../models/permission")
};
module.exports = {
    permission: ["dev"],
    name: 'debug',
    description: 'dev-only command',
    usage: "dev-only command",
    aliases: ["dev"],
    async execute(message, args) {
        let subCommand = new Discord.Collection();
        subCommand.set("raw", {
            info: {},
            async execute(message, args) {
                if (!args[1]) {
                    return;
                }
                switch (args[1]) {
                    case "userdata":
                        let userdata = await Schemas.UserData.findOne({ userID: message.mentions.members.first().id, guildID: message.guild.id }).exec();
                        return message.channel.send(`\`\`\`json\n${JSON.stringify(userdata, null, '\t')} \n\`\`\``);
                    case "perm":
                        let perms = await Schemas.Perms.findOne({ userID: message.mentions.members.first().id, guildID: message.guild.id }).exec();
                        return message.channel.send(`\`\`\`json\n${JSON.stringify(perms, null, '\t')} \n\`\`\``);
                    case "rank":
                        let rank = await Schemas.Perms.findOne({ roleID: message.mentions.roles.first().id, guildID: message.guild.id }).exec();
                        return message.channel.send(`\`\`\`json\n ${JSON.stringify(rank, null, '\t')}\n\`\`\``);
                    default:
                        return;
                }
            }
        });
        if (subCommand.has(args[0])) {
            let Scommand = subCommand.get(args[0]);
            Scommand.execute(message, args);
        }
    }
};
