// Connector reference: https://dev.outlook.com/connectors/reference
export interface IConnector {
    title?: string;
    text: string;
    themeColor?: string;
    potentialAction?: any[];
}