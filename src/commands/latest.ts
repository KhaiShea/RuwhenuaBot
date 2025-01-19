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

import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import axios from "axios";
import { Command } from "../../@types";

export default class LatestEarthquakeCommand implements Command {
    name = "latest";
    description = "Get the latest earthquake from GeoNet";
    slashCommand = new SlashCommandBuilder()
        .setName(this.name)
        .setDescription(this.description);
    apiUrl = "https://api.geonet.org.nz/quake?MMI=3";

    /**
     * Execute is called when the interaction is used on Discord.
     * @param interaction - The command interaction object.
     */
    async execute(interaction: ChatInputCommandInteraction): Promise<any> {
        // Defer the reply to allow time for the API call
        await interaction.deferReply();

        await axios.get(this.apiUrl, {
            headers: { Accept: "application/vnd.geo+json;version=2" },
        }).then(async (res) => {
            // Returns reply stating that no earthquakes over 3 MMI have been recorded recently if that is the case
            if (res.data.features && res.data.features.length > 0) return await interaction.editReply({
                content: "No earthquakes over 3 MMI have been recorded recently.",
            });

            // Extract the latest earthquake data
            const quake = res.data.features[0].properties;
            const quakeTime = new Date(quake.time).toLocaleString("en-NZ", {
                timeZone: "Pacific/Auckland",
                dateStyle: "long",
                timeStyle: "short",
            });

            // Determine the intensity color
            const intensityColors: Record<number, string> = {
                1: "#00ff00", // Weak
                2: "#ffff00", // Light
                3: "#ffa500", // Moderate
                4: "#ff4500", // Strong
                5: "#ff0000"  // Severe
            };
            const color = intensityColors[quake.mmi] || "#000000"; // Default to black if MMI is undefined

            // Generate the thumbnail URL
            const coordinates = quake.locality.replace(/\s+/g, "").toLowerCase();
            const thumbnail = `https://static.geonet.org.nz/maps/4/quake/xxxhdpi/${coordinates}-${quake.mmi < 3 ? "weak" : quake.mmi < 5 ? "moderate" : "strong"}.png`;

            // Create an embed for the earthquake details
            const embed = new EmbedBuilder()
                .setAuthor({
                    name: "GeoNet",
                    iconURL: "https://play-lh.googleusercontent.com/3yZMFN9072EDfKmoUkKJNgyHfIIciupUQPNGvPISXlIrrrRZ3s8cem8KCdP8upuFPZ0",
                })
                .setTitle("A Rūwhenua was detected!")
                .addFields(
                    { name: "Time", value: quakeTime, inline: false },
                    { name: "Location", value: quake.locality, inline: false },
                    { name: "Shaking", value: quake.mmi.toString(), inline: false },
                    { name: "Magnitude", value: quake.magnitude.toString(), inline: false },
                    { name: "Depth", value: quake.depth ? `${quake.depth} km` : "Unknown", inline: false }
                )
                .setThumbnail(thumbnail)
                .setColor(color)
                .setFooter({ text: "Felt it? Report it!" })
                .setTimestamp();

            // Reply with the embed
            await interaction.editReply({ embeds: [embed] });
        }).catch(async (err) => {
            // Log and reply in case of an error fetching data
            console.error("Error fetching earthquake data:", err);
            await interaction.editReply({
                content: "An error occurred while fetching earthquake data. Please try again later.",
            });
        });
    }
}