const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "flux3",
    aliases: ["flux3"],
    version: "1.0.0",
    author: "Arafat",
    role: 0,
    shortDescription: "Generate an image based on a prompt using flux API created by Lance",
    longDescription: "generate image with flux API created by Lance ",
    category: " IMAGE",
    guide: {
      en: "{pn} <prompt>"
    },
    usages: "/flux <prompt>",
    cooldowns: 5,
    dependencies: {
      "axios": "",
      "fs": "",
      "path": ""
    }
  },
  onStart: async function({ message, api, args, event }) {
    if (args.length === 0) return message.reply("Please provide a prompt to generate an image.");

    const prompt = args.join(" ");
    const apiUrl = `http://158.69.118.209:20147/api/flux?prompt=${encodeURIComponent(prompt)}`;

    try {
      const response = await axios.get(apiUrl);

      if (!response.data || !response.data.imageUrl) {
        return message.reply("Failed to generate image, please try again.");
      }

      const imageUrl = response.data.imageUrl;
      const imagePath = path.resolve(__dirname, 'cache', `${Date.now()}.jpg`);

      const writer = fs.createWriteStream(imagePath);
      const imageResponse = await axios({
        url: imageUrl,
        method: 'GET',
        responseType: 'stream'
      });

      imageResponse.data.pipe(writer);

      writer.on('finish', () => {
        message.reply({
          body: `Here is the generated image for your prompt: "${prompt}"`,
          attachment: fs.createReadStream(imagePath)
        }, () => {
          fs.unlinkSync(imagePath);
        });
      });

      writer.on('error', (err) => {
        message.reply("Error downloading the image.");
      });

    } catch (error) {
      console.error("Error:", error);
      message.reply("An error occurred while processing your request.");
    }
  }
};
