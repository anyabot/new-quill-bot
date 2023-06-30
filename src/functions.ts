var name = require("./library/lib.js").name;
var suffix = require("./library/suf.js").suffix;
import { Command } from '@sapphire/framework';
import { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js';

function titleCase(str: string) {
  const str_list = str.toLowerCase().split(" ");
  for (var i = 0; i < str_list.length; i++) {
    str_list[i] = str_list[i].charAt(0).toUpperCase() + str_list[i].slice(1);
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
    } else if (np[npl - 1] == "Springs)" && np[npl - 2] == "(Hot") {
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


export const sendPages = async function(interaction: Command.ChatInputCommandInteraction, pages: EmbedBuilder[]) {
	if (pages.length == 1) {
		interaction.reply({
			embeds: [pages[0]],
		});
	}
	else {
		const backButton = new ButtonBuilder()
		.setCustomId('back')
		.setLabel('Prev Page')
		.setEmoji('⬅️')
		.setStyle(ButtonStyle.Secondary)
		.setDisabled(true)

		const forwardButton = new ButtonBuilder()
		.setCustomId('forward')
		.setLabel('Next Page')
		.setEmoji('➡️')
		.setStyle(ButtonStyle.Secondary);

		var embed = pages[0];
    let page = 1;
    embed = pages[0];
    embed.setFooter({text: 'Page ' + page + ' of ' + pages.length});

		const row = new ActionRowBuilder<ButtonBuilder>()
		.addComponents(backButton, forwardButton);
		const response = await interaction.reply({
			embeds: [pages[0]],
			components: [row],
		});
		try {
			const collector = await response.createMessageComponentCollector({ time: 600_000 });
		
			collector.on("collect", async confirmation => {
				if (confirmation.customId === 'back') {
					if (page > 1) page -= 1
					embed = pages[page - 1];
					embed.setFooter({text: 'Page ' + page + ' of ' + pages.length});
					forwardButton.setDisabled(page == pages.length)
					backButton.setDisabled(page == 1)
					await confirmation.update({
						embeds: [embed],
						components: [row],
					})
				} else if (confirmation.customId === 'forward') {
					if (page < pages.length) page += 1
					embed = pages[page - 1];
					embed.setFooter({text: 'Page ' + page + ' of ' + pages.length});
					forwardButton.setDisabled(page == pages.length)
					backButton.setDisabled(page == 1)
					await confirmation.update({
						embeds: [embed],
						components: [row],
					})
				}
			}
			)
		}
		catch {
			return
		}
	}
}
