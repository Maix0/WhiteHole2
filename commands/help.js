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
const fs = require("fs");
module.exports = {
    name: "help",
    description: "Show you the list of command if no args is given , else give you command's usage",
    permission: [],
    usage: "<?command>",
    aliases: ["commands"],
    async execute(message, args) {
        if (!args[0] || !(commandsList.has(args[0]) || commandsList.find((cmd) => cmd.aliases && cmd.aliases.includes(args[0])))) {
            let hMessage = new Discord.RichEmbed();
            hMessage.setAuthor("White Hole Help");
            hMessage.setDescription("White Hole's Commands list \n commandName (aliases|list) \n `<somthing>`: value given by user \n `<?somthing>`:optional value given by user");
            commandsList.forEach((command) => {
                hMessage.addField(`${command.name} (${command.aliases.join("|")})`, `\`Usage: ${command.usage}\`\n Permission: \` ${command.permission.join("|")} \``);
            });
            message.channel.send(hMessage);
        }
        if ((commandsList.has(args[0]) || commandsList.find((cmd) => cmd.aliases && cmd.aliases.includes(args[0])))) {
            let command = commandsList.get(args[0]) || commandsList.find((cmd) => cmd.aliases && cmd.aliases.includes(args[0]));
            let hMessage = new Discord.RichEmbed();
            hMessage.setAuthor("White Hole Help");
            hMessage.setTitle(command.name);
            hMessage.setDescription(`Aliases: \`${command.aliases.join(" ")}\``);
            hMessage.addField("`" + command.usage + "`", command.description + "\n" + `Permission:  \` ${command.permission.join("|")} \``);
            message.channel.send(hMessage);
        }
    }
};
const commandsList = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./${file}`);
    if (command.permission) {
        command.permission = command.permission.map(value => value.toLowerCase());
    }
    commandsList.set(command.name, command);
}
