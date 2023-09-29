var name = require("./library/lib.js").name;
var suffix = require("./library/suf.js").suffix;
import { Command } from "@sapphire/framework";
import {
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ButtonInteraction,
  StringSelectMenuInteraction,
  CacheType,
  StringSelectMenuBuilder,
} from "discord.js";

function titleCase(str: string) {
  const str_list = str.toLowerCase().split(" ");
  for (var i = 0; i < str_list.length; i++) {
    if (str_list[i][0] == "(" && str_list[i].length > 1) {
      str_list[i] =
        "(" + str_list[i].charAt(1).toUpperCase() + str_list[i].slice(2);
    } else {
      str_list[i] = str_list[i].charAt(0).toUpperCase() + str_list[i].slice(1);
    }
  }
  return str_list.join(" ");
}
export const nameChange = function nameChange(text: string) {
  var unit = titleCase(text.toLowerCase());
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
    } else if (
      np[npl - 1] == "Springs)" &&
      np[npl - 2].toLowerCase() == "(Hot"
    ) {
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
  if (name[unit]) unit = name[unit];
  return unit;
};

export const sendPages = async function (
  interaction: Command.ChatInputCommandInteraction,
  pages: EmbedBuilder[]
) {
  if (pages.length == 1) {
    interaction.followUp({
      embeds: [pages[0]],
    });
  } else {
    const backButton = new ButtonBuilder()
      .setCustomId("back")
      .setEmoji("⬅️")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(true);

    const forwardButton = new ButtonBuilder()
      .setCustomId("forward")
      .setEmoji("➡️")
      .setStyle(ButtonStyle.Secondary);

    const firstButton = new ButtonBuilder()
      .setCustomId("first")
      .setEmoji("⏮️")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(true);

    const lastButton = new ButtonBuilder()
      .setCustomId("last")
      .setEmoji("⏭️")
      .setStyle(ButtonStyle.Secondary);

    const jumpOptions = new StringSelectMenuBuilder()
      .setCustomId("jump")
      .setPlaceholder("Jump to a Page")
      .setOptions(
        pages.map((_, index) => {
          let page_num = String(index + 1);
          return {
            label: `Jump to Page ${page_num}`,
            value: page_num,
          };
        })
      );

    var embed = pages[0];
    let page = 1;
    embed = pages[0];
    embed.setFooter({ text: "Page " + page + " of " + pages.length });

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      firstButton,
      backButton,
      forwardButton,
      lastButton
    );

    const selectRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      jumpOptions
    );

    const rows = [selectRow, row]

    const update = async (confirmation: any, embed: EmbedBuilder) => {
      lastButton.setDisabled(page == pages.length);
      forwardButton.setDisabled(page == pages.length);
      backButton.setDisabled(page == 1);
      firstButton.setDisabled(page == 1);
      await confirmation.update({
        embeds: [embed],
        components: rows,
      });
    };

    const response = await interaction.followUp({
      embeds: [pages[0]],
      components: rows,
    });
    try {
      const collector = await response.createMessageComponentCollector({
        time: 600_000,
      });

      collector.on("collect", async (confirmation) => {
        if (confirmation.customId === "back") {
          if (page > 1) page -= 1;
          embed = pages[page - 1];
          embed.setFooter({ text: "Page " + page + " of " + pages.length });
          update(confirmation, embed);
        } else if (confirmation.customId === "forward") {
          if (page < pages.length) page += 1;
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
        }else if (confirmation.customId === "jump") {
          if ("values" in confirmation) {
            page = Number(confirmation.values[0])
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
};
