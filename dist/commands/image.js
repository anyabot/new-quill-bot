var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var image_exports = {};
__export(image_exports, {
  ImageCommand: () => ImageCommand
});
module.exports = __toCommonJS(image_exports);
var import_framework = require("@sapphire/framework");
var import_functions = require("../functions");
var import_axios = __toESM(require("axios"));
var import_cheerio = require("cheerio");
var import_discord2 = require("discord.js");
class ImageCommand extends import_framework.Command {
  static {
    __name(this, "ImageCommand");
  }
  constructor(context, options) {
    super(context, { ...options });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      (builder) => builder.setName("image").setDescription("Search unit's image").addStringOption(
        (option) => option.setName("unit").setDescription("The unit for search images for").setRequired(true)
      )
    );
  }
  async chatInputRun(interaction) {
    await interaction.deferReply();
    const text = interaction.options.getString("unit");
    if (!text)
      return interaction.followUp("No unit name");
    const unit = (0, import_functions.nameChange)(text);
    const link = `https://aigis.fandom.com/wiki/${encodeURI(unit)}`;
    import_axios.default.get(link).then((res) => {
      const $ = (0, import_cheerio.load)(res.data);
      var check = false;
      let img;
      const pages = [];
      var page = 1;
      $(".thumb a img").each(function(index) {
        let temp = $(this);
        if (temp.attr("title").includes("Render")) {
          img = temp.attr("data-src");
          let nam = temp.attr("alt") || "";
          let pa = nam.split(" Render");
          if (img && pa.length > 1) {
            nam = pa[0];
            check = true;
            let embed = new import_discord2.EmbedBuilder();
            img = img.split("/scale-to-width-down/")[0];
            embed.setTitle(nam);
            embed.setImage(img);
            embed.setURL(link);
            pages.push(embed);
          }
        }
      });
      if (check) {
        (0, import_functions.sendPages)(interaction, pages);
      }
      if (!check) {
        interaction.followUp("Can't find anything");
      }
    }).catch((err) => {
      interaction.followUp("Can't find anything");
      console.error(err, link);
    });
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ImageCommand
});
