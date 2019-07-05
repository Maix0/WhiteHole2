import * as Discord from "discord.js"
import * as Types from "./types"
import * as fs from "fs"
const Mongoose: any = require("mongoose")
const config: Types.config = require("./json/config.json")
const Schemas = {
    UserData: require("./models/userData"),
    Rank: require("./models/rank"),
    Perms: require("./models/permission")
}
const StaticPerm = require("./static/permission")


const StatusMessage: Discord.PresenceData[] = require("./json/status.json")

const bot: Types.DiscordBot | any = new Discord.Client({
    disableEveryone: true
})

bot.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./dist/commands').filter(file => file.endsWith('.js'));
const startupTime = Date.now()


for (const file of commandFiles) {
    const command: Types.Command = require(`./commands/${file}`);
    if(!command.usage) {
        console.log(`Missing usage: ${command.name}`)
    }
    if(!command.permission) {
        console.log(`Missing permission: ${command.name}`)
    }
    if(!command.description) {
        console.log(`Missing Description: ${command.name}`)
    }
    if(command.permission) {
        command.permission = command.permission.map( value => value.toLowerCase())
    }
    bot.commands.set(command.name, command);
    
}




Mongoose.connect(config._DataBaseURL,{
    useNewUrlParser:true,
    user:config._dbusername,
    pass:config._dbpassword,
    dbName:config._dbname
} /* {
    
    useNewUrlParser: true
} */).then(() => {
    console.log(`Connected To DataBase in ${Date.now() - startupTime}ms`)

})

bot.on("ready", async function () {
    console.log(`White Hole V2 [BETA] Online in ${Date.now() - startupTime}ms`)
    let statusCounter = 0

    bot.user.setPresence(StatusMessage[statusCounter]).catch((err: Error) => {
        if (err) console.log(err)
    })
    setInterval(() => {
        bot.user.setPresence(StatusMessage[statusCounter]).then((user: Discord.User) => {}).catch((err: Error) => {
            if (err) {
                console.log(err)
            }
        })
        statusCounter += 1
        if (statusCounter >= StatusMessage.length) {
            statusCounter = 0
        }
    }, 900000)
});

bot.on("message", async function (message: Discord.Message) {
    if (message.author.bot) return;
    let userdata = await GetUserData(message);
    await PointsModules(userdata, message);
    if (!message.content.startsWith(config._PREFIX)) return;
    if (message.channel.type !== "text") return;
    const args: string[] | any = message.content.slice(config._PREFIX.length).trim().split(/ +/g);
    const commandName = args.shift().toLowerCase();
    const command: Types.Command | undefined = bot.commands.get(commandName) ||
        bot.commands.find((cmd: any) => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;
    if (command.permission.length) {
        let uPermsData: Types.Perms = await StaticPerm.getFromIDs(message.guild.id,message.author.id) // await getPermissionData(message.guild.id, message.author.id)
        let uPermsList: Types.PermsList = StaticPerm.getObject(uPermsData.permission)
        let uActivePerms: string[] = StaticPerm.getActive(uPermsList)
        let uHasPermission = false
        uActivePerms.forEach(function (perm: string) {
            if (command.permission.includes(perm)) {
                uHasPermission = true
            }
        })
        if(!uHasPermission){
            return message.channel.send(`Error Missing permission : \n \`${command.permission.join(" ")}\``)
        }
    }
    try {
        command.execute(message, args);
    } catch (err) {
        if (err) console.log(err)
    }
});




bot.login(config._TOKEN)



async function PointsModules(userdata: Types.UserData, message: Discord.Message) {
    if ((userdata.pointsModule.lastMessage + config._PointsDelay < message.createdTimestamp) && (!message.content.startsWith(config._PREFIX))) {
        userdata.pointsModule.points += Math.floor(Math.random() * 10 + 10);
        userdata.pointsModule.lastMessage = message.createdTimestamp;
        await UpdateUserData(userdata);
        let OrderedRoles: Types.Ranks[] = await GetRoles(message.guild.id);
        OrderedRoles.forEach((role: Types.Ranks) => {
            if (userdata.pointsModule.points >= role.points) {
                if (!message.member.roles.has(role.roleID)) {
                    message.member.addRole(role.roleID);
                    message.channel.send(" Hey, You got a new role !");
                }
            }
        });
    }
}
async function GetUserData(message: Discord.Message) {
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
    return userdata
}


async function UpdateUserData(userdata: Types.UserData) {
    let update = await Schemas.UserData.updateOne({
        _id: userdata._id
    }, userdata)
    console.log(update)
}
async function GetRoles(guildID: string) {
    let roles: Types.Ranks[] = await Schemas.Rank.find({
            guildID: guildID
        })
        .sort({
            points: "asc"
        })
        .exec();
    return roles
}