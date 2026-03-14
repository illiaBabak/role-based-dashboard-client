const ts = Date.now();

const ADMIN = { login: `admin_${ts}`, password: "Test1234" };
const REGULAR = { login: `user_${ts}`, password: "Test1234" };

const UPDATED_NAME = `renamed_${ts}`;

const signIn = (login: string, password: string) => {
  cy.visit("/");
  cy.get('[data-testid="signin-login"]').type(login);
  cy.get('[data-testid="signin-password"]').type(password);
  cy.get('[data-testid="signin-submit"]').click();
  cy.url({ timeout: 10000 }).should("include", "/dashboard");
  cy.get('[data-testid="dashboard-heading"]').should("be.visible");
};

const signUp = (login: string, password: string, role: "admin" | "user") => {
  cy.visit("/");
  cy.get('[data-testid="signin-to-signup"]').click();
  cy.get('[data-testid="signup-heading"]')
    .scrollIntoView()
    .should("be.visible");
  cy.get('[data-testid="signup-login"]').type(login);
  cy.get('[data-testid="signup-password"]').type(password);
  cy.get('[data-testid="signup-confirm-password"]').type(password);
  if (role === "admin") {
    cy.get('[data-testid="signup-role-admin"]').click();
  }
  cy.get('[data-testid="signup-submit"]').click();
  cy.url({ timeout: 10000 }).should("include", "/dashboard");
};

const logout = () => {
  cy.get('[data-testid="user-menu-button"]').click();
  cy.get('[data-testid="logout-button"]').click();
  cy.get('[data-testid="signin-heading"]', { timeout: 10000 }).should(
    "be.visible"
  );
};

describe("Users Dashboard", () => {
  before(() => {
    signUp(ADMIN.login, ADMIN.password, "admin");
    logout();

    signUp(REGULAR.login, REGULAR.password, "user");
    logout();
  });

  it("regular user sees only their own profile card", () => {
    signIn(REGULAR.login, REGULAR.password);

    cy.get('[data-testid="profile-card"]').should("have.length", 1);
    cy.get('[data-testid="profile-you-badge"]').should("be.visible");
    cy.get('[data-testid="profile-login"]').should("contain", REGULAR.login);
  });

  it("regular user can edit their name", () => {
    signIn(REGULAR.login, REGULAR.password);

    cy.get('[data-testid="profile-edit-button"]').click();
    cy.get('[data-testid="profile-name-input"]').clear().type(UPDATED_NAME);
    cy.get('[data-testid="profile-save-button"]').click();

    cy.get('[data-testid="profile-save-button"]').should("not.exist");
    cy.get('[data-testid="profile-name"]', { timeout: 10000 }).should(
      "contain",
      UPDATED_NAME
    );
  });

  it("admin sees all users (at least 2 cards)", () => {
    signIn(ADMIN.login, ADMIN.password);

    cy.get('[data-testid="profile-card"]', { timeout: 10000 }).should(
      "have.length.at.least",
      2
    );

    cy.get('[data-testid="profile-you-badge"]').should("exist");
  });

  it("admin switches own role to user and sees only themselves", () => {
    signIn(ADMIN.login, ADMIN.password);

    cy.get('[data-testid="profile-card"]', { timeout: 10000 }).should(
      "have.length.at.least",
      2
    );

    cy.get('[data-testid="profile-you-badge"]')
      .closest('[data-testid="profile-card"]')
      .within(() => {
        cy.get('[data-testid="profile-edit-button"]').click();
        cy.get('[data-testid="profile-role-user"]').click();
        cy.get('[data-testid="profile-save-button"]').click();
      });

    cy.get('[data-testid="profile-card"]', { timeout: 10000 }).should(
      "have.length",
      1
    );
    cy.get('[data-testid="profile-you-badge"]').should("be.visible");
    cy.get('[data-testid="profile-role"]').should("contain", "user");
  });
});
