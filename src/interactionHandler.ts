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

import { ChatInputCommandInteraction } from "discord.js";
import { Command } from "../@types";

export default class InteractionHandler {
    private commands: Command[]

    constructor() {
        this.commands = [

        ];
    }

    getSlashCommands() {
        /*
            Map of all the commands data in JSON format, allows format to be sent to Discord API for slash command options.
        */

        return this.commands.map((command: Command) =>
            command.slashCommand.toJSON()
        );
    }

    async handleInteraction(interaction: ChatInputCommandInteraction): Promise<void> {
        /* 
            Handles any interactions sent from Discord API by seeing if the interaction executed is in the list of 
            commands defined by this.commands().

            If it is not, it returns a promise rejection. Otherwise, it executes the command and logs on success or error.
        */

        const command = this.commands.find((command) => command.name === interaction.commandName);
        
        if (!command) return Promise.reject("Command not found.");

        command
            .execute(interaction)
            .then(() => {
                console.log(
                    `Sucessfully executed command [/${interaction.commandName}]`,
                    {
                      guild: { id: interaction.guildId, name: interaction.guild?.name },
                      user: { name: interaction.user.globalName },
                    }
                );
            })
            .catch((err) => {
                console.log(
                    `Error executing command [/${interaction.commandName}]: ${err}`,
                    {
                      guild: { id: interaction.guildId, name: interaction.guild?.name },
                      user: { name: interaction.user.globalName },
                    }
                );
            });
    }
}