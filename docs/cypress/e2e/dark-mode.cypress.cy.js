import { describe, expect, it } from 'vitest'
import { cy } from 'cypress'
import { assertPage, goBackHome, navigateTo, visitHome } from './helpers'

describe('Dark Mode', () => {
  const toggleTheme = () => {
    cy.get(`[aria-label="Toggle theme"]`).click()
  }

  const assertTheme = theme =>
    cy.get('html').then(html =>
      expect(html.hasClass('dark')).to.equal(theme === 'dark'))

  it('can toggle on and off', () => {
    visitHome()
    cy.get('html').then((html) => {
      if (html.hasClass('dark')) { toggleTheme() }
      assertTheme('light')
    })

    toggleTheme()
    assertTheme('dark')

    // Ensure Turbo hydrates after navigation.
    navigateTo('Install')
    assertPage({ title: 'Getting Started' })
    assertTheme('dark')

    toggleTheme()
    assertTheme('light')

    goBackHome()

    toggleTheme()
    assertTheme('dark')
  })
})
