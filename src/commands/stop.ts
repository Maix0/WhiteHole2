import * as Discord from "discord.js"
import * as StaticMusic from "../static/music";

module.exports = {
    name: 'stop',
    description: 'Stop the music',
    permission: [],
    usage: "",
    aliases: [],
    async execute(message: Discord.Message, args: string[]) {
        if(!message.guild.voiceConnection) {
            return message.channel.send("Error: not in voice channel")
        }
        StaticMusic.deleteQueue(message.guild.id)
    }
}