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

export class StatCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, { ...options });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName("stat")
        .setDescription("Search unit's stats")
        .addStringOption((option) =>
          option
            .setName("unit")
            .setDescription("The unit for search stats for")
            .setRequired(true)
        )
    );
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    await interaction.deferReply({ ephemeral: true });
    const text = interaction.options.getString("unit");
    if (!text) return interaction.followUp("No unit name");
    let unit = nameChange(text);
    const link = `https://aigis.fandom.com/wiki/${encodeURI(unit)}`;
    const link2 = `https://aigis.fandom.com/wiki/${encodeURI(unit)}/stats`;
    axios
      .get(link)
      .then((res) => {
        const $2 = load(res.data);
        unit = $2(".mw-page-title-main").text();
        const link2 = `https://aigis.fandom.com/wiki/${encodeURI(unit)}/stats`;
        axios
          .get(link2)
          .then((res) => {
            const $ = load(res.data);
            var check = false;
            let img: string | undefined;
            const pages: EmbedBuilder[] = [];
            let table_rows = $(".listtable.bgwhite tr");
            let embed: EmbedBuilder;
            let row1: string[];
            let row2: string[];
            let aff: string;
            table_rows.each(function (index) {
              let start_col: number;
              let temp = $(this);
              if (index < 2) return;
              if (index >= table_rows.length - 2) return;
              if (index == 2) start_col = 1;
              else start_col = 0;
              if (index % 2 == 0) row1 = [];
              else row2 = [];
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
                      $(element)
                        .html()!
                        .replaceAll(/<[^>]*>/g, "\n")
                        .replaceAll(/\n+/g, "\n")
                        .trim()
                    );
                  else
                    row2.push(
                      $(element)
                        .html()!
                        .replaceAll(/<[^>]*>/g, "\n")
                        .replaceAll(/\n+/g, "\n")
                        .trim()
                    );
                }
              });
              if (row1.length > 9) aff = row1[9];

              if (index % 2 == 1) {
                check = true;
                embed = new EmbedBuilder();
                let send_img = img?.split("/scale-to-width-down/")[0];
                embed.setTitle(unit);
                send_img ? embed.setThumbnail(send_img) : null;
                embed.setURL(link);
                embed.addFields(
                  {
                    name: "Class",
                    value: `${row1[0].replaceAll(/\n+/g, " ")} (${row1[1]} → ${
                      row2[0]
                    })`,
                    inline: true,
                  },
                  {
                    name: "HP",
                    value: `${row1[2]} → ${row2[1]}`,
                    inline: true,
                  },
                  {
                    name: "ATK",
                    value: `${row1[3]} → ${row2[2]}`,
                    inline: true,
                  },
                  {
                    name: "DEF",
                    value: `${row1[4]} → ${row2[3]}`,
                    inline: true,
                  },
                  {
                    name: "MR",
                    value: row1[5],
                    inline: true,
                  },
                  {
                    name: "Block",
                    value: row1[6].replaceAll(/\n+/g, " "),
                    inline: true,
                  },
                  {
                    name: "Range",
                    value: row2[4].replaceAll(/\n+/g, " / "),
                    inline: true,
                  },
                  {
                    name: "Cost",
                    value: `${row1[7]} → ${row1[8]}`,
                    inline: true,
                  },
                  {
                    name: "Affection Bonus",
                    value: affe(aff),
                    inline: true,
                  }
                );
                pages.push(embed);
              }
            });
            if (check) {
              sendPages(interaction, pages);
            }
            if (!check) {
              interaction.followUp("Can't find anything");
            }
          })
          .catch((err) => {
            interaction.followUp("Can't find anything");
            console.error(err, link2);
          });
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
