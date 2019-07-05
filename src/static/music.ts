import * as Discord from "discord.js";
import ytdl = require('ytdl-core'); 
const queue: /* {[guildID:string]: {queue:string[], dispatcher: any}} */ any = {}
module.exports = {
    GetQueueFromID(guildID: string): any[] {
        if (queue[guildID]) {
            this.createQueue(guildID)
        }
        return queue[guildID].queue
    },
    createQueue(guildID: string) {
        if (!queue[guildID]) {
            queue[guildID].queue = {queue: (<string[]>[])}
        }
    },
    shiftQueue(guildID: string) {
        if (!queue[guildID]) {
            this.createQueue(guildID)
        }
        queue[guildID].queue.shift()
    },
    addToQueue(guildID: string, musicURL: string) {
        if (!queue[guildID]) {
            this.createQueue(guildID)
        }
        queue[guildID].queue.push(musicURL)
    },
    playMusic(guildID: string, connection: Discord.VoiceConnection) {
        if (queue[guildID].queue.length < 1) {
            connection.disconnect();
        }
        if (queue[guildID].queue[0] !== undefined) {
            if (ytdl.validateURL(queue[guildID].queue[0])) {
                queue[guildID].dispatcher = connection.playStream(ytdl(queue[guildID].queue[0], {
                    filter: "audioonly"
                }))
                queue[guildID].queue.shift();
                queue[guildID].dispatcher.on("end", () => {
                    if (!queue[guildID].queue) return;
                    if (queue[guildID].queue[0]) {
                        this.playMusic(connection)
                        return;
                    } else {
                        connection.disconnect();
                        delete queue[guildID];
                    }
                })
            } else {
                queue[guildID].queue.shift()
                this.playMusic(connection)
            }
        } else {
            queue[guildID].queue.shift()
            this.playMusic(connection)
        }
    },
    getQueue(){
        return queue
    }
}