import { isMessageInstance } from "@sapphire/discord.js-utilities";
import { Command } from "@sapphire/framework";
import { nameChange, sendPages } from "../functions";
import axios from "axios";
import { load } from "cheerio";
import { EmbedBuilder } from "discord.js";

var bonus: { [key: string]: string } = {
  PEV: "Physical Attack Evasion",
  PAD: "Post-Attack Delay",
  SCD: "Skill Cooldown",
  SDI: "Skill Duration",
  PRC: "Piercing Attack",
};

export class SearchCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, { ...options });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName("search")
        .setDescription("Return search results from the wiki")
        .addStringOption((option) =>
          option
            .setName("keyword")
            .setDescription("The keyword to search for")
            .setRequired(true)
        )
    );
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    await interaction.deferReply();
    const text = interaction.options.getString("keyword");
    if (!text) return interaction.followUp("No keyword");
    let unit = nameChange(text);
    const link = `https://aigis.fandom.com/wiki/Special:Search?query=${encodeURI(
      text
    )}`;
    axios
      .get(link)
      .then((res) => {
        const $ = load(res.data);
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
      })

      .catch((err) => {
        interaction.followUp("Can't find anything");
        console.error(err, link);
      });
  }
}

function affe(output: string) {
  output = output.trim();
  var arr = output.split("\n");
  var filtered = arr.filter(function (el) {
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
