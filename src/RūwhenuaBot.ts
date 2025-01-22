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

import { ChatInputCommandInteraction, Client, Events, GatewayIntentBits, REST, Routes, Snowflake } from "discord.js";
import settings from "../settings.json";
import InteractionHandler from "./services/InteractionHandler";
import EarthquakeMonitor from "./services/EarthquakeMonitor";

class RūwhenuaBot {
    private client: Client;
    private interactionHandler: InteractionHandler;
    private discordRestClient: REST;
    private earthquakeMonitor: EarthquakeMonitor;

    constructor() {
        /*
            Creates a new discord.js client.
        */

        this.client = new Client({
            allowedMentions: { parse: ["everyone"] },
            intents: [ GatewayIntentBits.Guilds ]
        });

        this.interactionHandler = new InteractionHandler();
        this.discordRestClient = new REST().setToken(settings.tokens.discord);
        this.earthquakeMonitor = new EarthquakeMonitor(this.client);
    };

    start() {
        /* 
            Start discord.js client function.
        */

        this.client.login(settings.tokens.discord)
            .then(() => {
                this.addClientEventHandlers();
                if (this.client.application?.id) this.registerSlashCommands(this.client.application.id);
            })
            .catch((err) => {
                console.error(err);
            });
    }

    addClientEventHandlers() {
        /* 
            Discord client event handlers.
        */

        // Logs to console once the client connects and is ready
        this.client.on(Events.ClientReady, (bot) => {
            console.log(`Connected to the Discord client as ${bot.user.username}#${bot.user.discriminator} (${bot.user.id}).`);
        });

        // Error event handler, logs to console on error
        this.client.on(Events.Error, (err: Error) => {
            console.error(`Client error ${err}`);
        });

        // Receives any client interaction events and runs them through handleInteraction() in InteractionHandler
        this.client.on(Events.InteractionCreate, (interaction) => {
            this.interactionHandler.handleInteraction(interaction as ChatInputCommandInteraction);
        });
    }

    registerSlashCommands(clientID: Snowflake) {
        /*
            Register the slash commands with the Discord API as global application commands.
        */

        const commands = this.interactionHandler.getSlashCommands();

        this.discordRestClient
            .put(Routes.applicationCommands(clientID), {
                body: commands,
            })
            .then((data: any) => {
                console.log(data); 
                console.log(`Successfully registered ${data.length} global application (/) commands.`);
            })
            .catch((err: any) => {
                console.error(`Error registering application (/) commands: ${err}`);
            });
    }
}

const app = new RūwhenuaBot;
app.start();