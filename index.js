// KingCh1ll //
// 4/22/2021 //
require("module-alias/register");

async function loader(callback) {
	const loading = ["\\", "|", "/", "-"];
	let num = 0;

	const loader = setInterval(async () => {
		process.stdout.write(`\r${loading[num++]} [App] Loading...`);
		num %= loading.length;
	}, 250);

	setTimeout(async () => {
		clearInterval(loader);
		process.stdout.write(`\r${loading[3]} [App] Loading...`);
		callback();
	}, 5000);
}

loader(async () => {
	console.log(require("chalk").grey("​"));
	console.log(figlet.textSync("SparkV"));

	if (process.argv.includes("--dev") === true) {
		console.log(require("chalk").grey("----------------------------------------"));
		Logger("[DEV] - Developer mode enabled. Some features may not work right on this mode.");
		console.log(require("chalk").grey("----------------------------------------"));
	}

	checkForUpdate();

	if (process.version.slice(1, 3) - 0 < 16) {
		console.log(require("chalk").grey("----------------------------------------"));
		Logger("WARNING - VERSION_ERROR => UNSUPPORTED NODE.JS VERSION. PLEASE UPGRADE TO v16.6");
		console.log(require("chalk").grey("----------------------------------------"));
		return;
	}

	start();
});

// Libarys //
const fs = require("fs");
const path = require("path");

const discord = require("discord.js");
const Sentry = require("@sentry/node");
const mongoose = require("mongoose");
const axios = require("axios");
const figlet = require(`figlet`);

// Varibles //
const Config = require("./globalconfig.json");
const Logger = require("./modules/logger");
const PackageInfo = require("./package.json");

// Functions //
async function checkForUpdate() {
	try {
		const tag_name = await axios.get("https://api.github.com/repos/Ch1ll-Studio/SparkV/releases/latest").then(response => response.data.tag_name);

		if (Number(tag_name.slice(1)) > Number(PackageInfo.version)) {
			console.log(require("chalk").grey("----------------------------------------"));
			await Logger("WARNING - UPDATE_AVAILABLE => PLEASE UPDATE TO THE LATEST VERSION", "warn");
			console.log(require("chalk").grey("----------------------------------------"));
		}
	} catch (err) {
		console.log(require("chalk").grey("----------------------------------------"));
		await Logger(`WARNING - UPDATE_CHECK_ERROR => FAILED TO CHECK FOR UPDATE. ${err}`, "warn");
		console.log(require("chalk").grey("----------------------------------------"));
	}
}

async function start() {
	require("dotenv").config();

	if (process.env.SENTRYTOKEN) {
		Sentry.init({
			dsn: process.env.SENTRYTOKEN,
			release: `${PackageInfo.name}@${PackageInfo.version}`
		});
	} else {
		Logger("WARNING - NO API KEY FOR SENTRY! SPARKV MAY BREAK WITHOUT SENTRY LOGGING KEY.", "warn");
	}

	if (process.env.MONGOOSEURL) {
		await mongoose.connect(process.env.MONGOOSEURL, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		});
	} else {
		Logger("WARNING - NO API KEY FOR MONGOOSE! SPARKV MAY BREAK WITHOUT MONGODB KEY.", "warn");
	}

	mongoose.connection.on("error", console.error.bind(console, "Database connection error!"));
	mongoose.connection.on("open", () => Logger("DATABASE - ONLINE"));

	process.on("warning", async warning => await Logger(`${warning.name} - ${warning.message}`, "warn"));
	process.on("exit", async code => await Logger(`Process exited with code ${code}.`, "error"));
	process.on("uncaughtException", async err => await Logger(`Unhandled exception error. ${err.stack}.`, "error"));
	process.on("unhandledException", async err => await Logger(`Unhandled exception error. ${err.stack}.`, "error"));
	process.on("unhandledRejection", async err => await Logger(`Unhandled rejection error. ${err}.`, "error"));

	process.env.MainDir = __dirname;

	if (Config.sharding.shardingEnabled === true) {
		const manager = new discord.ShardingManager("./bot/bot.js", {
			token: process.env.TOKEN,
			totalShards: Config.sharding.totalShards || "auto",
			shardArgs: [...process.argv, ...["--sharding"]],
			execArgv: [...process.argv, ...["--trace-warnings"]]
		});

		// Shard Handlers //
		manager.on("shardCreate", Shard => {
			console.log(require("chalk").green(`DEPLOYING - SHARD ${Shard.id}/${manager.totalShards} DEPLOYING`));

			Shard.on("ready", () => {
				console.log(
					require("chalk").blue(`DEPLOY SUCCESS - SHARD ${Shard.id}/${manager.totalShards} DEPLOYED SUCCESSFULLY`)
				);
			});

			Shard.on("disconnect", event => {
				Logger("Fatal", err, {
					shard: Shard.id
				});

				console.log(
					require("chalk").red(`SHARD DISCONNECTED - SHARD ${Shard.id}/${manager.totalShards} DISCONNECTED. ${event}`)
				);
			});

			Shard.on("reconnecting", () => {
				console.log(require("chalk").red(`SHARD RECONNECTING - SHARD ${Shard.id}/${manager.totalShards} RECONNECTING`));
			});

			Shard.on("death", event => {
				Logger(err, "error", {
					shard: Shard.id
				});

				console.log(require("chalk").red(`SHARD CLOSED - SHARD ${Shard.id}/${manager.totalShards} UNEXPECTEDLY CLOSED! PID: ${event.pid} Code: ${event.exitCode}.`));

				if (!event.exitCode) console.warn(`WARNING: SHARD ${Shard.id}/${manager.totalShards} EXITED DUE TO LACK OF AVAILABLE MEMORY.`);
			});
		});

		manager.spawn();
	} else {
		await require("./bot/bot");
	}
}
