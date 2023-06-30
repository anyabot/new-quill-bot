import { SapphireClient } from '@sapphire/framework';
import { GatewayIntentBits } from 'discord.js';

const client = new SapphireClient({
  intents: [GatewayIntentBits.MessageContent, GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageReactions],
  loadMessageCommandListeners: true,
  defaultPrefix: "&"
});
console.log(process.env.BOT_TOKEN)
client.login(process.env.BOT_TOKEN);