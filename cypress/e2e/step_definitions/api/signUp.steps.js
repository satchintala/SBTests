import {
  Given,
  Then,
  When,
  Before,
} from "@badeball/cypress-cucumber-preprocessor";
import { anonResponse } from "./anonToken.steps.js";
import { verificationCodeResponse } from "./verificationCode.steps.js";

let mutation, signupResponse;

Before(() => {
  cy.readFile("cypress/fixtures/numbers.json").then((numbers) => {
    ukNumber = numbers.ukNumber;
    ptNumber = numbers.ptNumber;
  });
});

Given(`Set signup mutation`, () => {
  mutation = `mutation($input: SignupInput!){
        signup(input: $input) {
            errors,
            token,
            user {
                id,
                consents{
                    consentCode,
                    status
                }
            }
        }
    }`;
});

When(
  `Send signup mutation API request with {string}, {string}, {string}, {string}`,
  (countryCode, prefix, gender, dob) => {
    // if (countryCode == "GB") number = Cypress.env("uk_number");
    // else number = Cypress.env("pt_number");

    if (countryCode == "GB") number = ukNumber;
    else number = ptNumber;

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
            phoneNumber: number,
            countryCode: countryCode,
            prefix: prefix,
            termsAgreed: true,
            marketingAgreed: true,
            parentalConsentAgreed: true,
            dateOfBirth: dob,
            gender: gender,
          },
        },
      },
    }).then((response) => {
      signupResponse = response;
    });
  }
);

Then(`Receive user signup status`, () => {
  expect(signupResponse.status).to.eq(200);
  expect(signupResponse.body.data.signup.user.id).to.eq(
    verificationCodeResponse.body.data.verificationCode.userId.toString()
  );
});

export { signupResponse };
