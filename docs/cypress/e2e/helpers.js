import { cy } from 'cypress'

export const assertPage = ({ title, content }) => {
  cy.get('h1').should('contain', title)
  if (content) { cy.get('p').should('contain', content) }
}

export const navigateTo = (title) => {
  cy.get('a').contains(title).click()
  waitForHydration()
}

export const visit = (path) => {
  cy.visit(path)
  waitForHydration()
}

export const visitHome = () =>
  visit('/')

export const goBackHome = () => {
  cy.go('back')
  assertPage({ title: 'îles' })
  waitForHydration()
}

// Wait until the relevant islands are hydrated.
export const waitForHydration = () => {
  cy.wait(100)
  cy.get('#ile-1[hydrated]').should('have.length', 1)
  cy.get('#ile-2[hydrated]').should('have.length', 1)
  cy.get('#ile-3[hydrated]').should('have.length', 1)
}
