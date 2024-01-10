import {
  Given,
  Then,
  When,
  Before,
} from "@badeball/cypress-cucumber-preprocessor";
import { anonResponse } from "./anonToken.steps.js";
import { verificationCodeResponse } from "./verificationCode.steps.js";

let mutation, blockUserResponse;

Before(() => {
  cy.readFile("cypress/fixtures/numbers.json").then((numbers) => {
    ukBlockNumber = numbers.ukBlockNumber;
  });
});

Given(`Set the block user API mutation`, () => {
  mutation = `mutation($input: BlockUserInput!){
        blockUser(input: $input) {
        errors,
        user{
            id,
            blockedAt
        }
      }
    }`;
});

When(
  `Send the block user API request with {string}, {string}`,
  (countryCode, prefix) => {
    // if (countryCode == "GB") number = Cypress.env("uk_number");
    // else number = Cypress.env("pt_number");

    cy.request({
      method: "POST",
      url: "/graphql",
      headers: {
        content_type: "application/json",
        accept: "appliaction/json",
        authorization: "Bearer " + anonResponse.body.data.getToken.token,
      },
      body: {
        query: mutation,
        variables: {
          input: {
            phoneNumber: ukBlockNumber,
            countryCode: countryCode,
            prefix: prefix,
          },
        },
      },
    }).then((response) => {
      blockUserResponse = response;
    });
  }
);

Then(`User is blocked`, () => {
  expect(blockUserResponse.status).to.eq(200);
  expect(blockUserResponse.body.data.blockUser.user.id).to.eq(
    verificationCodeResponse.body.data.verificationCode.userId.toString()
  );
  expect(blockUserResponse.body.data.blockUser.user.blockedAt).to.not.equal(
    null
  );
});
