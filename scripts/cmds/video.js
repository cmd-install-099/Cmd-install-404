const { GoatWrapper } = require("fca-liane-utils");
const fetch = require("node-fetch");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const ytSearch = require("yt-search");

module.exports = {
	config: {
		name: "video",
		version: "0.0.1",
		author: "ArYAN",
		countDown: 5,
		role: 0,
		shortDescription: "video janne kyun tanveer evan ",
		longDescription: "(p) video lappa lappa",
		category: "VIDEO",
		guide: ""
	},

  onStart: async function ({ api, event, args }) {
    let songName, type;

    if (
      args.length > 1 &&
      (args[args.length - 1] === "video" || args[args.length - 1] === "video")
    ) {
      type = args.pop();
      songName = args.join(" ");
    } else {
      songName = args.join(" ");
      type = "video";
    }

    const processingMessage = await api.sendMessage(
      "☏︎:𝐅𝐢𝐧𝐝𝐢𝐧𝐠 𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐢𝐧𝐠 𝐕𝐢𝐝𝐞𝐨...⌫",
      event.threadID,
      null,
      event.messageID
    );

    try {
      
      const searchResults = await ytSearch(songName);
      if (!searchResults || !searchResults.videos.length) {
        throw new Error("Not found");
      }

      
      const topResult = searchResults.videos[0];
      const videoId = topResult.videoId;

      
      const apiKey = "priyansh-here";
      const apiUrl = `https://priyansh-ai.onrender.com/youtube?id=${videoId}&type=${type}&apikey=${apiKey}`;

      api.setMessageReaction("⌛", event.messageID, () => {}, true);

      
      const downloadResponse = await axios.get(apiUrl);
      const downloadUrl = downloadResponse.data.downloadUrl;

      const response = await fetch(downloadUrl);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch song. Status code: ${response.status}`
        );
      }

      
      const filename = `${topResult.title}.${type === "video" ? "mp4" : "mp4"}`;
      const downloadPath = path.join(__dirname, filename);

      const songBuffer = await response.buffer();


      fs.writeFileSync(downloadPath, songBuffer);

      api.setMessageReaction("✅", event.messageID, () => {}, true);

      await api.sendMessage(
        {
          attachment: fs.createReadStream(downloadPath),
          body: `♲︎︎︎: 𝐏𝐥𝐚𝐲𝐢𝐧𝐠\n☹︎━━━━━━━━━━━━━━━☹︎\n\n📜: 𝐕𝐢𝐝𝐞𝐨 𝐔𝐫𝐋: ${topResult.title}`,
        },
        event.threadID,
        () => {
          fs.unlinkSync(downloadPath);
          api.unsendMessage(processingMessage.messageID);
        },
        event.messageID
      );
    } catch (error) {
      console.error(`Failed to download and send song: ${error.message}`);
      api.sendMessage(
        `Failed to download song: ${error.message}`,
        event.threadID,
        event.messageID
      );
    }
  },
};
const wrapper = new GoatWrapper(module.exports);
wrapper.applyNoPrefix({ allowPrefix: true });
