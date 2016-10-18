/// <reference path="../typings/index.d.ts" />
import * as express from "express";
import * as bodyParser from "body-parser";
import * as http from "http";
import * as request from "request";
import { WebHook } from "./webhook";
import { Connector, Section, Fact, Image } from "./office";
import { GitPullRequest } from "vso-node-api/interfaces/GitInterfaces";

let port = process.env.PORT || 8081;
let server = express();
server.use(bodyParser.json());

server.get('/', (request, response) => {
  response.send('vsts webhooks transformer for office365 connectors');
});

server.post('/pr', (req, response) => {
  let url = req.query.url;
  let pat = req.query.pat;
  let webhook: WebHook<GitPullRequest> = req.body;
  let pr: GitPullRequest = webhook.resource;
  let target: string;

  // this is enabled in m107
  if (pr._links &&
    pr._links.web &&
    pr._links.web.href) {
    target = webhook.resource._links.web.href;
  }
  else {
    target = webhook.resource.url;
  }

  let sendSimpleConnector = () => {
    // no pat or identity url, so simple view
    let connector: Connector = {
      text: webhook.message.markdown,
      themeColor: "EA4300",
      potentialAction: [{
        "@context": "http://schema.org",
        "@type": "ViewAction",
        "name": `View PR`,
        "target": [target]
      }]
    };

    request.post(url, {
      json: true,
      body: connector
    });
  };

  // if we have a pat, try and download the identity image.
  if (pat &&
    pr.createdBy &&
    pr.createdBy.imageUrl) {
    let auth = "Basic " + new Buffer("username" + ":" + pat).toString("base64");
    request.get(
      pr.createdBy.imageUrl,
      {
        encoding: null,
        headers: {
          "Authorization": auth
        }
      },
      (error: any, response: http.IncomingMessage, body: any) => {
        let statusCode = response.statusCode;
        if (statusCode == 200) {
          let contentType = response.headers["content-type"];
          let img = `data:${contentType};base64,${new Buffer(body).toString("base64")}`;

          let sections: Section[] = [
            {
              activityText: webhook.detailedMessage.markdown,
              activityImage: img
            }];

          if (pr.reviewers &&
            pr.reviewers.length > 0) {
            let reviewers = pr.reviewers.map((value) => {
              return <Fact>{
                "name": value.displayName,
                "value": ""
              };
            });

            sections.push({
              "title": "Reviewers",
              "facts": reviewers
            });
          }

          let connector: Connector = {
            title: `New PR created`,
            summary: webhook.message.markdown,
            sections: sections,
            themeColor: "EA4300",
            potentialAction: [{
              "@context": "http://schema.org",
              "@type": "ViewAction",
              "name": `View PR`,
              "target": [target]
            }]
          };

          request.post(url,
            {
              json: true,
              body: connector
            });
        }
        else {
          // error getting image, so fallback to the simple connector
          sendSimpleConnector();
        }
      });
  }
  else {
    // no pat or identity url, so simple view
    sendSimpleConnector();
  }

  response.status(200);
  response.end();
});

server.listen(port);
