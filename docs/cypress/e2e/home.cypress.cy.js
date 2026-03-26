import { visitHome, navigateTo, assertPage, goBackHome } from "./helpers"

describe("The Home Page", () => {
  it("successfully loads", () => {
    visitHome()
    assertPage({ title: "îles", content: "The Joyful Site Generator" })
    cy.get("section")
      .should("contain", "Partial Hydration")
      .should("contain", "Ship JS only for the interactive bits")

    navigateTo("Get Started")
    assertPage({ title: "Introduction" })
    cy.get("aside").should("contain", "🧱 Layouts and Components")
    cy.get("blockquote").should("contain", "Project Status: Beta")

    goBackHome()
  })

  it("serves a valid pwa-manifest.json", () => {
    cy.request("/pwa-manifest.json").then((response) => {
      expect(response.status).to.eq(200)
      expect(response.headers["content-type"]).to.include("application/json")
      expect(response.body.name).to.eq("îles")
      expect(response.body.theme_color).to.eq("#5C7E8F")
      expect(response.body.icons).to.have.length(3)
    })
  })
})
