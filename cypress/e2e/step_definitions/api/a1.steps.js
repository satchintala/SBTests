import { Given } from "@badeball/cypress-cucumber-preprocessor";
//import { writeFile } from "fs";

Given(`Create JSON file with phone numbers`, () => {
  const phone_numbers = {
    ukNumber: Math.floor(7000000000 + Math.random() * 1000000000).toString(),
    ptNumber: Math.floor(910000000 + Math.random() * 1000000).toString(),
    ukBlockNumber: Math.floor(
      7000000000 + Math.random() * 1000000000
    ).toString(),
    ukDeleteNumber: Math.floor(
      7000000000 + Math.random() * 1000000000
    ).toString(),
  };

  const jsonString = JSON.stringify(phone_numbers);
  cy.writeFile("cypress/fixtures/numbers.json", phone_numbers);
  cy.readFile("cypress/fixtures/numbers.json").then((numbers) => {
    expect(numbers).to.be.not.null;
  });
});
