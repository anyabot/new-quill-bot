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
var search_exports = {};
__export(search_exports, {
  SearchCommand: () => SearchCommand
});
module.exports = __toCommonJS(search_exports);
var import_framework = require("@sapphire/framework");
var import_functions = require("../functions");
var import_axios = __toESM(require("axios"));
var import_cheerio = require("cheerio");
var bonus = {
  PEV: "Physical Attack Evasion",
  PAD: "Post-Attack Delay",
  SCD: "Skill Cooldown",
  SDI: "Skill Duration",
  PRC: "Piercing Attack"
};
class SearchCommand extends import_framework.Command {
  static {
    __name(this, "SearchCommand");
  }
  constructor(context, options) {
    super(context, { ...options });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      (builder) => builder.setName("search").setDescription("Return search results from the wiki").addStringOption(
        (option) => option.setName("keyword").setDescription("The keyword to search for").setRequired(true)
      )
    );
  }
  async chatInputRun(interaction) {
    await interaction.deferReply();
    const text = interaction.options.getString("keyword");
    if (!text)
      return interaction.followUp("No keyword");
    let unit = (0, import_functions.nameChange)(text);
    const link = `https://aigis.fandom.com/wiki/Special:Search?query=${encodeURI(
      text
    )}`;
    import_axios.default.get(link).then((res) => {
      const $ = (0, import_cheerio.load)(res.data);
      var out = "";
      var max = 6;
      for (var i = 1; i < max; i++) {
        var tex = $(
          ".unified-search__results li:nth-child(" + i + ") article h3 a"
        ).text();
        var li = $(
          ".unified-search__results li:nth-child(" + i + ") article h3 a"
        ).attr("href");
        var vid = $(
          ".unified-search__results li:nth-child(" + i + ") h3 a"
        ).text();
        if (tex != null && li != null) {
          out = out + tex.trim() + ": <" + li + ">\n";
        }
        if (vid == "Videos for '" + text + "'") {
          max++;
        }
      }
      if (out != "") {
        interaction.followUp(out);
      } else {
        interaction.followUp("No Result");
      }
    }).catch((err) => {
      interaction.followUp("Can't find anything");
      console.error(err, link);
    });
  }
}
function affe(output) {
  output = output.trim();
  var arr = output.split("\n");
  var filtered = arr.filter(function(el) {
    return el != null && el != "";
  });
  let affection = filtered[0];
  let i = 1;
  while (i < filtered.length) {
    if (bonus[filtered[i]]) {
      affection = affection + "\n" + bonus[filtered[i]] + filtered[i + 1];
      i = i + 2;
    } else if (!isNaN(Number(filtered[i]))) {
      affection = affection + filtered[i];
      i++;
    } else {
      affection = affection + "\n" + filtered[i];
      i++;
    }
  }
  return affection;
}
__name(affe, "affe");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SearchCommand
});
