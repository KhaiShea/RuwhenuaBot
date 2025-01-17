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

import Discord from "discord.js";
import { Command } from "../../@types";

export default class LatestEarthquakeCommand implements Command {
    name = "latest";
    description = "Get the latest earthquake from GeoNet";
    slashCommand = new Discord.SlashCommandBuilder()
        .setName(this.name)
        .setDescription(this.description);

    /*
        Execute is called when the interaction is used on Discord.
        Provides an emphemeral response linking user to the Aroha terms of use.
    */
    async execute(interaction: Discord.ChatInputCommandInteraction): Promise<any> {
        // do stuff here

    }
}