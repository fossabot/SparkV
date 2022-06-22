import Discord from "discord.js";

const logger = require("@utils/logger");

export default {
	once: false,
	async execute(bot: any, event: any) {
		await logger(`Warning! - ${event}`, "warn");
	},
};
