"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
exports.default = async (content, type, moreData) => {
    if (!content)
        return;
    switch (type) {
        case "log":
            return console.log(`[Info] ${content}`);
        case "warn":
            return console.log(chalk_1.default.yellow(`[Warning] ${content}`));
        case "debug":
            return console.log(chalk_1.default.green(`[Debug] ${content}`));
        case "error":
            console.log(`[Error] ${chalk_1.default.red(process.argv.includes("--dev") === true ? (moreData?.data?.stack || content) : content)}`);
            const bot = global.bot;
            if (process.argv.includes("--dev") === false && bot?.isReady() === true) {
                // const date: Date = new Date();
                // const data = {
                // 	id: Buffer.from((date.getTime()).toString()).toString("base64"),
                // 	error: {
                // 		path: moreData?.data?.path ?? "N/A",
                // 		code: content?.toString()
                // 	},
                // 	data: {
                // 		date,
                // 		timestamp: date.getTime(),
                // 		command: moreData?.interaction ? moreData?.interaction?.commandName?.toLowerCase() || moreData?.interaction?.customId : "N/A",
                // 		user: moreData?.interaction?.user?.id || "N/A"
                // 	}
                // };
                const errorChannel = await bot.channels.fetch("948686231892545547");
                if (errorChannel) {
                    let embed = {
                        title: `${(moreData?.data?.name || content) ?? "Error"}`,
                        description: `**An error occured!**`,
                        fields: [{
                                name: "**Error**",
                                value: `\`\`\`${content}\`\`\``,
                                inline: true
                            }]
                    };
                    moreData?.data?.stack && embed.fields.push({ name: "**Stack**", value: `\`\`\`${moreData?.data.stack}\`\`\``, inline: true });
                    await errorChannel.send({
                        embeds: [embed]
                    });
                }
            }
        case "bot":
            return console.log(`[App] | ${content}`);
        case "web":
            return console.log(`[Web] | ${content}`);
        default:
            return console.log(content);
    }
};
//# sourceMappingURL=logger.js.map