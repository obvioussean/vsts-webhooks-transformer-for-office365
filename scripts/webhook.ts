export interface WebHook<TResource> {
    message: Message;
    detailedMessage: Message;
    resource: TResource;
}

export interface Message {
    text: string;
    html: string;
    markdown: string;
}

export interface Resource {
    url: string;
    _links: Links;
}

export interface Links {
    web: Href;
}

export interface Href {
    href: string;
}

export interface PullRequestResource extends Resource {
    pullRequestId: number;
    status: string;
    title: string;
    description: string;
}