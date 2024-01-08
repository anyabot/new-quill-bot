var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var import_framework = require("@sapphire/framework");
var import_discord = require("discord.js");
var import_dotenv = __toESM(require("dotenv"));
import_dotenv.default.config();
const client = new import_framework.SapphireClient({
  intents: [import_discord.GatewayIntentBits.MessageContent, import_discord.GatewayIntentBits.Guilds, import_discord.GatewayIntentBits.GuildMessages, import_discord.GatewayIntentBits.DirectMessages, import_discord.GatewayIntentBits.DirectMessageReactions],
  loadMessageCommandListeners: true,
  defaultPrefix: "&"
});
(async () => {
  console.log(process.env.BOT_TOKEN);
  await client.login("NjAwMTM3ODk1ODE4Mjk3MzY0.G5pRLn.MPKDUl1GScSUgIHQBnlf-gTS-JNb3RbL61aHQE");
  console.log("HERE?");
})();
