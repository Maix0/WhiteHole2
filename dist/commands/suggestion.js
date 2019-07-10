"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const https = __importStar(require("https"));
const gitHubToken = require("../json/config.json").github;
module.exports = {
    name: 'suggestion',
    description: 'Suggest something to the dev',
    permission: [],
    usage: "<your suggestion>",
    aliases: [],
    async execute(message, args) {
        let options = {
            hostname: 'api.github.com',
            port: 443,
            path: '/repos/Maix0/WhiteHole2/issues',
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "token " + gitHubToken,
                "User-Agent": "Maix0-WhiteHoleBot"
            },
        };
        let issue = JSON.stringify({
            title: `[UserSuggestion]${message.author.username}(${message.author.id}) at ${new Date()}`,
            body: args.join(" "),
            labels: [
                "userSuggestion"
            ]
        });
        var req = https.request(options, (res) => {
            console.log('statusCode:', res.statusCode);
            console.log('headers:', res.headers);
            res.on('data', (d) => {
                process.stdout.write(d);
            });
        });
        req.on('error', (e) => {
            console.error(e);
        });
        req.write(issue);
        req.end();
    }
};
