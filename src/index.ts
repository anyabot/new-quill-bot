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
await client.login("NjAwMTM3ODk1ODE4Mjk3MzY0.G5pRLn.MPKDUl1GScSUgIHQBnlf-gTS-JNb3RbL61aHQE");
console.log("HERE?")
})()