import { isMessageInstance } from "@sapphire/discord.js-utilities";
import { Command } from "@sapphire/framework";
import { nameChange, sendPages } from "../functions";
import axios from "axios";
import { load } from "cheerio";
import { EmbedBuilder } from "discord.js";

export class AbilityCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, { ...options });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName("ability")
        .setDescription("Search unit's abilities")
        .addStringOption((option) =>
          option
            .setName("unit")
            .setDescription("The unit for search abilities for")
            .setRequired(true)
        )
    );
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    await interaction.deferReply({ ephemeral: true });
    const text = interaction.options.getString("unit");
    if (!text) return interaction.followUp("No unit name");
    const unit = nameChange(text);
    const link = `https://aigis.fandom.com/wiki/${encodeURI(unit)}`;
    axios
      .get(link)
      .then((res) => {
        const $ = load(res.data);
        var check = false;
        let img: string | undefined;
        let aw_img: string | undefined;
        const pages: EmbedBuilder[] = [];
        var page = 1;
        let ability_name = $(".abilitynormal td:nth-child(1)")
          .text()
          .split("(edit info)")[0];
        if (ability_name) {
          let des = $(".abilitynormal td:nth-child(2)").text().trim() || "";
          let note = $(".abilitynormal td:nth-child(4)").text().trim() || "";
          $(".thumb a img").each(function (index) {
            let temp = $(this);
            if (temp.attr("title")!.includes("Icon")) {
              if (img) return;
              temp.attr("data-src") ? (img = temp.attr("data-src")) : null;
            }
          });
          if (img) {
            check = true;
            let embed = new EmbedBuilder();
            img = img.split("/scale-to-width-down/")[0];
            embed.setTitle(`${unit}'s Ability`);
            embed.setThumbnail(img);
            embed.setURL(link);
            embed.addFields({
              name: ability_name,
              value: des,
            });
            if (note)
              embed.addFields({
                name: "Notes",
                value: note,
              });
            pages.push(embed);
          }
        }
        let aw_ability_name = $(".abilityupgrade td:nth-child(1)")
          .text()
          .split("(edit info)")[0];
        if (aw_ability_name) {
          let des = $(".abilityupgrade td:nth-child(2)").text().trim() || "";
          let note = $(".abilityupgrade td:nth-child(4)").text().trim() || "";
          $(".thumb a img").each(function (index) {
            let temp = $(this);
            if (temp.attr("title")!.includes("AW Icon")) {
              if (aw_img) return;
              aw_img = temp.attr("data-src");
            }
          });
          if (!aw_img) aw_img = img;
          if (aw_img) {
            check = true;
            let embed = new EmbedBuilder();
            aw_img = aw_img.split("/scale-to-width-down/")[0];
            embed.setTitle(`${unit}'s Awakened Ability`);
            embed.setThumbnail(aw_img);
            embed.setURL(link);
            embed.addFields({
              name: aw_ability_name,
              value: des,
            });
            if (note)
              embed.addFields({
                name: "Notes",
                value: note,
              });
            pages.push(embed);
          }
        }
        if (check) {
          sendPages(interaction, pages);
        }
        if (!check) {
          interaction.followUp("Can't find anything");
        }
      })
      .catch((err) => {
        interaction.followUp("Can't find anything");
        console.error(err, link);
      });
  }
}
