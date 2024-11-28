const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");

async function registerCommands(client) {
  try {
    const addMapCommand = new SlashCommandBuilder()
      .setName("add-map")
      .setDescription("Add a map for the daily challenge")
      .setDefaultMemberPermissions(PermissionsBitField.Flags.KickMembers)
      .addStringOption((option) =>
        option
          .setName("map-id")
          .setDescription("The last part of the URL of the map")
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName("map-name")
          .setDescription(
            "Name of the map you want to be displayed eg. A Community World (ACW)"
          )
          .setRequired(true)
      )
      .addIntegerOption((option) =>
        option
          .setName("seconds-per-round")
          .setDescription("How many seconds per round")
          .setRequired(true)
      )
      .addBooleanOption((option) =>
        option.setName("moving").setDescription("True/false").setRequired(true)
      )
      .addBooleanOption((option) =>
        option.setName("panning").setDescription("True/false").setRequired(true)
      )
      .addBooleanOption((option) =>
        option.setName("zooming").setDescription("True/false").setRequired(true)
      );

    const removeMapCommand = new SlashCommandBuilder()
      .setName("remove-map")
      .setDefaultMemberPermissions(PermissionsBitField.Flags.KickMembers)
      .setDescription("Remove a map from the daily challenge")
      .addIntegerOption((option) =>
        option
          .setName("id")
          .setRequired(true)
          .setDescription("ID from listing the maps (not the map ID)")
      );

    const listMapsCommand = new SlashCommandBuilder()
      .setName("list-maps")
      .setDefaultMemberPermissions(PermissionsBitField.Flags.KickMembers)
      .setDescription("List all maps for the daily challenge");

    // Register the slash commands
    await client.application.commands.set([
      addMapCommand,
      removeMapCommand,
      listMapsCommand,
    ]);
    console.log("Slash commands registered successfully.");
  } catch (error) {
    console.error("Failed to register slash commands:", error);
  }
}

module.exports = registerCommands;
