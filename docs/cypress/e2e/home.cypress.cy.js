import { visitHome, navigateTo, assertPage, goBackHome } from './helpers'

describe('The Home Page', () => {
  it('successfully loads', () => {
    visitHome()
    assertPage({ title: 'îles', content: 'The Joyful Site Generator' })
    cy.get('section')
      .should('contain', 'Partial Hydration')
      .should('contain', 'Ship JS only for the interactive bits')

    navigateTo('Get Started')
    assertPage({ title: 'Introduction' })
    cy.get('aside').should('contain', '🧱 Layouts and Components')
    cy.get('blockquote').should('contain', 'Project Status: Beta')

    goBackHome()
  })
})
