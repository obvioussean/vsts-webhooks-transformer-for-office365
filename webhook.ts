export class WebHook {
    public message: Message;
    public detailedMessage: Message;
    public resource: Resource;
}

export class Message {
    public text: string;
    public html: string;
    public markdown: string;
}

export class Resource {
    public url; string;
}