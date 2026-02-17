
describe("Login Navigation", () => {
  it("should navigate to the login page when the login button is clicked", () => {
    // Visit the home page
    cy.visit("/");

    // Find the login button and click it
    // The button has a data-testid="login-button"
    cy.get('[data-testid="login-button"]').click();

    // Verify the URL changes to /login
    cy.url().should("include", "/login");
  });
});
