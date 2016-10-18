// Connector reference: https://dev.outlook.com/connectors/reference
export interface Connector {
    title?: string;
    text?: string;
    summary?: string;
    themeColor?: string;
    potentialAction?: any[];
    sections?: Section[];
}

export interface Section {
    title?: string;
    text?: string;
    activityTitle?: string;
    activitySubtitle?: string;
    activityImage?: string;
    activityText?: string;
    facts?: Fact[];
    images?: Image[];
    markdown?: boolean;
    potentialAction?: any[];
}

export interface Fact {
    name: string;
    value: string;
}

export interface Image {
    title: string;
    url: string;
}