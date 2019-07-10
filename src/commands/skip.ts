import * as Discord from "discord.js"
import * as MusicStatic from "../static/music"
module.exports = {
    name: 'skip',
    description: 'Skip current music',
    permission: [],
    usage: " ",
    aliases: [],
    async execute(message: Discord.Message, args: string[]) {
        MusicStatic.shiftQueue(message.guild.id)
        message.channel.send("Music skipped")
    }
}