export interface WebHook<TResource> {
    eventType: string;
    message: Message;
    detailedMessage: Message;
    resource: TResource;
}

export interface Message {
    text: string;
    html: string;
    markdown: string;
}