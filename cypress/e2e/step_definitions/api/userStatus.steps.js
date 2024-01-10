import { Given, Then, When } from "@badeball/cypress-cucumber-preprocessor";
import { anonResponse } from "./anonToken.steps.js";

let query, userStatusResponse;
Given(`Set user status query`, () => {
  query = `query GetUserStatus {
        userCheck{
            __typename,
            ... on AppUpdate{
                    message
            },
            ... on Authorized{
                    message
            },
            ... on Unauthorized{
                message
            } 
        }
    }`;
});

When(
  `Send user status request with client platform {string} and client app version {string}`,
  (clientPlatform, clientAppVersion) => {
    cy.request({
      method: "POST",
      url: "/graphql",
      failOnStatusCode: false,
      headers: {
        content_type: "application/json",
        accept: "application/json",
        Authorization: "Bearer " + anonResponse.body.data.getToken.token,
        client_app_version: clientAppVersion,
        client_platform: clientPlatform,
      },
      body: {
        query: query,
      },
    }).then((response) => {
      userStatusResponse = response;
    });
  }
);

Then(`Receive user status {string}`, (typeName) => {
  expect(userStatusResponse.status).to.eq(200);
  expect(userStatusResponse.body.data.userCheck.__typename).to.eql(typeName);
});

When(
  `Send user status request invalid token`,
  (clientPlatform, clientAppVersion) => {
    cy.request({
      method: "POST",
      url: "/graphql",
      failOnStatusCode: false,
      headers: {
        content_type: "application/json",
        accept: "application/json",
        Authorization: "Bearer " + "test",
        client_app_version: "3,48.0",
        client_platform: "ios",
      },
      body: {
        query: query,
      },
    }).then((response) => {
      userStatusResponse = response;
    });
  }
);

Then(`Receive Authorization error`, () => {
  expect(userStatusResponse.status).to.eq(401);
  expect(userStatusResponse.body.message).to.eql("Invalid Authorization");
});
