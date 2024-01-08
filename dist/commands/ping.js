var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var ping_exports = {};
__export(ping_exports, {
  PingCommand: () => PingCommand
});
module.exports = __toCommonJS(ping_exports);
var import_framework = require("@sapphire/framework");
class PingCommand extends import_framework.Command {
  static {
    __name(this, "PingCommand");
  }
  constructor(context, options) {
    super(context, {
      ...options,
      name: "ping",
      aliases: ["pong"],
      description: "ping pong"
    });
  }
  async messageRun(message) {
    const msg = await message.channel.send("Ping?");
    const content = `Pong from JavaScript! Bot Latency ${Math.round(this.container.client.ws.ping)}ms. API Latency ${msg.createdTimestamp - message.createdTimestamp}ms.`;
    return msg.edit(content);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PingCommand
});
