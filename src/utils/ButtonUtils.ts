import { ButtonBuilder, ButtonStyle } from "discord.js"

export default class ButtonUtils {
    static createLatestQuakeEmbedButton(publicID: string): ButtonBuilder {
        return new ButtonBuilder()
            .setLabel("Further details on GeoNet")
            .setURL(`https://www.geonet.org.nz/earthquake/${publicID}`)
            .setStyle(ButtonStyle.Link);
    }

    static createNewQuakeEmbedButton(publicID: string): ButtonBuilder[] {
        return [
            new ButtonBuilder()
                .setLabel("Felt it report")
                .setURL(`https://felt.geonet.org.nz`)
                .setStyle(ButtonStyle.Link),
            new ButtonBuilder()
                .setLabel("Further details on GeoNet")
                .setURL(`https://www.geonet.org.nz/earthquake/${publicID}`)
                .setStyle(ButtonStyle.Link),
        ];
    }
}