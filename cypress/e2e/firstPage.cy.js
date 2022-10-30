// https://docs.cypress.io/api/introduction/api.html

describe("Testing", () => {
  it("visit root", () => {
    cy.visit("/");
    cy.contains("Saved tables");
  });
});
