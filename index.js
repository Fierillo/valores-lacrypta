const { config } = require("dotenv");
const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const channelId = process.env.DISCORD_CHANNEL_ID; // replace with channel ID

client.login(process.env.DISCORD_TOKEN);

// Load environment variables from .env file
config();

// La Crypta values
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
  
  // Defines baseline of the index
  const startYear = 2025; // Start year
  const startMonth = 0; // 0 = January

  // Get current date
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0 = enero, 11 = diciembre

  // Get cumulative months since baseline
  const monthsPassed =
    (currentYear - startYear) * 12 + (currentMonth - startMonth);

  // Uses module to return a ciclic index
  const lacryptaIndex = monthsPassed % lacryptaValues.length;

  // Return correspondent value
  return lacryptaValues[lacryptaIndex];
};

client.on("ready", () => {
  console.log(`Bot ${client.user.tag} starting...`);
  
  setInterval(() => {
    //console.log(`setInterval working...`);
    const today = new Date();
    const localDate = new Date(today.toLocaleString('en-US', { timeZone: 'America/Buenos_Aires' }));
    if (localDate.getDate() === 1) {
      //console.log(`daycheck working...`);
      const channel = client.channels.cache.get(channelId);
      if (channel) {
        //console.log(`channel check working...`);
        const newName = getLaCryptaValue();
        channel
          .setName(newName)
          .then((newChannel) =>
            console.log(`Now we are in the: ${newChannel.name}`)
          )
          .catch(console.error);
      }
    }
  }, 24 * 60 * 60 * 1000); // 1 day interval
});

// Required to avoid that proyect go to "sleep"
const http = require("http");
http
  .createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(`Bot working\nWe are in: ${getLaCryptaValue()}`);
  })
  .listen(3000);
