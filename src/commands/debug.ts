import * as Discord from "discord.js"

// wh?command args[0], args[1], args[2], args[3]
// wh?command raw, datatype, <user>, args[3]

const Schemas:any = {
    UserData: require("../models/userData"),
    Rank: require("../models/rank"),
    Perms: require("../models/permission")
}

module.exports = {
    permission: ["dev"],
    name: 'debug',
    description: 'dev-only command',
    usage: "dev-only command",
    aliases: ["dev"],
    async execute(message: Discord.Message, args: string[]) {
        let subCommand: Discord.Collection<string, {info:any, execute:Function | Promise<any>}> = new Discord.Collection()
        subCommand.set("raw", {
            info: {},
            async execute(message: Discord.Message, args: string[]) {
                if(!args[1]){
                    return
                }
                switch (args[1]) {
                    case "userdata":
                        let userdata = await Schemas.UserData.findOne({userID: message.mentions.members.first().id, guildID: message.guild.id}).exec()
                        return message.channel.send(`\`\`\`json\n${JSON.stringify(userdata, null, '\t')} \n\`\`\``)
                    case "perm":
                        let perms = await Schemas.Perms.findOne({userID: message.mentions.members.first().id, guildID: message.guild.id}).exec()
                        return message.channel.send(`\`\`\`json\n${JSON.stringify(perms, null, '\t')} \n\`\`\``)
                    case "rank":
                        let rank = await Schemas.Perms.findOne({roleID: message.mentions.roles.first().id, guildID: message.guild.id}).exec()
                        return message.channel.send(`\`\`\`json\n ${JSON.stringify(rank, null, '\t')}\n\`\`\``)
                    default:
                        return
                }
            }
        })
        if(subCommand.has(args[0])){
            let Scommand: {info:any, execute:Function | Promise<any>} | any = subCommand.get(args[0])
            Scommand.execute(message,args)
        }
    }
}