import { test, describe, expect } from "vite-plus/test"

import layout from "/src/layouts/default.vue"

describe("layouts", () => {
  test("stub default layout", () => {
    expect(layout.name).toEqual("DefaultLayout")
  })
})
