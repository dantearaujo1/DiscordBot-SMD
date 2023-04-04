const fs             = require('fs');
const path           = require('node:path');
const process        = require('process');
const dotenv         = require('dotenv')
const gApi = require('./sheets')

dotenv.config();


const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');

const TOKEN = process.env.DISCORD_TOKEN;

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

const commandsPath = path.join(__dirname,'commands');
const commandFiles = fs.readdirSync(commandsPath).filter( file => file.endsWith('.js') );

for (const file of commandFiles){
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);

  if ('data' in command && 'execute' in command){
    client.commands.set(command.data.name,command);
  } else {
    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`)
  }
}

const eventsPath = path.join(__dirname,'events');
const eventsFiles = fs.readdirSync(eventsPath).filter( file => file.endsWith('.js') );
for (const file of eventsFiles){
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);

  if (event.once){
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}


// Log in to Discord with your client's token
client.login(TOKEN);
