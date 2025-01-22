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

import { ColorResolvable, EmbedBuilder } from "discord.js";

export default class EmbedUtils {
    // Create an embed for the latest earthquake.
    static createQuakeEmbed(properties: any, geometry: any) {
        const quakeTime = new Date(properties.time).toLocaleString("en-NZ", {
            timeZone: "Pacific/Auckland",
            dateStyle: "long",
            timeStyle: "short",
        });

        const intensityColours: Record<number, ColorResolvable> = {
            1: "#00ff00",
            2: "#ffff00",
            3: "#ffa500",
            4: "#ff4500",
            5: "#ff0000",
        };

        const colour = intensityColours[properties.mmi] || "#000000";

        // Generate the thumbnail URL
        const coordinates = Math.round(geometry[0]) + "E" + Math.abs(Math.round(geometry[1])) + "S";
        const thumbnail = `https://static.geonet.org.nz/maps/4/quake/xxxhdpi/${coordinates}-${properties.mmi < 3 ? "weak" : properties.mmi < 5 ? "moderate" : "strong"}.png`;

        return new EmbedBuilder()
            .setAuthor({
                name: "GeoNet",
                iconURL: "https://play-lh.googleusercontent.com/3yZMFN9072EDfKmoUkKJNgyHfIIciupUQPNGvPISXlIrrrRZ3s8cem8KCdP8upuFPZ0",
            })
            .setTitle("A rūwhenua was detected!")
            .addFields(
                { name: "Time", value: quakeTime, inline: false },
                { name: "Location", value: properties.locality, inline: false },
                { name: "Shaking", value: properties.mmi.toString(), inline: false },
                { name: "Magnitude", value: properties.magnitude.toFixed(1), inline: false },
                { name: "Depth", value: properties.depth ? `${properties.depth.toFixed(2)} km` : "Unknown", inline: false }
            )
            .setThumbnail(thumbnail)
            .setColor(colour)
            .setFooter({ text: "Felt it? Report it!" })
            .setTimestamp();
    }
}