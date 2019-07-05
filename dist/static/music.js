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
const ytdl = require("ytdl-core");
const queue = new Discord.Collection();
function GetQueueFromID(guildID) {
    createQueue(guildID);
    return queue.get(guildID);
}
exports.GetQueueFromID = GetQueueFromID;
function createQueue(guildID) {
    if (!queue.has(guildID)) {
        queue.set(guildID, {
            queue: [],
        });
    }
}
exports.createQueue = createQueue;
function shiftQueue(guildID) {
    createQueue(guildID);
    queue.get(guildID).dispatcher.end();
}
exports.shiftQueue = shiftQueue;
function addToQueue(guildID, musicURL) {
    createQueue(guildID);
    queue.get(guildID).queue.push(musicURL);
}
exports.addToQueue = addToQueue;
function playMusic(guildID, connection) {
    createQueue(guildID);
    if (queue.get(guildID).queue.length < 1) {
        connection.disconnect();
    }
    if (queue.get(guildID).queue[0] !== undefined) {
        if (ytdl.validateURL(queue.get(guildID).queue[0])) {
            queue.get(guildID).dispatcher = connection.playStream(ytdl(queue.get(guildID).queue[0], {
                filter: "audioonly"
            }));
            queue.get(guildID).queue.shift();
            queue.get(guildID).dispatcher.on("end", () => {
                if (!queue.get(guildID).queue)
                    return;
                if (queue.get(guildID).queue[0]) {
                    playMusic(guildID, connection);
                    return;
                }
                else {
                    connection.disconnect();
                    return;
                }
            });
        }
        else {
            queue.get(guildID).queue.shift();
            playMusic(guildID, connection);
        }
    }
    else {
        queue.get(guildID).queue.shift();
        playMusic(guildID, connection);
    }
    return;
}
exports.playMusic = playMusic;
function getGlobalQueue() {
    return queue;
}
exports.getGlobalQueue = getGlobalQueue;
function deleteQueue(guildID) {
    createQueue(guildID);
    queue.get(guildID).queue = [];
    if (queue.get(guildID).dispatcher) {
        queue.get(guildID).dispatcher.end();
    }
}
exports.deleteQueue = deleteQueue;
