import {
  Given,
  Then,
  When,
  Before,
} from "@badeball/cypress-cucumber-preprocessor";
import { verificationCodeResponse } from "./verificationCode.steps.js";
import { signupResponse } from "./signUp.steps.js";

let mutation, deleteUserResponse;

Before(() => {
  cy.readFile("cypress/fixtures/numbers.json").then((numbers) => {
    ukDeleteNumber = numbers.ukDeleteNumber;
  });
});

Given(`Set the delete user API mutation`, () => {
  mutation = `mutation($input: DeleteInput!){
    deleteUser(input: $input) {
        __typename,
        ... on DeleteUser {
                id
        }
        ... on BasicError {
                message 
        } 
    }
 }`;
});

When(`Send the delete user API request`, () => {
  cy.request({
    method: "POST",
    url: "/graphql",
    headers: {
      content_type: "application/json",
      accept: "appliaction/json",
      authorization: "Bearer " + signupResponse.body.data.signup.token,
    },
    body: {
      query: mutation,
      variables: {
        input: {},
      },
    },
  }).then((response) => {
    deleteUserResponse = response;
  });
});

Then(`User is deleted`, () => {
  expect(deleteUserResponse.status).to.eq(200);
  expect(deleteUserResponse.body.data.deleteUser).to.have.property(
    "__typename",
    "DeleteUser"
  );
  expect(deleteUserResponse.body.data.deleteUser.id).to.eq(
    verificationCodeResponse.body.data.verificationCode.userId.toString()
  );
});
