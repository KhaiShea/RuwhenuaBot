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

import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ColorResolvable } from "discord.js";
import axios from "axios";
import { Command } from "../../@types";
import EmbedUtils from "../embedUtils";

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
            if (!res.data.features || res.data.features.length < 1) {
                return await interaction.editReply({
                    content: "No earthquakes over 3 MMI have been recorded recently.",
                });
            }

            // Extract the latest earthquake data
            const quake = res.data.features[0].properties;
            const coordinates = res.data.features[0].geometry.coordinates;

            // Generate the embed using EmbedUtils
            const embed = EmbedUtils.createQuakeEmbed(quake, coordinates);

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