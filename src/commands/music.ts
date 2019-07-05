import * as Discord from "discord.js"
const StaticMusic = require("../static/music")
module.exports = {
    name: 'music',
    description: '',
    permission: ["dev"],
    usage: "",
    aliases: [],
    async execute(message: Discord.Message, args: string[]) {
        StaticMusic.addToQueue(message.guild.id, "https://www.youtube.com/watch?v=dQw4w9WgXcQ")
        message.member.voiceChannel.join().then( (connection) => {
            StaticMusic.playMusic(message.guild.id, connection)
        })
    }
}