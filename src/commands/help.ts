import * as Discord from 'discord.js'
import * as Types from '../types';
const fs = require("fs")
module.exports = {
    name: "help",
    description: "Show you the list of command if no args is given , else give you command's usage",
    permission: [],
    usage: "<?command>",
    aliases: ["commands"],
    async execute(message: Discord.Message, args: string[]) {
        if(!args[0] || !(commandsList.has(args[0]) ||commandsList.find((cmd: any) => cmd.aliases && cmd.aliases.includes(args[0])))){
            let hMessage = new Discord.RichEmbed()
            hMessage.setAuthor("White Hole Help")
            hMessage.setDescription("White Hole's Commands list \n commandName (aliases|list) \n `<somthing>`: value given by user \n `<?somthing>`:optional value given by user")
            commandsList.forEach( (command:Types.Command) =>  {
                hMessage.addField(`${command.name} (${command.aliases.join("|")})`,`\`Usage: ${ command.usage }\`\n Permission: \` ${command.permission.join("|")} \``)
            })
            message.channel.send(hMessage)
        }
        if((commandsList.has(args[0]) || commandsList.find((cmd: any) => cmd.aliases && cmd.aliases.includes(args[0])))){
            let command = commandsList.get(args[0]) || commandsList.find((cmd: any) => cmd.aliases && cmd.aliases.includes(args[0]))
            let hMessage = new Discord.RichEmbed()
            hMessage.setAuthor("White Hole Help")
            hMessage.setTitle(command.name)
            hMessage.setDescription(`Aliases: \`${command.aliases.join(" ")}\``)
            hMessage.addField( "`" +command.usage + "`", command.description + "\n" + `Permission:  \` ${command.permission.join("|")} \``)
            message.channel.send(hMessage)
        }
    }
}

const commandsList: Discord.Collection<string,Types.Command> = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter((file:any) => file.endsWith('.js'));
for (const file of commandFiles) {
    const command: Types.Command = require(`./${file}`);
    if(command.permission) {
        command.permission = command.permission.map( value => value.toLowerCase())
    }
    commandsList.set(command.name, command);
}