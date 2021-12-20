import { navigateTo, goBackHome, assertPage } from './helpers'

describe('DocSearch', () => {
  const openSearchModal = () => {
    cy.get(`.nav-bar-button[aria-label="Search"]`).click()
    searchModal().should('be.visible')
  }

  const openSearchModalWithKeyboard = () => {
    cy.wait(100) // Give Turbo time to replace the body.
    cy.get('body').type('{cmd+k}')
    searchModal().should('be.visible')
  }

  const searchModal = () =>
    cy.get('.DocSearch-Modal')

  const closeSearchModal = () =>{
    cy.get('body').type('{esc}')
    searchModal().should('not.exist')
  }

  it('can open by clicking or with keystroke', () => {
    cy.visit('/')
    openSearchModal()
    closeSearchModal()

    openSearchModalWithKeyboard()
    closeSearchModal()

    // Ensure Turbo reactivates the islands.
    navigateTo('FAQs')
    assertPage({ title: 'FAQs' })

    openSearchModal()
    closeSearchModal()

    goBackHome()
    openSearchModalWithKeyboard()
    closeSearchModal()
  })
})
