/// <reference types="cypress" />

describe('example test with cypress', () => {
    beforeEach(() => {
      // Cypress starts out with a blank slate for each test
      cy.testStep("Access search listing page");
      // so we must tell it to visit our website with the `cy.visit()` command.
      // Since we want to visit the same URL at the start of all our tests,
      // we include it in our beforeEach function so that it runs before each test
      cy.visit('https://www.dealerwebsite.co.uk/all-vehicles/')
    })
  
    it('Verify condition filter', () => {
      cy.testStep("Click Used condition");
      cy.get('.ndfe-search-filter--expanded .v-btn__content').contains('Used').click();

      cy.testStep("Verify chip is display");
      cy.get('[data-test="condition"]').find('.v-chip__content').contains('Used').should('be.visible');
    });

    it('Verify Make filter', () => {
      cy.testStep("Click Make filter");
      cy.get('#ndfe-option_make').find('.v-select__slot').click();

      cy.testStep("Select Make");
      cy.get('.v-menu__content').contains('Audi').click();


      cy.testStep("Verify chip is display");
      cy.get('[data-test="manufacturer"]').find('.v-chip__content').contains('Audi').should('be.visible');
    })
  
  })
  
