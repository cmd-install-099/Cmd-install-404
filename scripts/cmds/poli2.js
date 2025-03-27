const axios = require('axios');
const { getStreamFromURL } = global.utils;

module.exports = {
  config: {
    name: "poli2",
    version: "1.0",
    author: "Redwan | Anthony apis",
    countDown: 0,
    longDescription: {
      en: "Dive into the world of Polinations: where imagination blooms into iconic anime art and cyberpunk worlds.",
    },
    category: "IMAGE",
    role: 2,
    guide: {
      en: "{pn} <prompt>",
    },
  },

  onStart: async function ({ api, event, args, message }) {
    const prompt = args.join(' ').trim();

    if (!prompt) {
      return message.reply("🌟 *A universe of Polinations awaits.* Share your prompt to summon vibrant new worlds from your imagination.");
    }

    message.reply("✨ *Creating your Polination...* Hold tight as the transformation unfolds!", async (err, info) => {
      if (err) return console.error(err);

      try {
        const apiUrl = `https://anthony-poli-apis.onrender.com/generate?prompt=${encodeURIComponent(prompt)}`;
        const response = await axios.get(apiUrl);
        const { collage, images } = response.data;

        if (!collage || !images || !images.length) {
          return message.reply("🚫 *Polination failed.* The seeds of creation couldn’t grow. Try a new prompt.");
        }

        message.reply(
          {
            body: "🎨 *Your Polination is complete!*\nReply with a number (1, 2, 3, or 4) to explore individual details of your creation.",
            attachment: await getStreamFromURL(collage, "polination_collage.png"),
          },
          (err, info) => {
            if (err) return console.error(err);

            global.GoatBot.onReply.set(info.messageID, {
              commandName: this.config.name,
              messageID: info.messageID,
              author: event.senderID,
              images,
            });
          }
        );
      } catch (error) {
        console.error(error);
        message.reply("💥 *Polination failed.* Something went wrong. Please try again.");
      }
    });
  },

  onStart: async ({ args, message, api, threadModel, userModel, dashBoardModel, globalModel, threadsData, usersData, dashBoardData, globalData, event, commandName, getLang }) => {
		const { unloadScripts, loadScripts } = global.utils;
		const ArYan = global.GoatBot.config.DEV;
 if (!ArYan.includes(event.senderID)) {
 api.sendMessage("❌ | Only Arafaf's boss user can use the command", event.threadID, event.messageID);
 return;
			}

    if (event.senderID !== author) {
      return message.reply("⚠ *Only the Polination summoner may respond.* Please respect the art!");
    }

    if (isNaN(userChoice) || userChoice < 1 || userChoice > images.length) {
      return message.reply(`❌ *Error in Polination.* Choose a number between 1 and ${images.length} to reveal an image.`);
    }

    try {
      const selectedImage = images[userChoice - 1];
      if (!selectedImage) {
        return message.reply("❌ *Polination interrupted.* Unable to fetch the selected image. Try again.");
      }

      const imageStream = await getStreamFromURL(selectedImage, `polination_image${userChoice}.png`);
      message.reply({
        body: `✨ *Behold your Polinated creation (${userChoice}).* Dive deeper into the art of imagination!`,
        attachment: imageStream,
      });
    } catch (error) {
      console.error(error);
      message.reply("💥 *Polination error.* Something went wrong fetching the image. Please try again.");
    }
  },
};
