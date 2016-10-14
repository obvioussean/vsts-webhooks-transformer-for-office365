/// <reference path="../typings/index.d.ts" />
import * as express from "express";
import * as bodyParser from "body-parser";
import * as http from "http";
import * as request from "request";
import { WebHook } from "./webhook";
import { IConnector } from "./office";

let port = process.env.PORT || 8081;
let server = express();
server.use(bodyParser.json());

server.get('/', (request, response) => {
  response.send('vsts webhooks transformer for office365 connectors');
});

server.post('/pr', (req, response) => {
  let url = req.query.url;
  let webhook: WebHook = req.body;
  let connector: IConnector = {
    text: webhook.detailedMessage.markdown,
    themeColor: "EA4300",
    potentialAction: [
      {
        "@context": "http://schema.org",
        "@type": "ViewAction",
        "name": `View PR`,
        "target": [webhook.resource.url]
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
