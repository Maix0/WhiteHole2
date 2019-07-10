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
module.exports = {
    name: 'skip',
    description: 'Skip current music',
    permission: [],
    usage: " ",
    aliases: [],
    async execute(message, args) {
        MusicStatic.shiftQueue(message.guild.id);
        message.channel.send("Music skipped");
    }
};
