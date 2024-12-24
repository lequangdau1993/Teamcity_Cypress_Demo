/// <reference types="cypress" />

describe('example test with cypress', () => {
  
  it('Verify regression test running', { tags: '@regression' }, () => {
    cy.testStep("regression test has been run");
  });

  it('Verify critical test running', { tags: '@critical' }, () => {
    cy.testStep("critical test has been run");

  })

  it('Verify regression & critical test running', { tags: ['@regression', '@critical'] }, () => {
    cy.testStep("regression & critical test has been run");

  })

  it('Verify smoke test running', { tags: '@smoke' }, () => {
    cy.testStep("smoke test has been run");

  })

  it('Verify normal test without tags running', () => {
    cy.testStep("normal test without tags has been run");
  })
  
})
  
