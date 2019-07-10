"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const StaticMusic = __importStar(require("../static/music"));
module.exports = {
    name: 'stop',
    description: 'Stop the music',
    permission: [],
    usage: " ",
    aliases: [],
    async execute(message, args) {
        if (!message.guild.voiceConnection) {
            return message.channel.send("Error: not in voice channel");
        }
        StaticMusic.deleteQueue(message.guild.id);
    }
};
