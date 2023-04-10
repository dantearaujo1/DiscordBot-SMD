const { SlashCommandBuilder } = require('discord.js');
const {google}       = require('googleapis');
const gApi = require('../sheets');
const config = require('../config.json');
require('datejs');


const scheduleCommand = new SlashCommandBuilder().setName('agendar').setDescription('Agenda a próxima data para a mentoria');
scheduleCommand.addStringOption( option => option.setName('dia').setDescription('Escolhe se prefere terça ou sábado') );
scheduleCommand.addStringOption( option => option.setName('motivo').setDescription('Diga o motivo da sua dúvida') );

function getNextClass(next){
  let data = new Date();
  if (next){
    const myRegexExpTer = /^(ter(ç|c)?a?)/i;
    const myRegexExpSab = /^(\bsab(?:ado)?\b)/i;
    if (myRegexExpTer.test(next)){
      data = data.next().tuesday();
    }
    else if (myRegexExpSab.test(next)){
      data = data.next().saturday();
    }
    return data;
  }

  let daynumber = data.getDay();
  if ( daynumber < 3){
    data = new Date.today().next().tuesday();
  }
  else if (daynumber === 3 && data.getHours() < 16 ) {
    data = new Date.today();
  }
  else if (daynumber < 6 && daynumber >= 3) {
    data = new Date.today().next().saturday();
  }
  else if (daynumber === 6 && data.getHours() < 10){
    data = new Date.today();
  }
  else{
    data = new Date.today().next().tuesday();
  }
  return data;
}

module.exports = {
  data: scheduleCommand,
  async execute(interaction){
    await interaction.deferReply();
    const auth = await gApi.authorize();
    const userName = interaction.member.displayName;
    const betterDay = interaction.options.getString('dia') ?? null;
    const reason = interaction.options.getString('motivo') ?? 'Nenhum motivo informado';
    const sheets = google.sheets({version:'v4', auth});

    const getValuesResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: config.spreadsheet_id,
      range:'A:C',
    })
    const values = getValuesResponse.data.values || [];
    let nextDay = ''

    if (!betterDay){
      nextDay = getNextClass().toString("dd/MM/yy");
    }
    else{
      nextDay = getNextClass(betterDay).toString("dd/MM/yy");
    }

    const newRow = [[userName,"",nextDay, "", values[values.length], "", reason ]];

    await sheets.spreadsheets.values.update({
      spreadsheetId: config.spreadsheet_id,
      valueInputOption:'USER_ENTERED',
      range:`A${values.length + 1}`,
      resource: {
        values:newRow,
      }
    })
    await interaction.editReply( `${userName} foi agendado para o próximo tira-dúvidas no dia ${nextDay}` );
  }
}
