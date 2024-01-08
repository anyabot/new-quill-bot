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
var class_exports = {};
__export(class_exports, {
  ClassCommand: () => ClassCommand
});
module.exports = __toCommonJS(class_exports);
var import_framework = require("@sapphire/framework");
var import_functions = require("../functions");
var import_axios = __toESM(require("axios"));
var import_cheerio = require("cheerio");
var import_discord2 = require("discord.js");
var import_striptags = __toESM(require("striptags"));
var bonus = {
  PEV: "Physical Attack Evasion",
  PAD: "Post-Attack Delay",
  SCD: "Skill Cooldown",
  SDI: "Skill Duration",
  PRC: "Piercing Attack"
};
class ClassCommand extends import_framework.Command {
  static {
    __name(this, "ClassCommand");
  }
  constructor(context, options) {
    super(context, { ...options });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      (builder) => builder.setName("class").setDescription("Search unit's classes").addStringOption(
        (option) => option.setName("unit").setDescription("The unit for search classes for").setRequired(true)
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
      import_axios.default.get(link2).then((res2) => {
        const $2 = (0, import_cheerio.load)(res2.data);
        var check = false;
        let img;
        const pages = [];
        let table_rows = $2(".listtable.bgwhite tr");
        let embed;
        let des = "";
        let note = "";
        let des_len = 0;
        let note_len = 0;
        let d = {};
        $(".gcstyle.bgwhite.hsbullet.class-table tbody tr").each(
          (index, element) => {
            let temp = $(element);
            if (temp.find("td").first().text().trim()) {
              let curr = 1;
              if (des_len)
                des_len -= 1;
              else {
                curr += 1;
                des = format_note(
                  temp.find(`td:nth-child(${curr})`).html() || ""
                );
                des_len = Number(
                  temp.find(`td:nth-child(${curr})`).attr("rowspan")
                ) - 1;
              }
              if (note_len)
                note_len -= 1;
              else {
                curr += 1;
                if (temp.children().length < curr) {
                  note = "";
                  note_len = 0;
                } else {
                  note = format_note(
                    temp.find(`td:nth-child(${curr})`).html() || ""
                  );
                  note_len = Number(
                    temp.find(`td:nth-child(${curr})`).attr("rowspan")
                  ) - 1;
                }
              }
            }
            d[temp.find("td").first().text().trim()] = { des, note };
          }
        );
        console.log(d);
        table_rows.each(function(index) {
          let start_col;
          let temp = $2(this);
          if (index < 2)
            return;
          if (index >= table_rows.length - 2)
            return;
          if (index % 2 != 0)
            return;
          if (index == 2)
            start_col = 1;
          else
            start_col = 0;
          let new_img = temp.find("img").attr("data-src");
          if (!new_img || !new_img.includes("static.wikia.nocookie.net"))
            new_img = temp.find("img").attr("src");
          if (new_img && new_img.includes("static.wikia.nocookie.net")) {
            img = new_img;
            start_col += 1;
          }
          let class_name = "";
          temp.find("td").each((index2, element) => {
            if (index2 == start_col) {
              class_name = $2(element).html().replaceAll(/<[^>]*>/g, "\n").replaceAll(/\n+/g, " ").trim();
            }
          });
          let { des: des2, note: note2 } = d[class_name];
          check = true;
          embed = new import_discord2.EmbedBuilder();
          let send_img = img?.split("/scale-to-width-down/")[0];
          embed.setTitle(unit);
          send_img ? embed.setThumbnail(send_img) : null;
          embed.setURL(link);
          embed.addFields(
            { name: "Class Name", value: class_name },
            { name: "Description", value: des2 }
          );
          note2 ? embed.addFields({ name: "Notes", value: note2 }) : null;
          pages.push(embed);
        });
        if (check) {
          (0, import_functions.sendPages)(interaction, pages);
        }
        if (!check) {
          interaction.followUp("Can't find anything");
        }
      }).catch((err) => {
        interaction.followUp("Can't find anything");
        console.error(err, link2);
      });
    }).catch((err) => {
      interaction.followUp("Can't find anything");
      console.error(err, link);
    });
  }
}
function format_note(output) {
  output = (0, import_striptags.default)(output, "<br>");
  output = output.replace(/<[^>]*>/g, "\n");
  output = output.replace(/\n+ /g, "\n");
  output = output.trim();
  var arr = output.split("\n");
  var filtered = arr.filter(function(el) {
    return el != null && el != "";
  });
  var na = filtered[0];
  let i = 1;
  while (i < filtered.length) {
    na = na + "\n" + filtered[i];
    i++;
  }
  return na;
}
__name(format_note, "format_note");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ClassCommand
});
