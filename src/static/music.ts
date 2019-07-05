import * as Discord from "discord.js";
import ytdl = require('ytdl-core');
const queue: Discord.Collection<string, {queue:string[],dispatcher?:any}>  = new Discord.Collection()
export function GetQueueFromID(guildID: string): {queue:string[],dispatcher?:any} | undefined {
    createQueue(guildID)
    return queue.get(guildID)
}
export function createQueue(guildID: string) : void {
    if (!queue.has(guildID)) {
        queue.set(guildID, {
            queue: []
        }) 
    }
}
export function shiftQueue(guildID: string) {
    createQueue(guildID)
    queue.get(guildID)!.queue.shift()
}
export function addToQueue(guildID: string, musicURL: string) {
    createQueue(guildID)
    queue.get(guildID)!.queue.push(musicURL)
}
export function playMusic(guildID: string, connection: Discord.VoiceConnection) {
    createQueue(guildID)
    if (queue.get(guildID)!.queue.length < 1) {
        connection.disconnect();
    }
    if (queue.get(guildID)!.queue[0] !== undefined) {
        if (ytdl.validateURL(queue.get(guildID)!.queue[0])) {
            queue.get(guildID)!.dispatcher = connection.playStream(ytdl(queue.get(guildID)!.queue[0], {
                filter: "audioonly"
            }))
            queue.get(guildID)!.queue.shift();
            queue.get(guildID)!.dispatcher.on("end", () => {
                if (!queue.get(guildID!).queue) return;
                if (queue.get(guildID)!.queue[0]) {
                    playMusic(guildID, connection)
                    return;
                } else {
                    connection.disconnect();
                }
            })
        } else {
            queue.get(guildID)!.queue.shift()
            playMusic(guildID, connection)
        }
    } else {
        queue.get(guildID)!.queue.shift()
        playMusic(guildID, connection)
    }
}
export function getGlobalQueue() {
    return queue
}