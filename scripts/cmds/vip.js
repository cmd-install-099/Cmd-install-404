const { GoatWrapper } = require("fca-liane-utils");
const { config } = global.GoatBot;
const { writeFileSync } = require("fs-extra");

module.exports = {
	config: {
		name: "vip",
		version: "5.1.0",
		author: "ArYaN",
		countDown: 5,
		role: 2,
		description: "Add, remove, edit vip role",
		category: "ARAFAT",
		guide: ' {pn} [add | -a] <uid | @tag>: Add Vip role for user'
				+ '\n	 {pn} [remove | -r] <uid | @tag>: Remove vip role of user'
				+ '\n	 {pn} [list | -l]: List all vips'
	},

	langs: {
		en: {
			added: "✅ | Added Vip role for %1 users:\n%2",
			alreadyVip: "\n⚠ | %1 users already have Vip role:\n%2",
			missingIdAdd: "⚠ | Please enter ID or tag user to add Vip role",
			removed: "✅ | Removed Vip role of %1 users:\n%2",
			notVip: "⚠ | %1 users don't have Vip role:\n%2",
			missingIdRemove: "⚠ | Please enter ID or tag user to remove Vip role",
			listVip: "👑 | List of Vips:\n%1"
		}
	},

	onStart: async function ({ message, args, usersData, event, getLang, api }) {
 // Check if user has DEV permission
 const permission = global.GoatBot.config.DEV;
 if (!permission.includes(event.senderID)) {
 api.sendMessage("❌ | Only bot's Dev user can use the command", event.threadID, event.messageID);
 return;
 }

		switch (args[0]) {
			case "add":
			case "-a": {
				if (args[1]) {
					let uids = [];
					if (Object.keys(event.mentions).length > 0)
						uids = Object.keys(event.mentions);
					else if (event.messageReply)
						uids.push(event.messageReply.senderID);
					else
						uids = args.filter(arg => !isNaN(arg));
					const notAdminIds = [];
					const AdminIds = [];
					for (const uid of uids) {
						if (config.vipUser.includes(uid))
							adminIds.push(uid);
						else
							notAdminIds.push(uid);
					}

					config.vipUser.push(...notVipIds);
					const getNames = await Promise.all(uids.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));
					writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));
					return message.reply(
						(notAdminIds.length > 0 ? getLang("added", notAdminIds.length, getNames.map(({ uid, name }) => `• ${name} (${uid})`).join("\n")) : "")
						+ (adminIds.length > 0 ? getLang("alreadyVip", adminIds.length, adminIds.map(uid => `• ${uid}`).join("\n")) : "")
					);
				}
				else
					return message.reply(getLang("missingIdAdd"));
			}
			case "remove":
			case "-r": {
				if (args[1]) {
					let uids = [];
					if (Object.keys(event.mentions).length > 0)
						uids = Object.keys(event.mentions)[0];
					else
						uids = args.filter(arg => !isNaN(arg));
					const notAdminIds = [];
					const AdminIds = [];
					for (const uid of uids) {
						if (config.vipUser.includes(uid))
							adminIds.push(uid);
						else
							notAdminIds.push(uid);
					}
					for (const uid of adminIds)
						config.vipUser.splice(config.vipUser.indexOf(uid), 1);
					const getNames = await Promise.all(vipIds.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));
					writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));
					return message.reply(
						(adminIds.length > 0 ? getLang("removed", adminIds.length, getNames.map(({ uid, name }) => `• ${name} (${uid})`).join("\n")) : "")
						+ (notAdminIds.length > 0 ? getLang("notVip", notAdminIds.length, notAdminIds.map(uid => `• ${uid}`).join("\n")) : "")
					);
				}
				else
					return message.reply(getLang("missingIdRemove"));
			}
			case "list":
			case "-l": {
				const getNames = await Promise.all(config.vipUser.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));
				return message.reply(getLang("listVip", getNames.map(({ uid, name }) => `• ${name} (${uid})`).join("\n")));
			}
			default:
				return message.SyntaxError();
		}
	}
};
const wrapper = new GoatWrapper(module.exports);
  wrapper.applyNoPrefix({ allowPrefix: true });          
