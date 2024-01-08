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
var stat_exports = {};
__export(stat_exports, {
  StatCommand: () => StatCommand
});
module.exports = __toCommonJS(stat_exports);
var import_framework = require("@sapphire/framework");
var import_functions = require("../functions");
var import_axios = __toESM(require("axios"));
var import_cheerio = require("cheerio");
var import_discord2 = require("discord.js");
var bonus = {
  PEV: "Physical Attack Evasion",
  PAD: "Post-Attack Delay",
  SCD: "Skill Cooldown",
  SDI: "Skill Duration",
  PRC: "Piercing Attack"
};
class StatCommand extends import_framework.Command {
  static {
    __name(this, "StatCommand");
  }
  constructor(context, options) {
    super(context, { ...options });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      (builder) => builder.setName("stat").setDescription("Search unit's stats").addStringOption(
        (option) => option.setName("unit").setDescription("The unit for search stats for").setRequired(true)
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
    const link2 = `https://aigis.fandom.com/wiki/${encodeURI(unit)}/stats`;
    import_axios.default.get(link).then((res) => {
      const $2 = (0, import_cheerio.load)(res.data);
      unit = $2(".mw-page-title-main").text();
      const link22 = `https://aigis.fandom.com/wiki/${encodeURI(unit)}/stats`;
      import_axios.default.get(link22).then((res2) => {
        const $ = (0, import_cheerio.load)(res2.data);
        var check = false;
        let img;
        const pages = [];
        let table_rows = $(".listtable.bgwhite tr");
        let embed;
        let row1;
        let row2;
        let aff;
        table_rows.each(function(index) {
          let start_col;
          let temp = $(this);
          if (index < 2)
            return;
          if (index >= table_rows.length - 2)
            return;
          if (index == 2)
            start_col = 1;
          else
            start_col = 0;
          if (index % 2 == 0)
            row1 = [];
          else
            row2 = [];
          let new_img = temp.find("img").attr("data-src");
          if (!new_img || !new_img.includes("static.wikia.nocookie.net"))
            new_img = temp.find("img").attr("src");
          if (new_img && new_img.includes("static.wikia.nocookie.net")) {
            img = new_img;
            start_col += 1;
          }
          temp.find("td").each((index2, element) => {
            if (index2 >= start_col) {
              if (index % 2 == 0)
                row1.push(
                  $(element).html().replaceAll(/<[^>]*>/g, "\n").replaceAll(/\n+/g, "\n").trim()
                );
              else
                row2.push(
                  $(element).html().replaceAll(/<[^>]*>/g, "\n").replaceAll(/\n+/g, "\n").trim()
                );
            }
          });
          if (row1.length > 9)
            aff = row1[9];
          if (index % 2 == 1) {
            check = true;
            embed = new import_discord2.EmbedBuilder();
            let send_img = img?.split("/scale-to-width-down/")[0];
            embed.setTitle(unit);
            send_img ? embed.setThumbnail(send_img) : null;
            embed.setURL(link);
            embed.addFields(
              {
                name: "Class",
                value: `${row1[0].replaceAll(/\n+/g, " ")} (${row1[1]} \u2192 ${row2[0]})`,
                inline: true
              },
              {
                name: "HP",
                value: `${row1[2]} \u2192 ${row2[1]}`,
                inline: true
              },
              {
                name: "ATK",
                value: `${row1[3]} \u2192 ${row2[2]}`,
                inline: true
              },
              {
                name: "DEF",
                value: `${row1[4]} \u2192 ${row2[3]}`,
                inline: true
              },
              {
                name: "MR",
                value: row1[5],
                inline: true
              },
              {
                name: "Block",
                value: row1[6].replaceAll(/\n+/g, " "),
                inline: true
              },
              {
                name: "Range",
                value: row2[4].replaceAll(/\n+/g, " / "),
                inline: true
              },
              {
                name: "Cost",
                value: `${row1[7]} \u2192 ${row1[8]}`,
                inline: true
              },
              {
                name: "Affection Bonus",
                value: affe(aff),
                inline: true
              }
            );
            pages.push(embed);
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
        console.error(err, link22);
      });
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
  StatCommand
});
