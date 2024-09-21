/// <reference types="cypress" />

describe('example to-do app', () => {
    beforeEach(() => {
      cy.visit('https://www.dealerwebsite.co.uk/all-vehicles/')
    })
  
    it('displays two todo items by default', () => {      
      cy.get('[title="Used"]').click();
    });

  })
  
