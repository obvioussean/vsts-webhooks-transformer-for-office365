/// <reference path="../typings/index.d.ts" />
import * as express from "express";
import * as bodyParser from "body-parser";
import * as http from "http";
import * as request from "request";
import { WebHook, PullRequestResource } from "./webhook";
import { Connector } from "./office";

let port = process.env.PORT || 8081;
let server = express();
server.use(bodyParser.json());

server.get('/', (request, response) => {
  response.send('vsts webhooks transformer for office365 connectors');
});

server.post('/pr', (req, response) => {
  let url = req.query.url;
  let webhook: WebHook<PullRequestResource> = req.body;
  let target: string;
  if (webhook.resource &&
    webhook.resource._links &&
    webhook.resource._links.web &&
    webhook.resource._links.web.href) {
    target = webhook.resource._links.web.href;
  }
  else {
    target = webhook.resource.url;
  }

  let connector: Connector = {
    text: webhook.detailedMessage.markdown,
    themeColor: "EA4300",
    potentialAction: [
      {
        "@context": "http://schema.org",
        "@type": "ViewAction",
        "name": `View PR`,
        "target": [target]
      }
    ]
  };

  request(
    url,
    {
      json: true,
      body: connector,
      method: "POST",
    },
    (error: any, response: http.IncomingMessage, body: any) => {
      if (error) {
        console.log(error);
      }
    });

  response.status(200);
  response.end();
});

server.listen(port);
