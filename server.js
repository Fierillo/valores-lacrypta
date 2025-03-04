import { config } from "dotenv";
import { Client, GatewayIntentBits } from "discord.js";
import { createServer } from 'http';

const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMembers, 
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.MessageContent
  ]
});
let isUpdating = false;

config();

// Create a simple HTTP server to receive cron-job requests
createServer((req, res) => {
  console.log(`Request received: ${req.url} from ${req.headers['user-agent']}`);
  if (req.url === '/update-title') {
    updateValue();
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`Estamos en el ${getLaCryptaValue()}`);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
}).listen(3000);

// return La Crypta value based on the current month
const getLaCryptaValue = () => {
  /*return "🔧 | MES TEST2"*/;
  const lacryptaValues = [
    "🤍 | MES DE LA HONESTIDAD",
    "🤝 | MES DE LA SINERGIA",
    "🐍 | MES DE LA LIBERTAD",
    "🧠 | MES DE LA RACIONALIDAD",
    "🧎‍♂️ | MES DE LA HUMILDAD",
    "🏅 | MES DEL MERITO",
    "💡 | MES DE LA INNOVACIÓN",
  ];

  // Necessary to coordinate 12 months with 7 values
  const startYear = 2025;
  const startMonth = 0;
  const now = new Date();
  const localDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/Buenos_Aires' }));
  const currentYear = localDate.getFullYear();
  const currentMonth = localDate.getMonth();

  const monthsPassed = (currentYear - startYear) * 12 + (currentMonth - startMonth);
  const lacryptaIndex = monthsPassed % lacryptaValues.length;

  return lacryptaValues[lacryptaIndex];
};

// Bot ready event
client.once("ready", () => {
  console.log(`${client.user.tag} bot is alive!`);
  setTimeout(updateValue, 2100);
  //setInterval(updateValue, 60 * 1000);
});

// Update value of the bot's nickname
async function updateValue() {
  // Prevent overlapping updates
  if (isUpdating) return; 
  isUpdating = true;
  try {
    const guild = client.guilds.cache.get(process.env.DISCORD_SERVER_ID);
    if (!guild) {
      console.log('Server not found');
      return;
    }

    // Get the bot's member object
    const botMember = guild.members.me; 
    // Get the new value
    const newValue = getLaCryptaValue();
    const currentValue = botMember.nickname || botMember.user.username;

    // If value is the same, exit
    if (currentValue === newValue) {
      console.log('Value is the same, exiting...');
      return;
    }

    // Verify that the new nickname is within the 32-character limit
    if (newValue.length > 32) {
      console.log('Bot nickname is too long, truncating...');
      await botMember.setNickname(newValue.slice(0, 32));
    } else {
      await botMember.setNickname(newValue);
    } 
    console.log('Value updated to:', newValue);
    const channel = guild.channels.cache.get(process.env.DISCORD_CHANNEL_ID);
    if (channel && channel.isTextBased()) await channel.send(`# ¡EL ${newValue} HA COMENZADO!`);
  } catch (error) {
    console.error(`Error: Couldn't update value: ${error}`);
  } finally {
    isUpdating = false;
  }

  // Shut down the bot after 5 seconds
  setTimeout(() => {
    client.destroy();
    process.exit(0);
  }, 5000);
}

/*async function updateChannelTitle() {
  try {
    const channel = await client.channels.fetch(channelId);
    if (channel) {
      const newName = getLaCryptaValue();
      await channel.setName(newName);
      console.log(`Value update to: ${newName}`);
    } else {
      console.log('Channel not found');
    }
  } catch (error) {
    console.error('Error in updateChannelTitle():', error);
  }
  // Turn off the bot after 5 seconds
  setTimeout(() => {
    client.destroy();
    process.exit(0);
  }, 5000);
}*/

client.login(process.env.DISCORD_BOT_TOKEN);