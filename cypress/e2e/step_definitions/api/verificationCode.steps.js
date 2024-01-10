import {
  Given,
  Then,
  When,
  Before,
} from "@badeball/cypress-cucumber-preprocessor";
import { anonResponse } from "./anonToken.steps.js";

let mutation, verificationCodeResponse;

Before(() => {
  cy.readFile("cypress/fixtures/numbers.json").then((numbers) => {
    ukNumber = numbers.ukNumber;
    ptNumber = numbers.ptNumber;
  });
});

Given(`Set verification code input mutation`, () => {
  mutation = `mutation($input: VerificationCodeInput!){
        verificationCode(input: $input) {
        errors,
        token,
        refreshToken,
        verifySuccess,
        userId
      }
   }`;
});

When(
  `Send verification code API request with {string}, {string}, {string}`,
  (countryCode, prefix, vCode) => {
    // if (countryCode == "GB") number = Cypress.env("uk_number");
    // else number = Cypress.env("pt_number");

    if (countryCode == "GB") number = ukNumber;
    else number = ptNumber;

    cy.request({
      method: "POST",
      url: "/graphql",
      headers: {
        content_type: "application/json",
        accept: "application/json",
        authorization: "Bearer " + anonResponse.body.data.getToken.token,
      },
      body: {
        query: mutation,
        variables: {
          input: {
            phoneNumber: number,
            countryCode: countryCode,
            prefix: prefix,
            code: vCode,
          },
        },
      },
    }).then((response) => {
      verificationCodeResponse = response;
    });
  }
);

Then(`Receive verification code status {string}`, (success) => {
  expect(verificationCodeResponse.status).to.eq(200);

  if (success == "true") {
    expect(
      verificationCodeResponse.body.data.verificationCode
    ).to.have.property("verifySuccess", true);
    expect(
      verificationCodeResponse.body.data.verificationCode.userId
    ).to.not.equal(null);
    expect(
      verificationCodeResponse.body.data.verificationCode.userId
    ).to.not.equal(null);
  } else {
    expect(
      verificationCodeResponse.body.data.verificationCode
    ).to.have.property("verifySuccess", false);
    expect(
      verificationCodeResponse.body.data.verificationCode.errors[0]
    ).to.have.string("Verification code does not match or has expired");
  }
});

export { verificationCodeResponse };
