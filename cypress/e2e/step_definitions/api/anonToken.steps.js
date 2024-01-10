import { Given, Then, When } from "@badeball/cypress-cucumber-preprocessor";

let query, anonResponse, anonToken;
Given(`Set the anonymous token API query`, () => {
  query = `query($applicationKey: String!){
        getToken(applicationKey: $applicationKey) {
            __typename,
            ... on ApiToken{
                    token
            },
            ... on BasicError{
                   message
            }
        }
    }`;
});

When(
  `Send the anonymous token request with applicationKey {string}`,
  (applicationKey) => {
    cy.request({
      method: "POST",
      url: "/graphql",
      failOnStatusCode: false,
      headers: {
        content_type: "application/json",
        accept: "application/json",
      },
      body: {
        query: query,
        variables: {
          applicationKey: applicationKey,
        },
      },
    }).then((response) => {
      anonResponse = response;
    });
  }
);

Then(`Receive anonymous token`, () => {
  expect(anonResponse.status).to.eq(200);
  if (anonResponse.body.data.getToken.__typename == "ApiToken") {
    expect(anonResponse.body.data.getToken.token).to.exist;
  } else if (anonResponse.body.data.getToken.__typename == "BasicError") {
    expect(anonResponse.body.data.getToken.message).to.include(
      "invalid application_key"
    );
  }
});

export { anonResponse };
