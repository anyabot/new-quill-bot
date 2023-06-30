import { isMessageInstance } from "@sapphire/discord.js-utilities";
import { Command } from "@sapphire/framework";
import { nameChange, sendPages } from "../functions";
import axios from "axios";
import { load } from "cheerio";
import { EmbedBuilder } from "discord.js";
import striptags from "striptags";

var bonus: { [key: string]: string } = {
  PEV: "Physical Attack Evasion",
  PAD: "Post-Attack Delay",
  SCD: "Skill Cooldown",
  SDI: "Skill Duration",
  PRC: "Piercing Attack",
};

export class ClassCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, { ...options });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName("class")
        .setDescription("Search unit's classes")
        .addStringOption((option) =>
          option
            .setName("unit")
            .setDescription("The unit for search classes for")
            .setRequired(true)
        )
    );
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const text = interaction.options.getString("unit");
    if (!text) return interaction.reply("No unit name");
    let unit = nameChange(text);
    const link = `https://aigis.fandom.com/wiki/${encodeURI(unit)}`;
    
    axios
      .get(link)
      .then((res) => {
        const $ = load(res.data);
        unit = $(".mw-page-title-main").text()
        const link2 = `https://aigis.fandom.com/wiki/${encodeURI(unit)}/stats`;
        axios
          .get(link2)
          .then((res) => {
            const $2 = load(res.data);
            var check = false;
            let img: string | undefined;
            const pages: EmbedBuilder[] = [];
            let table_rows = $2(".listtable.bgwhite tr");
            let embed: EmbedBuilder;
            let des: string = ""
            let note: string = ""
            let des_len = 0
            let note_len = 0

            table_rows.each(function (index) {
              let start_col: number;
              let temp = $2(this);
              if (index < 2) return;
              if (index >= table_rows.length - 2) return;
              if (index % 2 != 0) return
              if (index == 2) start_col = 1;
              else start_col = 0;

              let new_img = temp.find("img").attr("data-src");
              if (!new_img || !new_img.includes("static.wikia.nocookie.net"))
                new_img = temp.find("img").attr("src");
              if (new_img && new_img.includes("static.wikia.nocookie.net")) {
                img = new_img;
                start_col += 1;
              }
              let class_name: string = ""
              temp.find("td").each((index2, element) => {
                if (index2 == start_col) {
                  class_name = 
                      $(element)
                        .html()!
                        .replaceAll(/<[^>]*>/g, "\n")
                        .replaceAll(/\n+/g, " ")
                        .trim()
                }
              });
              $(".gcstyle.bgwhite.hsbullet.class-table tbody tr").each((index, element) => {
                let temp = $(element)
                if (temp.find("td").first().text().trim() == class_name) {
                let curr = 1
                        if (des_len) des_len -= 1
                else {
                    curr += 1
                    des = temp.find(`td:nth-child(${curr})`).html()!
                                .replaceAll(/<[^>]*>/g, "\n")
                                .replaceAll(/\n+/g, "\n")
                                .trim()
                    des_len = Number(temp.find(`td:nth-child(${curr})`).attr("rowspan"))
                    
                    
                    
                }
                    if (note_len) note_len -= 1
                else {
                    curr += 1
                    note = format_note(temp.find(`td:nth-child(${curr})`).html()!)
                    note_len = Number(temp.find(`td:nth-child(${curr})`).attr("rowspan"))
                }
                }
            })

                check = true;
                embed = new EmbedBuilder();
                let send_img = img?.split("/scale-to-width-down/")[0];
                embed.setTitle(unit);
                send_img ? embed.setThumbnail(send_img) : null;
                embed.setURL(link);
                embed.addFields({name: "Class Name", value: class_name}, {name: "Description", value: des}, {name: "Notes", value: note})
                pages.push(embed);
              
            });
            if (check) {
              sendPages(interaction, pages);
            }
            if (!check) {
              interaction.reply("Can't find anything");
            }
          })
          .catch((err) => {
            interaction.reply("Can't find anything")
            console.error(err, link2)}
            );
      })
      .catch((err) => {
        interaction.reply("Can't find anything")
        console.error(err, link)
      });
  }
}

function format_note(output: string) {
  output = striptags(output, "<br>");
  output = output.replace(/<[^>]*>/g, "\n");
  output = output.replace(/\n+ /g, "\n");
  output = output.trim();
  var arr = output.split("\n");
  var filtered = arr.filter(function (el) {
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
