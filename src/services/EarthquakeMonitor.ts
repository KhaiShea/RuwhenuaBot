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

import { Client, TextChannel } from "discord.js";
import axios from "axios";
import EmbedUtils from "../utils/EmbedUtils";
import settings from "../../settings.json";

export default class EarthquakeMonitor {
    private client: Client;
    private lastEarthquakeId: string | null = null;

    constructor(client: Client) {
        this.client = client;
    }

    start() {
        setInterval(() => this.checkForEarthquakes(), 30000); // Poll every 30 seconds
    }

    // Check for earthquakes with a Modified Mercalli Intensity of 3 or higher
    private async checkForEarthquakes() {
        await axios.get("https://api.geonet.org.nz/quake?MMI=3", {
            headers: { Accept: "application/vnd.geo+json;version=2" },
        }).then((res => {
            if (!res.data.features || res.data.features.length < 1) return;

            const latestQuake = res.data.features[0];

            if (this.lastEarthquakeId !== latestQuake.id) {
                this.lastEarthquakeId = latestQuake.id;
                this.alertEarthquake(latestQuake);
            }

        })).catch((err) => {
            console.error("Error fetching earthquake data: " + err);
        });
    }

    // Alert the alert channel with the earthquake data.
    private async alertEarthquake(quakeData: any) {
        const alertChannel = (await this.client.channels.fetch(settings.alertChannelID)) as TextChannel;

        if (!alertChannel) return console.error("Alert channel not found.");

        const quakeEmbed = EmbedUtils.createQuakeEmbed(quakeData.properties, quakeData.geometry, "new");
        alertChannel.send({ content: "@everyone A new rūwhenua was detected!", embeds: [ quakeEmbed ] });
    }
}