/*
Copyright (C) 2025 Khai Dye-Brinkman, Carolina Mitchell.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import axios from "axios";
import { Command } from "../../@types";

export default class LatestEarthquakeCommand implements Command {
    name = "latest";
    description = "Get the latest earthquake from GeoNet";
    slashCommand = new SlashCommandBuilder()
        .setName(this.name)
        .setDescription(this.description);

    /*
        Execute is called when the interaction is used on Discord.
    */
    async execute(interaction: ChatInputCommandInteraction): Promise<any> {
        // Defer the reply to allow time for the API call
        await interaction.deferReply();

        const apiUrl = "https://api.geonet.org.nz/quake?MMI=3";

        try {
            const response = await axios.get(apiUrl, {
                headers: { Accept: "application/vnd.geo+json;version=2" },
            });

            const data = response.data;

            if (data.features && data.features.length > 0) {
                const quake = data.features[0].properties;
                const quakeTime = new Date(quake.time).toLocaleString("en-NZ", {
                    timeZone: "Pacific/Auckland",
                    dateStyle: "long",
                    timeStyle: "short",
                });

                await interaction.editReply({
                    content: `**Last Earthquake Over 3 MMI**\n\n` +
                        `**Time:** ${quakeTime}\n` +
                        `**Magnitude:** ${quake.magnitude}\n` +
                        `**Locality:** ${quake.locality}\n` +
                        `**MMI:** ${quake.mmi}\n`,
                });
            } else {
                await interaction.editReply({
                    content: "No earthquakes over 3 MMI have been recorded recently.",
                });
            }
        } catch (error) {
            console.error("Error fetchiing earthquake data:", error);
            await interaction.editReply({
                content: "An error occurred while fetching earthquake data. Please try again later.",
            });
        }
    }
}