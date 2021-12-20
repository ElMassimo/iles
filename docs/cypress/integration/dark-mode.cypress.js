import { navigateTo, goBackHome, assertPage } from './helpers'

describe('Dark Mode', () => {
  const toggleTheme = () => {
    cy.get(`[aria-label="Toggle theme"]`).click()
  }

  const assertTheme = (theme) =>
    cy.get('html').then(html =>
      expect(html.hasClass('dark')).to.equal(theme === 'dark'))

  it('can toggle on and off', () => {
    cy.visit('/')
    cy.get('html').then(html => {
      if (html.hasClass('dark')) toggleTheme()
      assertTheme('light')
    })

    toggleTheme()
    assertTheme('dark')

    // Ensure Turbo hydrates after navigation.
    navigateTo('Get Started')
    assertPage({ title: 'Getting Started' })
    assertTheme('dark')

    toggleTheme()
    assertTheme('light')

    goBackHome()

    toggleTheme()
    assertTheme('dark')
  })
})
