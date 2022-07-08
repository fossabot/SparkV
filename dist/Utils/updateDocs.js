"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// A special thanks to markdown-table for this awesome code.
// https://github.com/wooorm/markdown-table/
// They switched to ESM only, so I can no longer use their package.
function markdown(table) {
    const rowLength = table.length;
    const alignment = [];
    const rule = [];
    let cellCount = 0;
    let rowIndex = -1;
    let sizes = [];
    let align;
    let rows;
    let row;
    let cells;
    let index;
    let position;
    let size;
    let value;
    let spacing;
    let before;
    let after;
    while (++rowIndex < rowLength) {
        row = table[rowIndex];
        index = -1;
        if (row.length > cellCount)
            cellCount = row.length;
        while (++index < cellCount) {
            position = row[index] && dotindex(row[index]);
            if (!sizes[index])
                sizes[index] = 3;
            if (position > sizes[index])
                sizes[index] = position;
        }
    }
    // Make sure only valid alignments are used.
    index = -1;
    while (++index < cellCount) {
        align = alignment[index];
        if (align !== "l" && align !== "r" && align !== "c" && align !== ".")
            align = "";
        alignment[index] = align;
    }
    rowIndex = -1;
    // eslint-disable-next-line prefer-const
    rows = [];
    while (++rowIndex < rowLength) {
        row = table[rowIndex];
        index = -1;
        cells = [];
        while (++index < cellCount) {
            value = row[index];
            if (alignment[index] === ".") {
                position = dotindex(value);
                size = sizes[index] + (/\./.test(value) ? 0 : 1) - (String(value).length - position);
                cells[index] = value + pad(size - 1);
            }
            else {
                cells[index] = value;
            }
        }
        rows[rowIndex] = cells;
    }
    sizes = [];
    rowIndex = -1;
    while (++rowIndex < rowLength) {
        cells = rows[rowIndex];
        index = -1;
        while (++index < cellCount) {
            value = cells[index];
            if (!sizes[index])
                sizes[index] = 3;
            size = String(value).length;
            if (size > sizes[index])
                sizes[index] = size;
        }
    }
    rowIndex = -1;
    while (++rowIndex < rowLength) {
        cells = rows[rowIndex];
        index = -1;
        while (++index < cellCount) {
            value = cells[index];
            position = sizes[index] - (String(value).length || 0);
            spacing = pad(position);
            if (alignment[index] === "r" || alignment[index] === ".") {
                value = spacing + value;
            }
            else if (alignment[index] === "c") {
                position /= 2;
                if (position % 1 === 0) {
                    before = position;
                    after = position;
                }
                else {
                    before = position + 0.5;
                    after = position - 0.5;
                }
                value = pad(before) + value + pad(after);
            }
            else {
                value += spacing;
            }
            cells[index] = value;
        }
        rows[rowIndex] = cells.join(" | ");
    }
    index = -1;
    while (++index < cellCount) {
        spacing = sizes[index];
        align = alignment[index];
        value = align === "r" || align === "" ? "-" : ":";
        value += pad(spacing - 2, "-");
        value += align !== "l" && align !== "" ? ":" : "-";
        rule[index] = value;
    }
    rows.splice(1, 0, rule.join(" | "));
    return `| ${rows.join(" |\n| ")}" |`;
}
function pad(length, character) {
    return new Array(length + 1).join(character || " ");
}
function dotindex(value) {
    const match = /\.[^.]*$/.exec(value);
    return match ? match.index + 1 : value.length;
}
exports.default = {
    /**
   * Update the docs
   * @param {Object} bot The SparkV bot Instance.
   * @param {Dirname} MainDir The main directory.
   */
    update(bot) {
        let cmdCount = 0;
        bot.commands.each((cmd) => ++cmdCount);
        let baseText = `# Commands\n\nSparkV's Command List! SparkV contains more than **${cmdCount} commands**!\n`;
        let cmdTable = [];
        bot.categories
            .sort((a, b) => bot.commands.filter((c) => c.category === a).length > bot.commands.filter((c) => c.category === b).length ? -1 : 1)
            .forEach((cat) => {
            const info = [];
            info.push(["Name", "Description", "Usage", "Cooldown"]);
            if (!cmdTable?.[cat.name])
                cmdTable[cat.name] = [];
            bot.commands
                .filter((cmd) => cmd.category === cat.name)
                .sort((a, b) => a.settings.name < b.settings.name ? -1 : 1)
                .forEach((cmd) => {
                cmdTable?.[cat.name]?.push({
                    name: cmd.settings?.name || "Untitled Command",
                    description: cmd.settings.description || "No description for this command",
                    usage: cmd.settings.usage.replaceAll("<", "(").replaceAll(">", ")") || "",
                    cooldown: `${Math.ceil(cmd.settings.cooldown / 1000)} seconds`
                });
                info.push([
                    `**${cmd.settings.name || "Command name invalid."}**`,
                    cmd.settings.description || "No description for this command",
                    cmd.settings.usage.replaceAll("<", "(").replaceAll(">", ")") || "",
                    `${Math.ceil(cmd.settings.cooldown / 1000)} seconds`
                ]);
            });
            baseText += `${markdown(info)}\n`;
        });
        fs_1.default.writeFileSync(path_1.default.join(`${path_1.default.join(__dirname, "..", "..")}/docs/commands.md`), baseText);
        fs_1.default.writeFileSync(path_1.default.join(`${path_1.default.join(__dirname, "..", "..")}/docs/commandsdata.json`), JSON.stringify(cmdTable));
    }
};
//# sourceMappingURL=updateDocs.js.map