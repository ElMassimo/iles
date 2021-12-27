export const assertPage = ({ title, content }) => {
  cy.get('h1').should('contain', title)
  if (content) cy.get('p').should('contain', content)
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

// Give Turbo time to replace the body and activate the scripts.
export const waitForHydration = () => {
  cy.wait(300)
}
