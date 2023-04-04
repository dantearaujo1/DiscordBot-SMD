const { SlashCommandBuilder } = require('discord.js');

const pingCommand = new SlashCommandBuilder().setName('ping').setDescription('Check if this interaction is responsive');

module.exports = {
  data: pingCommand,
  async execute(interaction){
    await interaction.deferReply();
    await interaction.editReply( 'Pong!' );
  }
}
