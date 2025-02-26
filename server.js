import { config } from "dotenv";
import { Client, GatewayIntentBits } from "discord.js";
import { createServer } from 'http';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const channelId = process.env.DISCORD_CHANNEL_ID;

config();

// Create a simple HTTP server to receive requests
createServer((req, res) => {
  console.log(`Solicitud recibida: ${req.url} desde ${req.headers['user-agent']}`);
  if (req.url === '/update-title') {
    updateChannelTitle();
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`Estamos en el ${getLaCryptaValue()}`);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
}).listen(3000);

const getLaCryptaValue = () => {
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

client.once("ready", () => {
  console.log(`Bot ${client.user.tag} iniciado...`);
});

async function updateChannelTitle() {
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
}

client.login(process.env.DISCORD_TOKEN);