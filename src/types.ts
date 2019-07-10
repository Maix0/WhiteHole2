interface Schema {
    readonly _id: any
}
import * as Discord from "discord.js"

export interface UserData extends Schema {
    _id: any,
    guildID: string,
    userID: string,
    pointsModule: {
        level: number,
        points: number,
        lastMessage: number
    }
}

export interface config {
    readonly _dbusername: any;
    readonly _dbpassword: any;
    readonly _dbname: any;
    readonly _DataBaseURL: any;
    readonly _PREFIX: string,
    readonly _TOKEN: string,
    readonly _PointsDelay: number
}


export interface Ranks extends Schema {
        guildID: string,
        roleID: string,
        points: number
}
export interface Command {
    permission: string[],
    name: string
    description: string,
    aliases: string[],
    usage: string,
    execute: Function
}

export interface DiscordBot extends Discord.Client {
    commands : Discord.Collection<string, Command>
}


export interface PermsList {
    [permission: string] : number,
}

export interface Perms extends Schema {
    guildId: string,
    userID :string, 
    permission: number
}

