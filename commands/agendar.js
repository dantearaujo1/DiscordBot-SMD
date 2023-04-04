const { SlashCommandBuilder } = require('discord.js');
const {google}       = require('googleapis');
const gApi = require('../sheets');
require('datejs');


const scheduleCommand = new SlashCommandBuilder().setName('agendar').setDescription('Agenda a próxima data para a mentoria');

function getNextClass(day){
  let data = new Date();
  if ( data.getDay() < 3){
    data = new Date.today().next().tuesday();
  }
  else if (data.getDay() === 3 && data.getHours() < 16 ) {
    data = new Date.today().next().tuesday();
  }
  else if (data.getDay() === 6 && data.getHours() < 10){
    data = new Date.today().next().saturday();
  }
  else{
    data = new Date.today().next().saturday();

  }
  return data;
}

module.exports = {
  data: scheduleCommand,
  async execute(interaction){
    await interaction.deferReply();
    const auth = await gApi.authorize();
    const userName = interaction.member.displayName;
    const nextDay = getNextClass(new Date.today()).toString("dd/MM/yy");
    const sheets = google.sheets({version:'v4', auth});

    const getValuesResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range:'A:C',
    })
    const values = getValuesResponse.data.values || [];
    const newRow = [[userName,"",nextDay, "" ]];

    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.SPREADSHEET_ID,
      valueInputOption:'USER_ENTERED',
      range:`A${values.length + 1}`,
      resource: {
        values:newRow,
      }
    })
    await interaction.editReply( `${userName} foi agendado para o próximo tira-dúvidas no dia ${nextDay}` );
  }
}
