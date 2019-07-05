"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const MusicStatic = __importStar(require("../static/music"));
const ytdl = require("ytdl-core");
module.exports = {
    name: 'play',
    description: 'Play music from yt url',
    permission: [],
    usage: "<youtube url>",
    aliases: [],
    async execute(message, args) {
        if (!args[0] || !ytdl.validateURL(args[0])) {
            return message.channel.send(`usage :\`${this.usage}\``);
        }
        if (!message.member.voiceChannel) {
            return message.channel.send("You need to be in a voice channel !");
        }
        MusicStatic.addToQueue(message.guild.id, args[0]);
        if (!message.guild.voiceConnection) {
            let voiceConnection = await message.member.voiceChannel.join();
            if (!voiceConnection) {
                return message.channel.send("Error, can't join voice channel");
            }
            MusicStatic.playMusic(message.guild.id, voiceConnection);
        }
    }
};
