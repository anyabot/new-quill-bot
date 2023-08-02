import { SapphireClient } from '@sapphire/framework';
import { GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv'
dotenv.config()

const client = new SapphireClient({
  intents: [GatewayIntentBits.MessageContent, GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageReactions],
  loadMessageCommandListeners: true,
  defaultPrefix: "&"
});
(async () => {
console.log(process.env.BOT_TOKEN)
await client.login(process.env.BOT_TOKEN);
console.log("HERE?")
})()