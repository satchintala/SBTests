import {
  Before,
  Given,
  Then,
  When,
} from "@badeball/cypress-cucumber-preprocessor";
import { anonResponse } from "./anonToken.steps.js";

let mutation, loginResponse;

Before(() => {
  cy.readFile("cypress/fixtures/numbers.json").then((numbers) => {
    ukNumber = numbers.ukNumber;
    ptNumber = numbers.ptNumber;
  });
});

Given(`Set login input mutation`, () => {
  mutation = `mutation($input: LoginInput!){
    login(input: $input) {
    errors,
    status,
    hasVerificationTries
    }
  }`;
});

When(
  `Send login input API request with {string}, {string}`,
  (countryCode, prefix) => {
    if (countryCode == "GB") phoneNumber = ukNumber;
    else phoneNumber = ptNumber;

    cy.request({
      method: "POST",
      url: "/graphql",
      headers: {
        content_type: "application/json",
        accept: "application/json",
        Authorization: "Bearer " + anonResponse.body.data.getToken.token,
      },
      body: {
        query: mutation,
        variables: {
          input: {
            phoneNumber: phoneNumber,
            countryCode: countryCode,
            prefix: prefix,
          },
        },
      },
    }).then((response) => {
      loginResponse = response;
    });
  }
);

Then(`Receive user login status {string}`, (message) => {
  expect(loginResponse.status).to.eq(200);
  expect(loginResponse.body.data.login).to.have.property("status", message);
});

Then(`Receive blocked user login status`, () => {
  expect(loginResponse.status).to.eq(200);
  expect(loginResponse.body.data.login.errors[0]).to.have.string(
    "User blocked"
  );
  expect(loginResponse.body.data.login.status).to.equal("blocked");
});

//export { phone_number };
