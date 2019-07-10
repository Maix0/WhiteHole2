import * as Discord from "discord.js";
import ytdl = require('ytdl-core');
export enum StreamTypes {
    YOUTUBE = "f",
        SPOTIFY = "s"
}


const queue: Discord.Collection < string, {
    queue: {
        url: string,
        type: StreamTypes
    } [],
    dispatcher ? : any
} > = new Discord.Collection()
export function GetQueueFromID(guildID: string) {
    createQueue(guildID)
    return queue.get(guildID) !
}
export function createQueue(guildID: string): void {
    if (!queue.has(guildID)) {
        queue.set(guildID, {
            queue: [],
        })
    }
}
export function shiftQueue(guildID: string) {
    createQueue(guildID)
    queue.get(guildID) !.dispatcher.end()
}
export function addToQueue(guildID: string, musicURL: string, type: StreamTypes) {
    createQueue(guildID)
    queue.get(guildID) !.queue.push({
        url: musicURL,
        type: type
    })
}
export function playMusic(guildID: string, connection: Discord.VoiceConnection) {
    createQueue(guildID)
    if (queue.get(guildID) !.queue.length < 1) {
        connection.disconnect();
    }
    if (queue.get(guildID) !.queue[0] !== undefined) {
        switch (queue.get(guildID) !.queue[0].type) {
            case StreamTypes.YOUTUBE:
                if (ytdl.validateURL(queue.get(guildID) !.queue[0].url)) {
                    queue.get(guildID) !.dispatcher = connection.playStream(ytdl(queue.get(guildID) !.queue[0].url, {
                        filter: "audioonly"
                    }))
                    queue.get(guildID) !.queue.shift();
                    queue.get(guildID) !.dispatcher.on("end", () => {
                        if (!queue.get(guildID) !.queue) return
                        if (queue.get(guildID) !.queue[0]) {
                            playMusic(guildID, connection)
                            return
                        } else {
                            connection.disconnect();
                            return
                        }
                    })
                } else {
                    queue.get(guildID) !.queue.shift()
                    playMusic(guildID, connection)
                }
                break;
            case StreamTypes.SPOTIFY:
            default:
                queue.get(guildID) !.queue.shift()
                playMusic(guildID, connection)
                break;
        }
    } else {
        queue.get(guildID) !.queue.shift()
        playMusic(guildID, connection)
    }
    return
}
export function getGlobalQueue() {
    return queue
}
export function deleteQueue(guildID: string) {
    createQueue(guildID)
    queue.get(guildID) !.queue = []
    if (queue.get(guildID) !.dispatcher) {
        queue.get(guildID) !.dispatcher.end()
    }
}