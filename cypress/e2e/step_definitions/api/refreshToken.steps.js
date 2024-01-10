import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { verificationCodeResponse } from "./verificationCode.steps.js";

let mutation, refreshTokenResponse, invalidRefreshResponse;
Given(`Set refresh token API query`, () => {
  mutation = `mutation($input: RefreshTokenInput!){
        refreshToken(input:$input){
            errors,
            token
        }
    }`;
});

When(`Send the refresh token API request`, () => {
  cy.request({
    method: "POST",
    url: "/graphql",
    headers: {
      content_type: "application/json",
      accept: "appliaction/json",
      authorization:
        "Bearer " + verificationCodeResponse.body.data.verificationCode.token,
    },
    body: {
      query: mutation,
      variables: {
        input: {
          refreshToken:
            verificationCodeResponse.body.data.verificationCode.refreshToken,
        },
      },
    },
  }).then((response) => {
    refreshTokenResponse = response;
  });
});

Then(`Receive new login token`, () => {
  expect(refreshTokenResponse.status).to.eq(200);
  expect(refreshTokenResponse.body.data.refreshToken.token).to.not.equal(null);
});

When(`Send the invalid refresh token API request`, () => {
  cy.request({
    method: "POST",
    url: "/graphql",
    headers: {
      content_type: "application/json",
      accept: "appliaction/json",
      authorization:
        "Bearer " + verificationCodeResponse.body.data.verificationCode.token,
    },
    body: {
      query: mutation,
      variables: {
        input: {
          refreshToken:
            verificationCodeResponse.body.data.verificationCode.refreshToken +
            "t",
        },
      },
    },
  }).then((response) => {
    invalidRefreshResponse = response;
  });
});

Then(`Receive refresh token error`, () => {
  expect(invalidRefreshResponse.status).to.eq(200);
  expect(
    invalidRefreshResponse.body.data.refreshToken.errors[0]
  ).to.have.string("invalid refresh_token");
  expect(invalidRefreshResponse.body.data.refreshToken.token).to.equal(null);
});

export { refreshTokenResponse };
