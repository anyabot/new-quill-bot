import { isMessageInstance } from "@sapphire/discord.js-utilities";
import { Command } from "@sapphire/framework";
import { nameChange, sendPages } from "../functions";
import axios from "axios";
import { load } from "cheerio";
import { EmbedBuilder } from "discord.js";

export class ImageCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, { ...options });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName("image")
        .setDescription("Search unit's image")
        .addStringOption((option) =>
          option
            .setName("unit")
            .setDescription("The unit for search images for")
            .setRequired(true)
        )
    );
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    await interaction.deferReply();
    const text = interaction.options.getString("unit");
    if (!text) return interaction.followUp("No unit name");
    const unit = nameChange(text);
    const link = `https://aigis.fandom.com/wiki/${encodeURI(unit)}`;
    axios
      .get(link)
      .then((res) => {
        const $ = load(res.data);
        var check = false;
        let img;
        const pages: EmbedBuilder[] = [];
        var page = 1;
        $(".thumb a img").each(function (index) {
          let temp = $(this);
          if (temp.attr("title")!.includes("Render")) {
            img = temp.attr("data-src");
            let nam = temp.attr("alt") || "";
            let pa = nam.split(" Render");
            if (img && pa.length > 1) {
              nam = pa[0];
              check = true;
              let embed = new EmbedBuilder();
              img = img.split("/scale-to-width-down/")[0];
              embed.setTitle(nam);
              embed.setImage(img);
              embed.setURL(link);
              pages.push(embed);
            }
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
        console.error(err, link);
      });
  }
}
