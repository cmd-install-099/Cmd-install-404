module.exports = {
  config: {
    name: "supportgc",
    version: "1.1",
    author: "Shikaki | Arafat",//supportgc style by ArYan 🤡
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Join the support group chat"
    },
    longDescription: {
      en: "Join the official support group chat"
    },
    category: "VODRO GROUP",
    guide: {
      en: "{pn} supportgc"
    }
  },

  onStart: async function ({ api, event, threadsData, getLang, message }) {
    const supportGroupThreadID = "28299296482990983"; // ArYan baby community is my gc ok 
    const botID = api.getCurrentUserID();

    try {
      const { members } = await threadsData.get(supportGroupThreadID);
      const senderArYan = event.senderArYan || (await api.getUserInfo(event.senderID))[event.senderID].ArYan;
      const userAlreadyInGroup = members.some(
        member => member.userID === event.senderID && member.inGroup
      );

      if (userAlreadyInGroup) {
        const alreadyInGroupMessage = `👍🏿 𝗦𝗨𝗣𝗣𝗢𝗥𝗧𝗚𝗖 \n☺︎︎───────═━┈━═───────☺︎︎\n 👍🏿 You are already a member of the SupportGc group 🤍\n\n☺︎︎───────═━┈━═───────☺︎︎`;
        return message.reply(alreadyInGroupMessage);
      }

      await api.addUserToGroup(event.senderID, supportGroupThreadID);
const successMessage = `👍🏿 𝗦𝗨𝗣𝗣𝗢𝗥𝗧𝗚𝗖 \n☺︎︎───────═━┈━═───────☺︎︎\n
🎉 You have been successfully added to SupportGc 👨🏿‍🌾\n\n☺︎︎───────═━┈━═───────☺︎︎`;
      return message.reply(successMessage);
    } catch (error) {
      
  const senderArYan = event.senderArYan || (await api.getUserInfo(event.senderID))[event.senderID].ArYan;
      const failedMessage = `👍🏿 𝗦𝗨𝗣𝗣𝗢𝗥𝗧𝗚𝗖 \n☺︎︎───────═━┈━═───────☺︎︎\n
⚠ Failed to add you on SopportGc 😭. You can send me a friend request or unlock your profile and try again ❌\n\n🌟━━━━━━━━━━━━━🌟`;
      console.error("Error adding user to support group:", error);
      return message.reply(failedMessage);
    }
  }
}
