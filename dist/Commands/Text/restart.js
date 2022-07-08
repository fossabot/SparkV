"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
let restarting = false;
const command_1 = __importDefault(require("../../structures/command"));
async function execute(bot, message, args, command, data) {
    if (restarting === true)
        return;
    let Timer = 5;
    const RestartStatus = await message.replyT(`⚡ | SparkV is now preparing for restart. Time left: ${Timer} seconds.`);
    setInterval(() => {
        --Timer;
        if (Timer > 0) {
            if (restarting === true)
                return;
            RestartStatus.edit(`⚡ | SparkV is now preparing for restart. Time left: ${Timer} seconds.`);
        }
        else {
            if (restarting === true)
                return;
            RestartStatus.edit(`⚡ | SparkV is now restarting.`)
                .then((msg) => {
                restarting = true;
                bot.destroy();
            })
                .then(async () => {
                bot.login(process.env.TOKEN);
                RestartStatus.edit("⚡ | Restart complete!");
            });
        }
    }, 1 * 1000);
}
exports.default = new command_1.default(execute, {
    description: `This is an owner only command.`,
    aliases: [],
    dirname: __dirname,
    usage: `<coins>`,
    ownerOnly: true
});
//# sourceMappingURL=restart.js.map