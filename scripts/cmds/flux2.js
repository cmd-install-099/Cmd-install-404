const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports = {
  config: {
    name: "flux2",
    author: "ArYan 🐔",
    version: "3.1",
    cooldowns: 5,
    role: 0,
    category: "IMAGE",
    guide: "{pn} <prompt>",
  },
  onStart: async function ({ message, args, api, event }) {
    const prompt = args.join(" ");
    const permission = global.GoatBot.config.DEV;
 if (!permission.includes(event.senderID)) {
 api.sendMessage("❌ | Only Arafat's user can use the command", event.threadID, event.messageID);
 return;
 }


    if (!prompt) {
      return api.sendMessage("👀 Please provide a prompt.", event.threadID);
    }

    api.sendMessage("⏳ Generating your imagination....", event.threadID, event.messageID);

    try {
      const imagineApiUrl = `https://upol-meaw-meaw-fluxx.onrender.com/flux?prompt=${encodeURIComponent(prompt)}`;

      const imagineResponse = await axios.get(imagineApiUrl, {
        responseType: "arraybuffer"
      });

      const cacheFolderPath = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheFolderPath)) {
        fs.mkdirSync(cacheFolderPath);
      }
      const imagePath = path.join(cacheFolderPath, `${Date.now()}_generated.png`);
      fs.writeFileSync(imagePath, Buffer.from(imagineResponse.data, "binary"));

      const stream = fs.createReadStream(imagePath);
      api.sendMessage({
        body: "",
        attachment: stream
      }, event.threadID, () => {
        fs.unlinkSync(imagePath);
      });
    } catch (error) {
      console.error("Error:", error);
      api.sendMessage("❌ | An error occurred. Please try again later.", event.threadID, event.messageID);
    }
  }
}
