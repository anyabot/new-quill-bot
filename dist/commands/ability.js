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
var ability_exports = {};
__export(ability_exports, {
  AbilityCommand: () => AbilityCommand
});
module.exports = __toCommonJS(ability_exports);
var import_framework = require("@sapphire/framework");
var import_functions = require("../functions");
var import_axios = __toESM(require("axios"));
var import_cheerio = require("cheerio");
var import_discord2 = require("discord.js");
class AbilityCommand extends import_framework.Command {
  static {
    __name(this, "AbilityCommand");
  }
  constructor(context, options) {
    super(context, { ...options });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      (builder) => builder.setName("ability").setDescription("Search unit's abilities").addStringOption(
        (option) => option.setName("unit").setDescription("The unit for search abilities for").setRequired(true)
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
      let aw_img;
      const pages = [];
      var page = 1;
      let ability_name = $(".abilitynormal td:nth-child(1)").text().split("(edit info)")[0];
      if (ability_name) {
        let des = $(".abilitynormal td:nth-child(2)").text().trim() || "";
        let note = $(".abilitynormal td:nth-child(4)").text().trim() || "";
        $(".thumb a img").each(function(index) {
          let temp = $(this);
          if (temp.attr("title").includes("Icon")) {
            if (img)
              return;
            temp.attr("data-src") ? img = temp.attr("data-src") : null;
          }
        });
        if (img) {
          check = true;
          let embed = new import_discord2.EmbedBuilder();
          img = img.split("/scale-to-width-down/")[0];
          embed.setTitle(`${unit}'s Ability`);
          embed.setThumbnail(img);
          embed.setURL(link);
          embed.addFields({
            name: ability_name,
            value: des
          });
          if (note)
            embed.addFields({
              name: "Notes",
              value: note
            });
          pages.push(embed);
        }
      }
      let aw_ability_name = $(".abilityupgrade td:nth-child(1)").text().split("(edit info)")[0];
      if (aw_ability_name) {
        let des = $(".abilityupgrade td:nth-child(2)").text().trim() || "";
        let note = $(".abilityupgrade td:nth-child(4)").text().trim() || "";
        $(".thumb a img").each(function(index) {
          let temp = $(this);
          if (temp.attr("title").includes("AW Icon")) {
            if (aw_img)
              return;
            aw_img = temp.attr("data-src");
          }
        });
        if (!aw_img)
          aw_img = img;
        if (aw_img) {
          check = true;
          let embed = new import_discord2.EmbedBuilder();
          aw_img = aw_img.split("/scale-to-width-down/")[0];
          embed.setTitle(`${unit}'s Awakened Ability`);
          embed.setThumbnail(aw_img);
          embed.setURL(link);
          embed.addFields({
            name: aw_ability_name,
            value: des
          });
          if (note)
            embed.addFields({
              name: "Notes",
              value: note
            });
          pages.push(embed);
        }
      }
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
  AbilityCommand
});
