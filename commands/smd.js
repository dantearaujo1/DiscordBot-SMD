const { SlashCommandBuilder } = require('discord.js');

const smdCommand = new SlashCommandBuilder().setName('smd').setDescription('Fala sobre o smd!');

module.exports = {
  data:smdCommand,
  async execute(interaction){
    await interaction.deferReply();
    await interaction.editReply(":hearts: SMD é amor! :hearts:")
  }
}
