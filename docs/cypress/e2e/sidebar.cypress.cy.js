import { describe, it, test } from 'vitest'
import { cy } from 'cypress'
import { assertPage, visit, visitHome, waitForHydration } from './helpers'

describe('Sidebar Toggle', () => {
  const sidebar = () =>
    cy.get('#sidebar-panel')

  const sidebarToggle = () =>
    cy.get(`button[aria-label="Toggle Sidebar"]`)

  const openSidebar = () => {
    sidebarToggle().click()
    sidebar().should('be.visible')
  }

  const closeSidebar = () => {
    cy.get(`button[aria-label="Close Sidebar"]`).click()
    sidebar().should('not.be.visible')
  }

  it('is always open in mobile', () => {
    visitHome()
    visit('/guide/markdown')
    sidebar().should('be.visible')
    sidebarToggle().should('not.be.visible')
  })

  test.skipIf(process.env.CI)('can open in mobile', () => {
    visitHome()
    cy.viewport(500, 720)
    visit('/guide/frameworks')
    openSidebar()
    closeSidebar()

    // Ensure Turbo reactivates the islands.
    openSidebar()
    sidebar().contains('Config').click()

    // Give Turbo time to replace the body.
    waitForHydration()
    assertPage({ title: 'Config' })
    sidebar().should('not.be.visible')

    openSidebar()
    closeSidebar()
  })
})
