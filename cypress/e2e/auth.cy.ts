const TEST_USER = {
  login: `testuser_${Date.now()}`,
  password: "Test1234",
};

const BASE_URL = "http://localhost:3000";

describe("Auth Flow", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("shows validation errors when submitting empty sign-in form", () => {
    cy.get('[data-testid="signin-heading"]').should("be.visible");

    cy.get('[data-testid="signin-submit"]').click();

    cy.get('[data-testid="signin-login-error"]').should("be.visible");
    cy.get('[data-testid="signin-password-error"]').should("be.visible");
  });

  it("shows an error when signing in with non-existent user", () => {
    cy.get('[data-testid="signin-login"]').type("nonexistent_user_xyz");
    cy.get('[data-testid="signin-password"]').type("wrongpassword");

    cy.get('[data-testid="signin-submit"]').click();

    cy.get('[data-testid="signin-error"]', { timeout: 10000 })
      .should("exist")
      .and("be.visible");
  });

  it("navigates to sign-up and validates the form", () => {
    cy.get('[data-testid="signin-to-signup"]').click();

    cy.get('[data-testid="signup-heading"]')
      .scrollIntoView()
      .should("be.visible");

    cy.get('[data-testid="signup-submit"]').click();

    cy.get('[data-testid="signup-login-error"]').should("be.visible");
    cy.get('[data-testid="signup-password-error"]').should("be.visible");
    cy.get('[data-testid="signup-confirm-password-error"]').should(
      "be.visible"
    );

    cy.get('[data-testid="signup-login"]').type(TEST_USER.login);
    cy.get('[data-testid="signup-password"]').type("123");
    cy.get('[data-testid="signup-confirm-password"]').type("456");

    cy.get('[data-testid="signup-submit"]').click();

    cy.get('[data-testid="signup-password-error"]').should("be.visible");

    cy.get('[data-testid="signup-password"]').clear().type(TEST_USER.password);
    cy.get('[data-testid="signup-confirm-password"]').clear().type("mismatch");

    cy.get('[data-testid="signup-submit"]').click();

    cy.get('[data-testid="signup-confirm-password-error"]').should(
      "be.visible"
    );
  });

  it("registers a new user, lands on dashboard, logs out, and signs back in", () => {
    cy.get('[data-testid="signin-to-signup"]').click();
    cy.get('[data-testid="signup-heading"]')
      .scrollIntoView()
      .should("be.visible");

    cy.get('[data-testid="signup-login"]').type(TEST_USER.login);
    cy.get('[data-testid="signup-password"]').type(TEST_USER.password);
    cy.get('[data-testid="signup-confirm-password"]').type(TEST_USER.password);

    cy.get('[data-testid="signup-submit"]').click();

    cy.url({ timeout: 10000 }).should("include", "/dashboard");
    cy.get('[data-testid="dashboard-heading"]').should("be.visible");

    cy.get('[data-testid="user-menu-button"]').click();
    cy.get('[data-testid="logout-button"]').click();

    cy.url({ timeout: 10000 }).should("eq", `${BASE_URL}/`);
    cy.get('[data-testid="signin-heading"]').should("be.visible");

    cy.get('[data-testid="signin-login"]').type(TEST_USER.login);
    cy.get('[data-testid="signin-password"]').type(TEST_USER.password);

    cy.get('[data-testid="signin-submit"]').click();

    cy.url({ timeout: 10000 }).should("include", "/dashboard");
    cy.get('[data-testid="dashboard-heading"]').should("be.visible");
  });
});
