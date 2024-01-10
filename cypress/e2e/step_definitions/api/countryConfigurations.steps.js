import { Given, Then, When } from "@badeball/cypress-cucumber-preprocessor";
import { anonResponse } from "./anonToken.steps.js";

let query, countryResponse;
Given(`Set the country configuration API query`, () => {
  query = `query GetCountryRestrictions ($input: String!){
        country(countryCode:$input) {
            __typename,
           countryCode,
            allowed,
            captchaRequired
        }
    }`;
});

When(
  `Send the country configuration API request with {string}`,
  (countryCode) => {
    cy.request({
      method: "POST",
      url: "/graphql",
      failOnStatusCode: false,
      headers: {
        content_type: "application/json",
        accept: "application/json",
        Authorization: "Bearer " + anonResponse.body.data.getToken.token,
      },
      body: {
        query: query,
        variables: {
          input: countryCode,
        },
      },
    }).then((response) => {
      countryResponse = response;
    });
  }
);

Then(`Receive country configuration`, () => {
  expect(countryResponse.status).to.eq(200);
  if (countryResponse.body.data.country.countryCode == "GB") {
    expect(countryResponse.body.data.country.allowed).be.true;
  } else if (countryResponse.body.data.country.countryCode == "AF") {
    expect(countryResponse.body.data.country.allowed).be.false;
  }
});

When(
  `Send the country configuration API request with invalid {string}`,
  (token) => {
    cy.request({
      method: "POST",
      url: "/graphql",
      failOnStatusCode: false,
      headers: {
        content_type: "application/json",
        accept: "application/json",
        Authorization: "Bearer " + token,
      },
      body: {
        query: query,
        variables: {
          input: "GB",
        },
      },
    }).then((response) => {
      countryResponse = response;
    });
  }
);

Then(`Receive token error {string}`, (message) => {
  expect(countryResponse.status).to.eq(401);
  expect(countryResponse.body.message).to.eql(message);
});
