const fs = require('fs');

module.exports = {
  config: {
    name: "file",
    version: "5.1.0",
    author: "𝖠𝗋𝖸𝖺𝗇 🐔",
    countDown: 5,
    role: 2,
    shortDescription: "Send bot script",
    longDescription: "Send bot specified file ",
    category: "ARAFAT",
    guide: "{pn} file name."
  },

  onStart: async function ({ message, args, api, event }) {
    const fileName = args[0];
    const permission = global.GoatBot.config.vipUser;
 if (!permission.includes(event.senderID)) {
 api.sendMessage("❌ | Only Arafat's boss user can use the command", event.threadID, event.messageID);
 return;
			}
    if (!fileName) {
      return api.sendMessage("😛 Please provide a file name.", event.threadID, event.messageID);
    }

    const fileArYan = __dirname + `/${fileName}.js`;
    if (!fs.existsSync(fileArYan)) {
      return api.sendMessage(`File not found: ${fileName}.js`, event.threadID, event.messageID);
    }

    const fileContent = fs.readFileSync(fileArYan, 'utf8');
    api.sendMessage({ body: fileContent }, event.threadID);
  }
};
