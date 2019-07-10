import * as Discord from "discord.js"
import * as MusicStatic from "../static/music"
import ytdl = require('ytdl-core');
import * as request from "request-promise-native"
const config = require("../json/config.json")
module.exports = {
    name: 'play',
    description: 'Play music from yt url',
    permission: [],
    usage: "youtube|yt|y <youtube querry>",//\nspotify|sp|s <spotify querry>",
    aliases: [],
    async execute(message: Discord.Message, args: string[]) {
        if (!message.member.voiceChannel) {
            return message.channel.send("You need to be in a voice channel !")
        }
        switch (args[0]) {
            case "youtube":
            case "yt":
            case "y":
                if (!args[1]) {
                    return message.channel.send(`usage :\`${this.usage}\``)
                }
                if (ytdl.validateURL(args[1])) {
                    MusicStatic.addToQueue(message.guild.id, args[1], MusicStatic.StreamTypes.YOUTUBE)
                }
                else {
                    args.pop()
                    let querry = JSON.parse(await request.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&order=relevance&q=${args.join(" ")}&key=${config.googleAPIKey}`))
                    if(!querry.items[0]){
                        return message.channel.send("Found nothing!")
                    }
                    MusicStatic.addToQueue(message.guild.id, (await ytdl.getBasicInfo(querry.items[0].id.videoId)).video_url, MusicStatic.StreamTypes.YOUTUBE)
                }
                break;
            case "spotify":
            case "sp":
            case "s":
                return message.channel.send("Error , spotify not supported!")

            default:
                return message.channel.send(`usage :\`${this.usage}\``)
        }
        if (!message.guild.voiceConnection) {
            let voiceConnection = await message.member.voiceChannel.join()
            if (!voiceConnection) {
                return message.channel.send("Error, can't join voice channel")
            }
            MusicStatic.playMusic(message.guild.id, voiceConnection)
        }
        if(message.guild.voiceConnection.channel.id != message.member.voiceChannel.id){
            return message.channel.send("Error , not in same channel")
        }
    }
}


