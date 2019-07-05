"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ytdl = require("ytdl-core");
const queue = {};
function GetQueueFromID(guildID) {
    if (queue[guildID]) {
        createQueue(guildID);
    }
    return queue[guildID].queue;
}
exports.GetQueueFromID = GetQueueFromID;
function createQueue(guildID) {
    if (!queue[guildID]) {
        queue[guildID] = {
            queue: []
        };
    }
}
exports.createQueue = createQueue;
function shiftQueue(guildID) {
    if (!queue[guildID]) {
        createQueue(guildID);
    }
    queue[guildID].queue.shift();
}
exports.shiftQueue = shiftQueue;
function addToQueue(guildID, musicURL) {
    if (!queue[guildID]) {
        createQueue(guildID);
    }
    queue[guildID].queue.push(musicURL);
}
exports.addToQueue = addToQueue;
function playMusic(guildID, connection) {
    if (queue[guildID].queue.length < 1) {
        connection.disconnect();
    }
    if (queue[guildID].queue[0] !== undefined) {
        if (ytdl.validateURL(queue[guildID].queue[0])) {
            queue[guildID].dispatcher = connection.playStream(ytdl(queue[guildID].queue[0], {
                filter: "audioonly"
            }));
            queue[guildID].queue.shift();
            queue[guildID].dispatcher.on("end", () => {
                if (!queue[guildID].queue)
                    return;
                if (queue[guildID].queue[0]) {
                    playMusic(guildID, connection);
                    return;
                }
                else {
                    connection.disconnect();
                    delete queue[guildID];
                }
            });
        }
        else {
            queue[guildID].queue.shift();
            playMusic(guildID, connection);
        }
    }
    else {
        queue[guildID].queue.shift();
        playMusic(guildID, connection);
    }
}
exports.playMusic = playMusic;
function getQueue() {
    return queue;
}
exports.getQueue = getQueue;
