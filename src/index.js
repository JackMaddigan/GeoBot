require("dotenv").config();
const cron = require("node-cron");
const { Client, IntentsBitField } = require("discord.js");
const registerCommands = require("./commands");
const {
  handleListMaps,
  handleAddMap,
  handleRemoveMap,
  handleDailyChallenge,
} = require("./daily-challenge");
const client = new Client({
  intents: [IntentsBitField.Flags.Guilds],
});

client.on("ready", async (bot) => {
  console.log(bot.user.username + " is online!");
  try {
    // await registerCommands(client);
  } catch (error) {
    console.error(error);
  }
});

client.on("interactionCreate", async (int) => {
  try {
    switch (int.commandName) {
      case "add-map":
        await handleAddMap(int);
        break;
      case "remove-map":
        await handleRemoveMap(int);
        break;
      case "list-maps":
        await handleListMaps(int);
        break;
      default:
        break;
    }
  } catch (error) {
    console.error(error);
  }
});

// Send links every 8am UTC
cron.schedule("0 8 * * *", async () => {
  try {
    await handleDailyChallenge(client);
  } catch (error) {
    console.log(error);
  }
});

client.login(process.env.BOT_TOKEN);
