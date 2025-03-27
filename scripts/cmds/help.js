const { GoatWrapper } = require('fca-liane-utils');
 const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;
const doNotDelete = "[ 🐐 | Goat Bot V2 ]";

module.exports = {
    config: {
        name: "help",
        version: "1.18",
        author: "NTKhang x Kyle x Symer(MRKIMSTER)",
        countDown: 5,
        role: 0,
        shortDescription: {
            vi: "Xem cách dùng lệnh",
            en: "View command usage"
        },
        longDescription: {
            vi: "Xem cách sử dụng của các lệnh",
            en: "View command usage"
        },
        category: "info",
        guide: {
            en: "{pn} [empty | <page number> | <command name>]"
                + "\n   {pn} <command name> [-u | usage | -g | guide]: only show command usage"
                + "\n   {pn} <command name> [-i | info]: only show command info"
                + "\n   {pn} <command name> [-r | role]: only show command role"
                + "\n   {pn} <command name> [-a | alias]: only show command alias"
        },
        priority: 1
    },

    langs: {
        en: {
            help: "📜 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗟𝗜𝗦𝗧\n\n%1\n\n» Page: %2/%3\n» Use =help [page number] to display the information on the additional pages.",
            commandNotFound: "Command \"%1\" does not exist",
            getInfoCommand: "『 %1 』\nView the details of the commands.\n\n   •  Version: %2\n   •  Category: %3\n   •  Cooldown: %4\n   •  Permission: %5\n   •  Creator: %6\n\nUsage:\n   •  %7",
            onlyInfo: "『 Info 』\nCommand name: %1\nDescription: %2\nOther names: %3\nOther names in your group: %4\nVersion: %5\nRole: %6\nTime per command: %7s\nAuthor: %8",
            onlyUsage: "『 Usage 』\n%1",
            onlyAlias: "『 Alias 』\nOther names: %1\nOther names in your group: %2",
            onlyRole: "『 Role 』\n%1",
            doNotHave: "Do not have",
            roleText0: "0 (All users)",
            roleText1: "1 (Group administrators)",
            roleText2: "2 (Admin bot)",
            roleText0setRole: "0 (set role, all users)",
            roleText1setRole: "1 (set role, group administrators)",
            pageNotFound: "Page %1 does not exist"
        }
    },

    onStart: async function ({ message, args, event, threadsData, getLang, role }) {
        const langCode = await threadsData.get(event.threadID, "data.lang") || global.GoatBot.config.language;
        let customLang = {};
        const pathCustomLang = path.normalize(`${process.cwd()}/languages/cmds/${langCode}.js`);
        if (fs.existsSync(pathCustomLang))
            customLang = require(pathCustomLang);

        const { threadID } = event;
        const threadData = await threadsData.get(threadID);
        const prefix = getPrefix(threadID);
        const commandName = (args[0] || "").toLowerCase();
        const command = commands.get(commandName) || commands.get(aliases.get(commandName));

        // ———————————————— LIST ALL COMMANDS ——————————————— //
        if (!command && !args[0] || !isNaN(args[0])) {
            const arrayInfo = [];
            let msg = "";
            const page = parseInt(args[0]) || 1;
            const numberOfOnePage = 10;
            for (const [name, value] of commands) {
                if (value.config.role > 1 && role < value.config.role)
                    continue;
                let describe = name;
                let shortDescription;
                const shortDescriptionCustomLang = customLang[name]?.shortDescription;
                if (shortDescriptionCustomLang != undefined)
                    shortDescription = checkLangObject(shortDescriptionCustomLang, langCode);
                else if (value.config.shortDescription)
                    shortDescription = checkLangObject(value.config.shortDescription, langCode);
                if (shortDescription)
                    describe += `: ${cropContent(shortDescription.charAt(0).toUpperCase() + shortDescription.slice(1))}`;
                arrayInfo.push({
                    data: describe,
                    priority: value.priority || 0
                });
            }

            arrayInfo.sort((a, b) => a.data.localeCompare(b.data)); // sort by name
            arrayInfo.sort((a, b) => a.priority > b.priority ? -1 : 1); // sort by priority
            const { allPage, totalPage } = global.utils.splitPage(arrayInfo, numberOfOnePage);
            if (page < 1 || page > totalPage)
                return message.reply(getLang("pageNotFound", page));

            const returnArray = allPage[page - 1] || [];
            const startNumber = (page - 1) * numberOfOnePage + 1;
            msg += (returnArray || []).reduce((text, item, index) => text += `『 ${index + startNumber} 』 =${item.data}\n`, '').slice(0, -1);
            await message.reply(getLang("help", msg, page, totalPage, commands.size, prefix, doNotDelete));
        }
        //
