export const assertPage = ({ title, content }) => {
  cy.get('h1').should('contain', title)
  if (content) cy.get('p').should('contain', content)
}

export const navigateTo = (title) => {
  cy.get('a').contains(title).click()
  waitForTurbo()
}

export const goBackHome = () => {
  cy.go('back')
  assertPage({ title: 'îles' })
  waitForTurbo()
}

// Give Turbo time to replace the body and activate the scripts.
export const waitForTurbo = () => {
  cy.wait(500)
}
