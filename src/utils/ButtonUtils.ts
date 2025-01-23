import { ButtonBuilder, ButtonStyle } from "discord.js"

export default class ButtonUtils {
    static createQuakeEmbedButton(publicID: string): ButtonBuilder {
        return new ButtonBuilder()
            .setLabel("Further details on GeoNet")
            .setURL(`https://www.geonet.org.nz/earthquake/${publicID}`)
            .setStyle(ButtonStyle.Link);
    }
}