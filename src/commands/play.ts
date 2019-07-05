import * as Discord from "discord.js"
import * as MusicStatic from "../static/music"
import ytdl = require('ytdl-core');
module.exports = {
    name: 'play',
    description: 'Play music from yt url',
    permission: [],
    usage: "<youtube url>",
    aliases: [],
    async execute(message: Discord.Message, args: string[]) {
        if(!args[0] || !ytdl.validateURL(args[0])){
            return message.channel.send(`usage :\`${this.usage}\``)
        }
        if(!message.member.voiceChannel){
            return message.channel.send("You need to be in a voice channel !")
        }
        MusicStatic.addToQueue(message.guild.id, args[0])
        if(!message.guild.voiceConnection){
            let voiceConnection = await message.member.voiceChannel.join()
            if(!voiceConnection){
                return message.channel.send("Error, can't join voice channel")
            }
            MusicStatic.playMusic(message.guild.id, voiceConnection)
        }
        
    }
}