import { visitHome, navigateTo, goBackHome, assertPage } from "./helpers"

describe("DocSearch", () => {
  const openSearchModal = () => {
    cy.get(`.nav-bar-button[aria-label="Search"]`).click()
    searchModal().should("be.visible")
  }

  const openSearchModalWithKeyboard = () => {
    cy.wait(100) // Give Turbo time to replace the body.
    cy.get("body").type("{cmd+k}")
    searchModal().should("be.visible")
  }

  const searchModal = () => cy.get(".DocSearch-Modal")

  const closeSearchModal = () => {
    cy.get("body").type("{esc}")
    searchModal().should("not.exist")
  }

  it("can open by clicking or with keystroke", () => {
    visitHome()
    openSearchModal()
    closeSearchModal()

    openSearchModalWithKeyboard()
    closeSearchModal()

    // Ensure Turbo reactivates the islands.
    navigateTo("FAQs")
    assertPage({ title: "FAQs" })

    openSearchModal()
    closeSearchModal()

    goBackHome()
    openSearchModalWithKeyboard()
    closeSearchModal()
  })

  it("can search and navigate to a result", () => {
    visitHome()
    openSearchModal()

    // Type a search query.
    cy.get(".DocSearch-Input").type("hydration")
    cy.get(".DocSearch-Hit", { timeout: 10000 }).should("exist")

    // Click the first result.
    cy.get(".DocSearch-Hit").first().click()

    // Verify navigation happened — should be on a page about hydration.
    cy.url().should("include", "hydration")
    cy.get("h1")
      .invoke("text")
      .then((text) => {
        expect(text.toLowerCase()).to.include("hydration")
      })
  })

  it("search works after turbo navigation", () => {
    visitHome()

    // Navigate to another page via sidebar link.
    navigateTo("FAQs")
    assertPage({ title: "FAQs" })

    // Search should still work after turbo navigation.
    openSearchModalWithKeyboard()
    closeSearchModal()

    openSearchModal()
    closeSearchModal()
  })
})
