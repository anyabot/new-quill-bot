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
var skill_exports = {};
__export(skill_exports, {
  SkillCommand: () => SkillCommand
});
module.exports = __toCommonJS(skill_exports);
var import_framework = require("@sapphire/framework");
var import_functions = require("../functions");
var import_axios = __toESM(require("axios"));
var import_cheerio = require("cheerio");
var import_discord2 = require("discord.js");
class SkillCommand extends import_framework.Command {
  static {
    __name(this, "SkillCommand");
  }
  constructor(context, options) {
    super(context, { ...options });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      (builder) => builder.setName("skill").setDescription("Search unit's skills").addStringOption(
        (option) => option.setName("unit").setDescription("The unit for search skills for").setRequired(true)
      )
    );
  }
  async chatInputRun(interaction) {
    await interaction.deferReply();
    const text = interaction.options.getString("unit");
    if (!text)
      return interaction.followUp("No unit name");
    let unit = (0, import_functions.nameChange)(text);
    const link = `https://aigis.fandom.com/wiki/${encodeURI(unit)}`;
    import_axios.default.get(link).then((res) => {
      const $ = (0, import_cheerio.load)(res.data);
      unit = $(".mw-page-title-main").text();
      const link2 = `https://aigis.fandom.com/wiki/${encodeURI(unit)}/stats`;
      let check = false;
      const pages = [];
      let img = $(".wikitable.sawlistbegin tbody tr td div a img").attr(
        "data-src"
      );
      if (!img || !img.includes("static.wikia.nocookie.net"))
        img = $(".wikitable.sawlistbegin tbody tr td div a img").attr("src");
      if (img) {
        check = true;
        img = img.split("/scale-to-width-down/")[0];
        let s1 = [];
        $(".wikitable.sawlistbegin .sawpre").map(
          (index, el) => s1.push(
            $(el).html().replaceAll(/<[^>]*>/g, "\n").replaceAll(/\n+/g, "\n").trim()
          )
        );
        let s2 = [];
        $(".wikitable.sawlistbegin .sawpost").map(
          (index, el) => s2.push(
            $(el).html().replaceAll(/<[^>]*>/g, "\n").replaceAll(/\n+/g, "\n").trim()
          )
        );
        pages.push(createEmbed(img, unit, link, s1, "Normal Skill"));
        pages.push(createEmbed(img, unit, link, s2, "Awakened Skill"));
      }
      if (check) {
        (0, import_functions.sendPages)(interaction, pages);
      } else {
        interaction.followUp("Only SAW for now");
      }
    }).catch((err) => {
      interaction.followUp("Can't find anything");
      console.error(err, link);
    });
  }
}
function createEmbed(img, unit, link, skills, text) {
  let embed = new import_discord2.EmbedBuilder();
  embed.setTitle(`${unit}'s ${text}`);
  embed.setThumbnail(img);
  embed.setURL(link);
  let i = 0;
  while (i + 4 <= skills.length) {
    let nam = skills[i];
    let des = skills[i + 1].replaceAll(/\n+/g, " ");
    let cd = skills[i + 2].replaceAll(/\n+/g, "/");
    let ini = skills[i + 3].replaceAll(/\n+/g, "/");
    embed.addFields([
      {
        name: nam,
        value: `${des}
CD:${cd}
Initial:${ini}`
      }
    ]);
    i += 4;
  }
  return embed;
}
__name(createEmbed, "createEmbed");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SkillCommand
});
