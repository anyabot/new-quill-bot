import { isMessageInstance } from "@sapphire/discord.js-utilities";
import { Command } from "@sapphire/framework";
import { nameChange, sendPages } from "../functions";
import axios from "axios";
import { load } from "cheerio";
import { EmbedBuilder } from "discord.js";
import striptags from "striptags";

export class SkillCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, { ...options });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName("skill")
        .setDescription("Search unit's skills")
        .addStringOption((option) =>
          option
            .setName("unit")
            .setDescription("The unit for search skills for")
            .setRequired(true)
        )
    );
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    await interaction.deferReply();
    const text = interaction.options.getString("unit");
    if (!text) return interaction.followUp("No unit name");
    let unit = nameChange(text);
    const link = `https://aigis.fandom.com/wiki/${encodeURI(unit)}`;

    axios
      .get(link)
      .then((res) => {
        const $ = load(res.data);
        unit = $(".mw-page-title-main").text();
        const link2 = `https://aigis.fandom.com/wiki/${encodeURI(unit)}/stats`;
        let check = false;
        const pages: EmbedBuilder[] = [];
        let img = $(".wikitable.sawlistbegin tbody tr td div a img").attr(
          "data-src"
        );
        if (!img || !img.includes("static.wikia.nocookie.net"))
          img = $(".wikitable.sawlistbegin tbody tr td div a img").attr("src");
        if (img) {
          check = true;
          img = img.split("/scale-to-width-down/")[0];
          let s1: string[] = [];
          $(".wikitable.sawlistbegin .sawpre").map((index, el) =>
            s1.push(
              $(el)
                .html()!
                .replaceAll(/<[^>]*>/g, "\n")
                .replaceAll(/\n+/g, "\n")
                .trim()
            )
          );
          let s2: string[] = [];
          $(".wikitable.sawlistbegin .sawpost").map((index, el) =>
            s2.push(
              $(el)
                .html()!
                .replaceAll(/<[^>]*>/g, "\n")
                .replaceAll(/\n+/g, "\n")
                .trim()
            )
          );
          pages.push(createEmbed(img, unit, link, s1, "Normal Skill"));
          pages.push(createEmbed(img, unit, link, s2, "Awakened Skill"));
        }
        if (check) {
          sendPages(interaction, pages);
        } else {
          // axios
          //   .get(link2)
          //   .then((res) => {
          //     const $2 = load(res.data);
          //     var check = false;

          //     if (!check) {
          //       interaction.reply("Can't find anything");
          //     }
          //   })
          //   .catch((err) => {
          //     interaction.reply("Can't find anything");
          //     console.error(err, link2);
          //   });
          interaction.followUp("Only SAW for now");
        }
      })
      .catch((err) => {
        interaction.followUp("Can't find anything");
        console.error(err, link);
      });
  }
}

function createEmbed(
  img: string,
  unit: string,
  link: string,
  skills: string[],
  text: string
) {
  let embed = new EmbedBuilder();
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
        value: `${des}\nCD:${cd}\nInitial:${ini}`,
      },
    ]);
    i += 4;
  }
  return embed;
}
