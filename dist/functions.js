var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
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
var functions_exports = {};
__export(functions_exports, {
  nameChange: () => nameChange,
  sendPages: () => sendPages
});
module.exports = __toCommonJS(functions_exports);
var import_discord = require("discord.js");
var name = require("./library/lib.js").name;
var suffix = require("./library/suf.js").suffix;
function titleCase(str) {
  const str_list = str.toLowerCase().split(" ");
  for (var i = 0; i < str_list.length; i++) {
    if (str_list[i][0] == "(" && str_list[i].length > 1) {
      str_list[i] = "(" + str_list[i].charAt(1).toUpperCase() + str_list[i].slice(2);
    } else {
      str_list[i] = str_list[i].charAt(0).toUpperCase() + str_list[i].slice(1);
    }
  }
  return str_list.join(" ");
}
__name(titleCase, "titleCase");
const nameChange = /* @__PURE__ */ __name(function nameChange2(text) {
  var unit = titleCase(text.toLowerCase());
  unit = unit.replace(/\-[a-z]/g, (match) => match.toUpperCase());
  var np = unit.split(" ");
  var npl = np.length;
  if (npl >= 2) {
    if (np[0] == "Chibi" || np[0] == "C") {
      np = np.slice(1, npl);
      let un = np.join(" ");
      if (name[un]) {
        un = name[un];
      }
      unit = "Chibi " + un;
    } else if (np[npl - 1] == "Chibi" || np[npl - 1] == "C") {
      np = np.slice(0, npl - 1);
      let un = np.join(" ");
      if (name[un]) {
        un = name[un];
      }
      unit = "Chibi " + un;
    }
    if (suffix[np[npl - 1]]) {
      np[npl - 1] = suffix[np[npl - 1]];
      let sur = np[npl - 1];
      np.pop();
      let un = np.join(" ");
      if (name[un]) {
        un = name[un];
      }
      unit = un + " " + sur;
    } else if (np[npl - 1] == "Year" && np[npl - 2] == "New") {
      let sur = "(New Year's)";
      np.pop();
      np.pop();
      let un = np.join(" ");
      if (name[un]) {
        un = name[un];
      }
      unit = un + " " + sur;
    } else if (np[npl - 1] == "Year)" && np[npl - 2] == "(New") {
      let sur = "(New Year's)";
      np.pop();
      np.pop();
      let un = np.join(" ");
      if (name[un]) {
        un = name[un];
      }
      unit = un + " " + sur;
    } else if (np[npl - 1] == "Springs" && np[npl - 2] == "Hot") {
      let sur = "(Hot Springs)";
      np.pop();
      np.pop();
      let un = np.join(" ");
      if (name[un]) {
        un = name[un];
      }
      unit = un + " " + sur;
    } else if (np[npl - 1] == "Springs)" && np[npl - 2].toLowerCase() == "(Hot") {
      let sur = "(Hot Springs)";
      np.pop();
      np.pop();
      let un = np.join(" ");
      if (name[un]) {
        un = name[un];
      }
      unit = un + " " + sur;
    } else if (np[npl - 1] == "Fools'" && np[npl - 2] == "April") {
      let sur = "(April Fools')";
      np.pop();
      np.pop();
      let un = np.join(" ");
      if (name[un]) {
        un = name[un];
      }
      unit = un + " " + sur;
    } else if (np[npl - 1] == "Fools')" && np[npl - 2] == "(April") {
      let sur = "(April Fools')";
      np.pop();
      np.pop();
      let un = np.join(" ");
      if (name[un]) {
        un = name[un];
      }
      unit = un + " " + sur;
    } else if (suffix[np[0]]) {
      np[0] = suffix[np[0]];
      let sur = np[0];
      np = np.slice(1, npl);
      let un = np.join(" ");
      if (name[un]) {
        un = name[un];
      }
      unit = un + " " + sur;
    } else if (np[1] == "Year" && np[0] == "New") {
      let sur = "(New Year's)";
      np = np.slice(2, npl);
      let un = np.join(" ");
      if (name[un]) {
        un = name[un];
      }
      unit = un + " " + sur;
    } else if (np[1] == "Year)" && np[0] == "(New") {
      let sur = "(New Year's)";
      np = np.slice(2, npl);
      let un = np.join(" ");
      if (name[un]) {
        un = name[un];
      }
      unit = un + " " + sur;
    } else if (np[1] == "Springs" && np[0] == "Hot") {
      let sur = "(Hot Springs)";
      np = np.slice(2, npl);
      let un = np.join(" ");
      if (name[un]) {
        un = name[un];
      }
      unit = un + " " + sur;
    } else if (np[1] == "Springs)" && np[0] == "(Hot") {
      let sur = "(Hot Springs)";
      np = np.slice(2, npl);
      let un = np.join(" ");
      if (name[un]) {
        un = name[un];
      }
      unit = un + " " + sur;
    } else if (np[1] == "Fools'" && np[0] == "April") {
      let sur = "(April Fools')";
      np = np.slice(2, npl);
      let un = np.join(" ");
      if (name[un]) {
        un = name[un];
      }
      unit = un + " " + sur;
    } else if (np[1] == "Fools')" && np[0] == "(April") {
      let sur = "(April Fools')";
      np = np.slice(2, npl);
      let un = np.join(" ");
      if (name[un]) {
        un = name[un];
      }
      unit = un + " " + sur;
    }
  }
  if (name[unit])
    unit = name[unit];
  return unit;
}, "nameChange");
const sendPages = /* @__PURE__ */ __name(async function(interaction, pages) {
  if (pages.length == 1) {
    interaction.followUp({
      embeds: [pages[0]]
    });
  } else {
    const backButton = new import_discord.ButtonBuilder().setCustomId("back").setEmoji("\u2B05\uFE0F").setStyle(import_discord.ButtonStyle.Secondary).setDisabled(true);
    const forwardButton = new import_discord.ButtonBuilder().setCustomId("forward").setEmoji("\u27A1\uFE0F").setStyle(import_discord.ButtonStyle.Secondary);
    const firstButton = new import_discord.ButtonBuilder().setCustomId("first").setEmoji("\u23EE\uFE0F").setStyle(import_discord.ButtonStyle.Secondary).setDisabled(true);
    const lastButton = new import_discord.ButtonBuilder().setCustomId("last").setEmoji("\u23ED\uFE0F").setStyle(import_discord.ButtonStyle.Secondary);
    const jumpOptions = new import_discord.StringSelectMenuBuilder().setCustomId("jump").setPlaceholder("Jump to a Page").setOptions(
      pages.map((_, index) => {
        let page_num = String(index + 1);
        return {
          label: `Jump to Page ${page_num}`,
          value: page_num
        };
      })
    );
    var embed = pages[0];
    let page = 1;
    embed = pages[0];
    embed.setFooter({ text: "Page " + page + " of " + pages.length });
    const row = new import_discord.ActionRowBuilder().addComponents(
      firstButton,
      backButton,
      forwardButton,
      lastButton
    );
    const selectRow = new import_discord.ActionRowBuilder().addComponents(
      jumpOptions
    );
    const rows = [selectRow, row];
    const update = /* @__PURE__ */ __name(async (confirmation, embed2) => {
      lastButton.setDisabled(page == pages.length);
      forwardButton.setDisabled(page == pages.length);
      backButton.setDisabled(page == 1);
      firstButton.setDisabled(page == 1);
      await confirmation.update({
        embeds: [embed2],
        components: rows
      });
    }, "update");
    const response = await interaction.followUp({
      embeds: [pages[0]],
      components: rows
    });
    try {
      const collector = await response.createMessageComponentCollector({
        time: 6e5
      });
      collector.on("collect", async (confirmation) => {
        if (confirmation.customId === "back") {
          if (page > 1)
            page -= 1;
          embed = pages[page - 1];
          embed.setFooter({ text: "Page " + page + " of " + pages.length });
          update(confirmation, embed);
        } else if (confirmation.customId === "forward") {
          if (page < pages.length)
            page += 1;
          embed = pages[page - 1];
          embed.setFooter({ text: "Page " + page + " of " + pages.length });
          update(confirmation, embed);
        } else if (confirmation.customId === "first") {
          page = 1;
          embed = pages[page - 1];
          embed.setFooter({ text: "Page " + page + " of " + pages.length });
          update(confirmation, embed);
        } else if (confirmation.customId === "last") {
          page = pages.length;
          embed = pages[page - 1];
          embed.setFooter({ text: "Page " + page + " of " + pages.length });
          update(confirmation, embed);
        } else if (confirmation.customId === "jump") {
          if ("values" in confirmation) {
            page = Number(confirmation.values[0]);
          }
          embed = pages[page - 1];
          embed.setFooter({ text: "Page " + page + " of " + pages.length });
          update(confirmation, embed);
        }
      });
    } catch {
      return;
    }
  }
}, "sendPages");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  nameChange,
  sendPages
});
